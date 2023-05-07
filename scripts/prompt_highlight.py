import os
from scripts import themelist
import gradio as gr
from modules import script_callbacks, shared
import json

script_path = os.path.dirname(os.path.realpath(__file__))
project_path = os.sep.join(__file__.split(os.sep)[0:-2])

def on_ui_settings():
    PHL_SECTION = ("sd-prompt-highlight", "Prompt Highlight")
    # enable in settings
    shared.opts.add_option("prompt_highlight_enabled", shared.OptionInfo(True, "Enable Prompt Highlight", section=PHL_SECTION))
    shared.opts.add_option("prompt_highlight_theme", shared.OptionInfo("None", "Textbox Theme", gr.Dropdown, lambda: {"choices": ["None"] + themelist.getThemeDisplayList()}, section=PHL_SECTION))
    shared.opts.add_option("prompt_highlight_font_size", shared.OptionInfo(12, "Prompt font size", section=PHL_SECTION))
    shared.opts.add_option("prompt_highlight_display_invisible_char", shared.OptionInfo(False, "Display invisible char", section=PHL_SECTION))
    shared.opts.add_option("prompt_highlight_weight_coloring", shared.OptionInfo(True, "Prompt weight coloring", section=PHL_SECTION))
    shared.opts.add_option("prompt_highlight_theme_id", shared.OptionInfo(json.dumps(themelist.getThemeSelectMap()), "Theme id", section=PHL_SECTION, component_args={"visible": False})) #

script_callbacks.on_ui_settings(on_ui_settings)