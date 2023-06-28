import os
import json
import re
import math
script_path = os.path.dirname(os.path.realpath(__file__))
project_path = os.sep.join(__file__.split(os.sep)[0:-2])
color_list = None
def getColor():
    color_json_path = os.path.join(script_path, "color.json")
    with open(os.path.realpath(color_json_path), 'r', encoding='utf8') as f:
        color_json = json.load(f)
        return color_json

def _get_effective_prompt(prompts: list[str], prompt: str) -> str:
    return prompts[0] if prompts else prompt

def get_prompts(p):
    original_prompt = _get_effective_prompt(p.all_prompts, p.prompt)
    original_negative_prompt = _get_effective_prompt(
        p.all_negative_prompts,
        p.negative_prompt,
    )
    return original_prompt, original_negative_prompt

re_color_def = re.compile(r"\(\s*([\+\-]?[\d\.]+)\s*,\s*([\+\-]?[\d\.]+)\s*,\s*([\+\-]?[\d\.]+)\s*\)")
re_color_def_ful = re.compile(r"(rgb\(\s*([\+\-]?[\d\.]+)\s*,\s*([\+\-]?[\d\.]+)\s*,\s*([\+\-]?[\d\.]+)\s*\))")

def load_json_number(input) -> float:
    try:
        return float(str(input))
    except Exception:
        return 0

def parse_color(color):
    matcher = re.search(re_color_def, color)
    return (load_json_number(matcher.group(1)),load_json_number(matcher.group(2)),load_json_number(matcher.group(3)))

def color_diff(color1, color2):
    r_diff = color1[0]-color2[0]
    g_diff = color1[1]-color2[1]
    b_diff = color1[2]-color2[2]
    return math.sqrt(r_diff*r_diff + g_diff*g_diff + b_diff*b_diff)

def getCloseColor(input_color):
    global color_list
    if color_list is None:
        color_list = getColor()
    test_color = parse_color(input_color)
    min_color = None
    min_diff = color_diff(parse_color("rgb(255,255,255)"),parse_color("rgb(-255,-255,-255)"))
    for color in color_list.keys():
        current_color = parse_color(color_list[color])
        calced_diff = color_diff(test_color, current_color)
        if calced_diff < min_diff:
            min_diff = calced_diff
            min_color = (color, current_color)
    return min_color[0], min_color[1], min_diff

def replaceColorString(input_string):
    def replaceColor(match_pt : re.Match):
        color_str = match_pt.group(0)
        close_color, close_val, loss = getCloseColor(color_str)
        return close_color
    return re.sub(re_color_def_ful, replaceColor, input_string)

def replaceColorPrompt(prompts):
    for i in range(len(prompts)):
        prompts[i] = replaceColorString(prompts[i])
    return prompts

