import sys
import os
import src.project_tools as utils

utils.setCwdPath(os.getcwd())
utils.setRootPath(os.path.dirname(os.path.realpath(__file__)))

def init_dev():
    print("install dev!")
    utils.install()
    utils.compile_ace()

if "--dev" in sys.argv:
    init_dev()
    print("Successfully installed sd-webui-prompt-highlight for Development.")
else:
    print("load sd-webui-prompt-highlight for WebUI. for Development try 'python install.py --dev'")
    utils.install_requirements()
