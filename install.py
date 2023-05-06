import sys
import os
import re
import subprocess
import shutil
from distutils.dir_util import copy_tree

prevdir = os.getcwd()
git = os.environ.get('GIT', "git")

def pip_install(*args):
    output = subprocess.check_output(
        [sys.executable, "-m", "pip", "install"] + list(args),
        stderr=subprocess.STDOUT,
        )
    for line in output.decode().split("\n"):
        if "Successfully installed" in line:
            print(line)

def install_requirements():
    req_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "requirements.txt")
    try:
        pip_install("-r", req_file)
    except subprocess.CalledProcessError as grepexc:
        error_msg = grepexc.stdout.decode()
        print_requirement_installation_error(error_msg)
        raise grepexc

def print_requirement_installation_error(err):
    print("# Requirement installation exception:")
    for line in err.split('\n'):
        line = line.strip()
        if line:
            print(line)

def git_clone(url, dir, name, commithash=None):
    # TODO clone into temporary dir and move if successful

    if os.path.exists(dir):
        if commithash is None:
            return

        current_hash = run(f'"{git}" -C "{dir}" rev-parse HEAD', None, f"Couldn't determine {name}'s hash: {commithash}").strip()
        if current_hash == commithash:
            return

        run(f'"{git}" -C "{dir}" fetch', f"Fetching updates for {name}...", f"Couldn't fetch {name}")
        run(f'"{git}" -C "{dir}" checkout {commithash}', f"Checking out commit for {name} with hash: {commithash}...", f"Couldn't checkout commit {commithash} for {name}")
        return

    run(f'"{git}" clone "{url}" "{dir}"', f"Cloning {name} into {dir}...", f"Couldn't clone {name}")

    if commithash is not None:
        run(f'"{git}" -C "{dir}" checkout {commithash}', None, "Couldn't checkout {name}'s hash: {commithash}")

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

def get_npm_ver():
    output = subprocess.check_output(["npm", "-v"], shell=True,
        stderr=subprocess.STDOUT,
    )
    match = re.search(r"\d+(\.\d+)?",str(output)) 
    if not match:
        return True
    return float(match.group(0))

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
    print("install dev!")
    install_requirements()
    npm_ver = None
    try:
        npm_ver = get_npm_ver() 
    except Exception:
        pass
    if npm_ver is None:
        print("# Node.js Not Found! please install Node.js first.")
        raise Exception("Installation failed! Node.js Not Found! please install Node.js first.")
    file_path = os.path.dirname(os.path.realpath(__file__))
    ace_path = os.path.join(file_path, "lib", "ace")
    mode_path = os.path.join(ace_path, "src", "mode")
    lib_path = os.path.join(file_path, "lib")
    if not os.path.exists(lib_path):
        os.makedirs(lib_path)
    git_clone("https://github.com/ajaxorg/ace.git", ace_path, "ace")
    with cd(ace_path):
        run(f'npm install', f"installing ace...", f"Couldn't install ace")
        with cd("tool\\"):
            run(f'npm install', f"installing ace tool...", f"Couldn't install ace tool")
            run(f'node add_mode.js SDPrompt "extension1|extension2"', f"add SDPrompt syntax...", f"Couldn't install ace tool")
        for js_file in ["sdprompt.js", "sdprompt_highlight_rules.js"]:
            shutil.copy(os.path.join(file_path, "src", js_file), mode_path)
        shutil.rmtree(os.path.join(ace_path, "build"))
        run(f'node {os.path.join(ace_path, "Makefile.dryice.js")}', f"compile ace...", f"Couldn't compile ace")
    copy_tree(os.path.join(ace_path, "build", "src"), os.path.join(file_path, "ace"))
    copy_tree(os.path.join(ace_path, "build", "css"), os.path.join(file_path, "ace", "css"))

if "--dev" in sys.argv:
    init_dev()
else:
    print("load sd-webui-prompt-highlight for WebUI.")