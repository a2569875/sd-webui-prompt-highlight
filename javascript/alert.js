(function(){

function module_init() {
    function AlertSystem(tab){
		this.tabname = tab;
        let obj = null; 
        for(const selector of ["",".","#"]){
            if(!prompthighl.is_empty(obj))break;
            obj = document.querySelector(selector+"tab_"+this.tabname);
        }
        obj = obj||document.querySelector("gradio-app")||document.body;
        this.parent = obj;
        if (this.parent.querySelectorAll(".oo-ui-alert-area").length > 0)
            this.alert_area = this.parent.querySelectorAll(".oo-ui-alert-area")[0];
        else {
            this.alert_area = document.createElement("div");
            this.parent.prepend(this.alert_area);
        } 
        this.alert_area.classList.add("oo-ui-alert-area");
        
	}
    function AlertBox(type, message, system){
        this.controller = system;
        this.type = (prompthighl.is_empty(type) ? "normal" : type).toLowerCase().replace(/!/g, "");
        this.title = type;
        this.message = message;
        this.is_closed = true;
    }
    AlertBox.prototype.Show = function(){
        this.is_closed = false;
        this.Create();
    }
    AlertBox.prototype.Close = function(){
        this.body.style.display='none';
        window.setTimeout(function(self){
            return event =>{
                self.is_closed = true;
                self.body.remove();
            }
        },500);
    }
    AlertBox.prototype.PlayClose = function(){
        this.close_btn.style.display='none';
        this.body.style.opacity = "0";
        setTimeout((function(self) {
            return ()=>{
                self.Close();
            }
        })(this), 600);
    }

    AlertBox.prototype.Create = function(){
        this.body = document.createElement("div");
        this.body.classList.add("oo-ui-alert-box");
        this.body.classList.add(this.type);
        this.body.innerHTML = this.message;
        let title = document.createElement("strong");
        title.innerHTML = this.title;
        this.body.prepend(title);

        this.close_btn = document.createElement("span");
        this.close_btn.classList.add("oo-ui-alert-closebtn");
        this.close_btn.innerHTML = "&times;";
        this.body.prepend(this.close_btn);

        this.close_btn.addEventListener("click",(function(self){
            return event =>{
                self.PlayClose();
            }
        })(this))

        this.controller.alert_area.appendChild(this.body);
    }

    AlertSystem.prototype.Show = function(type, message){
        let box = new AlertBox(type, message, this);
        box.Show();
        setTimeout((function(box_self, self) {
            return ()=>{
                box_self.PlayClose();
            }
        })(box, this), 7500);
    }
	prompthighl.AlertSystem = AlertSystem;
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