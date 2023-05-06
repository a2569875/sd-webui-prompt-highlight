import os
import sys
import shutil
import subprocess
from distutils.dir_util import copy_tree

def run(command, desc=None, errdesc=None, custom_env=None, live=False):
    if desc is not None:
        print(desc)

    if live:
        result = subprocess.run(command, shell=True, env=os.environ if custom_env is None else custom_env)
        if result.returncode != 0:
            raise RuntimeError(f"""{errdesc or 'Error running command'}.
Command: {command}
Error code: {result.returncode}""")

        return ""

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, env=os.environ if custom_env is None else custom_env)

    if result.returncode != 0:

        message = f"""{errdesc or 'Error running command'}.
Command: {command}
Error code: {result.returncode}
stdout: {result.stdout.decode(encoding="utf8", errors="ignore") if len(result.stdout)>0 else '<empty>'}
stderr: {result.stderr.decode(encoding="utf8", errors="ignore") if len(result.stderr)>0 else '<empty>'}
"""
        raise RuntimeError(message)

    return result.stdout.decode(encoding="utf8", errors="ignore")

class cd:
    """Context manager for changing the current working directory"""
    def __init__(self, newPath):
        self.newPath = os.path.expanduser(newPath)

    def __enter__(self):
        self.savedPath = os.getcwd()
        os.chdir(self.newPath)

    def __exit__(self, etype, value, traceback):
        os.chdir(self.savedPath)

def init_dev():
    file_path = os.path.dirname(os.path.realpath(__file__))
    ace_path = os.path.join(file_path, "lib", "ace")
    mode_path = os.path.join(ace_path, "src", "mode")
    with cd(ace_path):
        with cd("tool\\"):
            run(f'node add_mode.js SDPrompt "extension1|extension2"', f"add SDPrompt syntax...", f"Couldn't install ace tool")
        for js_file in ["sdprompt.js", "sdprompt_highlight_rules.js"]:
            shutil.copy(os.path.join(file_path, "src", js_file), mode_path)
        shutil.rmtree(os.path.join(ace_path, "build"))
        run(f'node {os.path.join(ace_path, "Makefile.dryice.js")}', f"compile ace...", f"Couldn't compile ace")
    copy_tree(os.path.join(ace_path, "build", "src"), os.path.join(file_path, "ace"))
    copy_tree(os.path.join(ace_path, "build", "css"), os.path.join(file_path, "ace", "css"))
init_dev()