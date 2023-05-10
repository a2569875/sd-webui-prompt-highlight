import os
from scripts import themelist
from scripts import my_init
from scripts import myutils as scripts_utils
import gradio as gr
from modules import script_callbacks, shared
import modules.scripts as scripts
from modules.processing import StableDiffusionProcessing
import json

script_path = os.path.dirname(os.path.realpath(__file__))
project_path = os.sep.join(__file__.split(os.sep)[0:-2])

my_init.check_conflict()

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

class Script(scripts.Script):
    def title(self):
        return ""

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        pass

    def process(self, p: StableDiffusionProcessing):
        original_prompt, original_negative_prompt = scripts_utils.get_prompts(p)
        prompts = [original_prompt if original_prompt is not None else ""] if isinstance(original_prompt, str) else original_prompt
        negative_prompts = [original_negative_prompt if original_negative_prompt is not None else ""] if isinstance(original_negative_prompt, str) else original_negative_prompt
        p.all_prompts = scripts_utils.replaceColorPrompt(prompts)
        p.all_negative_prompts = scripts_utils.replaceColorPrompt(negative_prompts)
        p.prompt_for_display = original_prompt
        p.prompt = original_prompt

