"""
Fix mojibake in quiz.html: UTF-8 bytes were interpreted as CP1251, so
each run of non-ASCII chars can be fixed by encoding back to CP1251 bytes
then decoding as UTF-8.  Correctly-encoded Russian (А-Я, а-я as CP1251
bytes) does NOT form valid UTF-8, so those segments are left untouched.
"""

def fix_mojibake(text):
    result = []
    i = 0
    n = len(text)
    while i < n:
        c = text[i]
        if ord(c) <= 0x7F:
            result.append(c)
            i += 1
        else:
            # collect a run of non-ASCII chars
            j = i
            while j < n and ord(text[j]) > 0x7F:
                j += 1
            segment = text[i:j]
            try:
                fixed = segment.encode('cp1251').decode('utf-8')
                result.append(fixed)
            except (UnicodeEncodeError, UnicodeDecodeError):
                result.append(segment)
            i = j
    return ''.join(result)


path = r'C:\Users\Lenovo\Projects\myapp\quiz.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

fixed = fix_mojibake(content)

# Sanity check: count remaining garbled-looking sequences
import re
garbled = re.findall(r'[А-Яа-яЁёЎЄІЇ]{2,}', fixed)
print(f"Remaining Cyrillic sequences: {len(garbled)}")
if garbled:
    print("Samples:", garbled[:10])

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed)

print("Done — quiz.html rewritten.")
