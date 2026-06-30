import os
import glob

directory = r'c:\Users\PC\Documents\optuce\frontend\src'
for filepath in glob.iglob(directory + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    if 'api.optuce.baitul.tech' in content:
        new_content = content.replace('api.optuce.baitul.tech', 'back.baitul.tech')
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Updated {filepath}')
