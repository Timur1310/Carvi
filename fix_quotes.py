import re

with open(r'C:\Users\Lenovo\Projects\myapp\quiz.html', encoding='utf-8') as f:
    content = f.read()

def fix_js_quotes(match):
    s = match.group(0)
    s = s.replace('‘', "'").replace('’', "'")
    s = s.replace('“', '"').replace('”', '"')
    return s

fixed = re.sub(r'<script>[\s\S]*?</script>', fix_js_quotes, content)

with open(r'C:\Users\Lenovo\Projects\myapp\quiz.html', 'w', encoding='utf-8') as f:
    f.write(fixed)

print('Done')
