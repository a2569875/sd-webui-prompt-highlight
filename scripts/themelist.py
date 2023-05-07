import os
from scripts.nodepyjs import require

themelist = {'themes': []}
themelistpy = []
loadded = False

script_path = os.path.dirname(os.path.realpath(__file__))
project_path = os.sep.join(__file__.split(os.sep)[0:-2])

def loadThemeList():
    global themelist
    global loadded
    global themelistpy
    if not loadded:
        loadded = True
        themelist = require(os.path.join(project_path, "ace", "ext-themelist.js"), "ace/ext/themelist")
        themelistpy = []
        for theme in themelist["themes"]:
            themelistpy.append(theme)
    return themelist

def getThemeKeyList(key):
    loadThemeList()
    result = []
    for theme in themelistpy:
        result.append(theme[key])
    return result

def ThemeDisplay(theme):
    CAPTION = ("caption",)
    isDark = "Dark" if theme["isDark"] else "Bright" 
    return f"{theme[CAPTION[0]]} ({isDark})"

def getThemeDisplayList():
    loadThemeList()
    result = []
    for theme in themelistpy:
        result.append(ThemeDisplay(theme))
    return result

def getThemeSelectMap():
    loadThemeList()
    result = {}
    for theme in themelistpy:
        result[ThemeDisplay(theme)] = theme
    return result
