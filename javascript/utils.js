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