import os
import json
import sys
import re
from modules import cmd_args
from modules.paths_internal import extensions_dir

args, _ = cmd_args.parser.parse_known_args()

def list_extensions(settings_file):
    settings = {}

    try:
        if os.path.isfile(settings_file):
            with open(settings_file, "r", encoding="utf8") as file:
                settings = json.load(file)
    except Exception as e:
        print(e, file=sys.stderr)

    disabled_extensions = set(settings.get('disabled_extensions', []))
    disable_all_extensions = settings.get('disable_all_extensions', 'none')

    if disable_all_extensions != 'none':
        return []

    return [x for x in os.listdir(extensions_dir) if x not in disabled_extensions]

def get_args(key, value):
    if hasattr(args, key):
        result = getattr(args, key)
        return result if result is not None else value
    return value

def check_conflict():
    for dirname_extension in list_extensions(settings_file=get_args("ui_settings_file", "")):
        extension_root = os.path.join(extensions_dir, dirname_extension)
        check_target = os.path.join(extension_root, "javascript", "bilingual_localization.js")
        if os.path.isfile(check_target):
            if ignortTranslateTextbox(check_target):
                break

JS_TRANSLATE_WORD = "ace_line_group"
TEXTBOX_TOKENS = ["ace_line", "ace_prompttoken", JS_TRANSLATE_WORD]
def ignortTranslateTextbox(file_path):
    with open(file_path, "r", encoding='utf8') as f:
        content = f.read()

    if re.search(JS_TRANSLATE_WORD, content):
        return
    
    pattern = r"([^\n\r\{\}\(\)\[\]\w]+)\s*(const|let|var)\s*ignore_selector\s*=\s*\[[^'\"]+(['\"])"
    match = re.search(pattern, content)

    if match:
        indented = match.group(1)
        var_state = match.group(2)
        string_mark = match.group(3)
        OR_OP = ","
        for i in range(len(TEXTBOX_TOKENS)):
            TEXTBOX_TOKENS[i] = f"{string_mark}{TEXTBOX_TOKENS[i]}{string_mark}"
        new_code = OR_OP.join(TEXTBOX_TOKENS) + OR_OP
        modified_content = content[:match.end()-1] + "\n" + indented + new_code + "\n" + indented + content[match.end()-1:]
        
        with open(file_path, "w", encoding='utf8') as f:
            f.write(modified_content)
            
        print("Textbox setup successfully")
    else:
        return False
    return True