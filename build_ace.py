import os
import json
import src.project_tools as utils

utils.setCwdPath(os.getcwd())
utils.setRootPath(os.path.dirname(os.path.realpath(__file__)))
def compile_ace():
    utils.compile_ace()
    print("Successfully compiled sd-webui-prompt-highlight.")

compile_ace()