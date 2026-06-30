import os
import glob
import re

directory = r'c:\Users\PC\Documents\optuce\frontend\src'

# Pattern: a backtick-started template literal that ends with a single or double quote instead of a backtick
# Matches: `${import.meta.env.VITE_API_URL}/...'/  or  `${import.meta.env.VITE_API_URL}/..."
# The closing quote can be followed by anything (comma, paren, space, newline, etc.)
pattern = re.compile(r'(`\$\{import\.meta\.env\.VITE_API_URL\}[^`\n\'"]*)[\'"]')

def fix_url(match):
    return match.group(1) + '`'

total_fixes = 0
for filepath in glob.iglob(directory + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub(fix_url, content)
    count = len(pattern.findall(content))
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Fixed {count} issue(s) in: {os.path.basename(filepath)}')
        total_fixes += count

print(f'\nTotal fixes: {total_fixes}')
