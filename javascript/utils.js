(function(){

function module_init() {
    prompthighl.getThemeFromOpts = function(){
        if(!prompthighl.prompt_highlight_theme_id){
            prompthighl.prompt_highlight_theme_id = JSON.parse(opts.prompt_highlight_theme_id);
        }
        return prompthighl.prompt_highlight_theme_id[opts.prompt_highlight_theme];
    }
    prompthighl.updateAllTextBox = function(){
        if(prompthighl.textboxList){
            for(const textbox of prompthighl.textboxList){
                textbox.updateOpt();
            }
        }
    }
    
    function is_nullptr(obj) {
        try {
            if (typeof(obj) === "undefined") return true;
            if (obj == undefined) return true;
            if (obj == null) return true;
        } catch (error) {
            return true;
        }
        return false;
    }

    function is_empty(str) {
        if (is_nullptr(str)) return true;
        if ((''+str).trim() === '') return true;
        return false;
    }

    function readFile(url) {
        return new Promise((resolve, reject) => {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            var do_reject = ()=>reject(req);
            req.onerror = do_reject;
            req.onabort = do_reject;
            req.onload = function () {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(req);
                }
            }
            req.send();
        });
    }

    function unescape_string(input_string){
        let result = '';
        const unicode_list = ['u','x'];
        for(var i=0; i<input_string.length; ++i){
            const current_char = input_string.charAt(i);
            if(current_char == '\\'){
                ++i;
                if (i >= input_string.length) break;
                const string_body = input_string.charAt(i);
                if(unicode_list.includes(string_body.toLowerCase())){
                    result += `${current_char}${string_body}`;
                } else {
                    let char_added = false;
                    try {
                        const unescaped = JSON.parse(`"${current_char}${string_body}"`);
                        if (unescaped){
                            result += unescaped;
                            char_added = true;
                        }
                    } catch (error) {
                        
                    }
                    if(!char_added){
                        result += string_body;
                    }
                }
            } else {
                result += current_char;
            }
        }
        return JSON.parse(JSON.stringify(result).replace(/\\\\/g,"\\"));
    }
    prompthighl.is_dark = ()=>!!(document.querySelector(".dark") || gradioApp().querySelector(".dark"));

    prompthighl.call = function(func, ...theArgs){
        if(typeof(func) === typeof(prompthighl.noop_func)){
            return func(...theArgs);
        }
    }

    prompthighl.getColorItem = function(color_token){
        let check_split = color_token.split("_");
        let result = "";
        let color_value = "";
        let title = "";
        for (let i = 4; i > 0; --i){
            if (result !== "") break;
            for (let j = 0; j+i <= check_split.length-1; ++j){
                const check_token = check_split.slice(j,j+i).join("_").toLowerCase();
                if(prompthighl.colorlist[check_token]){
                    result = check_token;
                    color_value = prompthighl.colorlist[check_token];
                    title = check_split.slice(j,j+i).join("_");
                    break;
                }
            }
        }
        if(result !== "") return {
            title: title,
            value: color_value,
            name: result
        };
    }

    prompthighl.readFile = readFile;
    prompthighl.noop_func = ()=>{};
    prompthighl.is_empty = is_empty;
    prompthighl.is_nullptr = is_nullptr;
    prompthighl.unescape_string = unescape_string;
    
}
let module_loadded = false;
document.addEventListener("DOMContentLoaded", () => {
    if (module_loadded) return;
    module_loadded = true;
    module_init();
});
document.addEventListener("load", () => {
    if (module_loadded) return;
    module_loadded = true;
    module_init();
});
})();