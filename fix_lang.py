import os, re

patterns = [
    '''    <div class="lang-switcher">
      <button class="lang-btn active" data-lang="en" onclick="setLang('en')">EN</button>
      <button class="lang-btn" data-lang="ru" onclick="setLang('ru')">RU</button>
    </div>''',
    '''    <div class="lang-switcher">
      <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
      <button class="lang-btn" data-lang="ru" onclick="setLang('ru')">RU</button>
    </div>''',
]

new = '    <button class="lang-toggle" id="langToggle" onclick="toggleLang()">EN</button>'

path = r'C:\Users\Lenovo\Projects\myapp'
for fname in ['index.html', 'cars.html', 'car.html', 'compare.html', 'learn.html', 'quiz.html']:
    fp = os.path.join(path, fname)
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    replaced = False
    for old in patterns:
        if old in content:
            content = content.replace(old, new)
            replaced = True
            break
    if replaced:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(fname, 'updated')
    else:
        print(fname, 'SKIPPED')
