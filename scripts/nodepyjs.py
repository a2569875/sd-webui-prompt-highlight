import os
import js2py

script_path = os.path.dirname(os.path.realpath(__file__))
project_path = os.sep.join(__file__.split(os.sep)[0:-2])
nodejs_core = ""
def getNodeJSCore():
    global nodejs_core
    if nodejs_core.strip() == "":
        with open(os.path.join(script_path, "node.py.js"), encoding='utf8') as f:
            nodejs_core = f.read()
    return nodejs_core

def require(jsfile, module_name):
    js_code = ""
    with open(jsfile, encoding='utf8') as f:
        js_code = f.read()
    required = js2py.eval_js(f"""
        function()\u007B
            {getNodeJSCore()}
            {js_code}
            return require("{module_name}");
        \u007D
    """)
    if required is None:
        raise \
            ModuleNotFoundError(f"No module named '{module_name}' in '{jsfile}'")
    result = None
    try:
        result = required()
    except Exception:
        return required
    if result is None:
        raise \
            ModuleNotFoundError(f"No module named '{module_name}' in '{jsfile}'")
    return result