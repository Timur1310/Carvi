"""
Second-pass encoding fix for quiz.html.
Handles cp1251 byte 0x98 which Python's codec leaves undefined (U+0098).
Build a complete Unicode->byte reverse table and use it instead of Python's codec.
"""

# Build reverse lookup: Unicode codepoint -> cp1251 byte
CP1251_REV = {}

# 0x00-0x7F: ASCII passthrough
for b in range(0x80):
    CP1251_REV[b] = b

# 0x80-0x9F: get from Python's cp1251 decode
for b in range(0x80, 0xA0):
    try:
        ch = bytes([b]).decode('cp1251')
        CP1251_REV[ord(ch)] = b
    except Exception:
        pass  # skip truly undefined (only 0x98)

# 0x98 is undefined in cp1251 — treat as raw passthrough
CP1251_REV[0x98] = 0x98  # U+0098 -> byte 0x98

# 0xA0-0xFF: standard (all defined in cp1251)
for b in range(0xA0, 0x100):
    ch = bytes([b]).decode('cp1251')
    CP1251_REV[ord(ch)] = b


def encode_cp1251(s):
    out = bytearray()
    for ch in s:
        b = CP1251_REV.get(ord(ch))
        if b is None:
            raise UnicodeEncodeError('cp1251', ch, 0, 1, 'no mapping')
        out.append(b)
    return bytes(out)


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
            j = i
            while j < n and ord(text[j]) > 0x7F:
                j += 1
            segment = text[i:j]
            try:
                fixed = encode_cp1251(segment).decode('utf-8')
                result.append(fixed)
            except (UnicodeEncodeError, UnicodeDecodeError):
                result.append(segment)
            i = j
    return ''.join(result)


path = r'C:\Users\Lenovo\Projects\myapp\quiz.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify there are still C1 control chars to fix
import re
c1_count = sum(1 for c in content if 0x80 <= ord(c) <= 0x9F)
print(f'C1 control chars before fix: {c1_count}')

fixed = fix_mojibake(content)

c1_after = sum(1 for c in fixed if 0x80 <= ord(c) <= 0x9F)
print(f'C1 control chars after fix:  {c1_after}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed)

print('Done.')
