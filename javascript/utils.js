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