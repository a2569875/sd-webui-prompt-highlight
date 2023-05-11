let prompthighl = {};
(function(){
	let drag_list = [];
	let extranetworkList = [];
	let extranetworkTable = {};
	var wpoffset = 0;
	
	const scripts = document.getElementsByTagName("script");
	let current_file_name = "";
	for (let script of scripts){
		let src = script.getAttribute("src");
		if((src||"").indexOf("prompt-highlight.js") > -1){
			current_file_name = src;
			break;
		}
	}
	
	if(current_file_name==="") current_file_name = scripts[scripts.length-1].src;
	const ext_path = current_file_name.split(/[\/\\]/).slice(0,-2).join("/");
	function loadScript(path, callback) {
		var head = document.getElementsByTagName("head");
		if(head.length||0 > 0)head = head[0];
		var s = document.createElement('script');

		s.src = path;
		head.appendChild(s);

		s.onload = s.onreadystatechange = function(_, isAbort) {
			if (isAbort || !s.readyState || s.readyState == "loaded" || s.readyState == "complete") {
				s = s.onload = s.onreadystatechange = null;
				if (!isAbort)
					callback();
			}
		};
	}
	function load_css(){
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = [ext_path, "ace", "css", "ace.css"].join("/");
		link.media = 'all';
		head.appendChild(link);
	}
	load_css();

	prompthighl.colorlist = {};
	function loadColorList(){
		prompthighl.readFile([ext_path, "scripts", "color.json"].join("/")).then((res) => {
			prompthighl.colorlist = JSON.parse(res);
		})
		.catch((err) => {
			prompthighl.colorlist = {};
		})
	}

	function has_jquery(){
		try{
			return !!$;
		}catch(ex){
			return false;
		}
		return false;
	}
	
    function my_dispatchEvent(ele,eve){
        try {
            ele.dispatchEvent(eve);
        } catch (error) {
            
        }
    }
	
    function update_inputbox(textbox, text){
        textbox.value = text;
        my_dispatchEvent(textbox, new Event("input", {
            bubbles: true,
            cancelable: true,
        }));
    }

	function next_element(current){
		if(current === null || typeof(current) === typeof(undefined)) return current;
		let next_ptr = current.nextSibling; //next node
		if(next_ptr === null || typeof(next_ptr) === typeof(undefined)){
			let new_line = current.parentElement.nextSibling; //next line
			if(new_line === null || typeof(new_line) === typeof(undefined)){
				let new_group = current.parentElement.parentElement.nextSibling; //next line-group
				if(new_group === null || typeof(new_group) === typeof(undefined))return null;
				if(new_group.classList.contains('ace_line_group'))
					return (((new_group?.childNodes||[])[0])?.childNodes||[])[0];
				return null;
			}
			return (new_line?.childNodes||[])[0];
		}
		return next_ptr;
	}
	
	function TextboxController(textArea, name, tab){
		this.textArea = textArea;
		this.name = name;
		this.tabname = tab;
	}

	TextboxController.prototype.activeloraBinding = function(){
		window.setTimeout((function(self){return ()=>self.doloraBinding();})(this), 0);
	}
	TextboxController.prototype.doloraBinding = function(){
		if(this.isDoloraBinding){
			this.padDoloraBinding = true;
			return;
		}
		this.isDoloraBinding = true;
		this.loraBinding();
		while(this.padDoloraBinding){
			this.padDoloraBinding = false;
			this.loraBinding();
		}
		this.isDoloraBinding = false;
	}

	TextboxController.prototype.loraBinding = function(){
		const search_query = ".ace_extranetwork.ace_type";
		const active_tab = this.tabname;
		const has_lorahelper = ()=>{try{return !!(lorahelper?.show_trigger_words)}catch(ex){return false;}};
		const type_mapping = {
			textual_inversion: ["textualinversion", "textual inversion", "ti", "embed", "embedding", "embeddings", "ebd"],
			hypernetworks: ["hyper", "hypernet", "hypernetwork", "hypernetworks"],
			checkpoints: ["ckpt", "ckp"],
			lora: ["LoRA", "loRA", "low rank adaptation", "low_rank_adaptation"],
			lycoris: ["lyco", "lyCO", "LyCO", "lyCoris", "lyCORIS"]
		};
		const inv_hypermap = (object1=>{
			let inv_mapping = {};
			for (const [key, listVal] of Object.entries(object1)) {
				inv_mapping[key] = key;
				for (const value of listVal) {
					inv_mapping[value] = key;
				}
			}
			return inv_mapping;
		})(type_mapping);
		const data_map = {
			textual_inversion: "ti",
			hypernetworks: "hyper",
			checkpoints: "ckp",
			lora: "lora",
			lycoris: "lyco"
		};
		function check_start(input, pattern){
			return input.trim().startsWith(pattern);
		}
		if(extranetworkTable?.textual_inversion && ((extranetworkTable?.ti_pattern)||"").trim()!==""){
			let node_ptr = (((this.editor.container.querySelector(".ace_text-layer")?.childNodes||[])[0]?.childNodes||[])[0]?.childNodes||[])[0];
			let node_list = [];
			for(let ptr = node_ptr; ptr !== null && typeof(ptr) !== typeof(undefined); ptr = next_element(ptr)) {
				let ptr_inner = ptr.textContent || ptr.innerText || ptr.innerHTML;
				if (ptr_inner) {
					let tokens = ptr_inner.split(/[\s,]/);
					if(tokens.join(" ").trim()==="")continue;
					for(const token of tokens){
						const trim_token = token.trim();
						if(trim_token === "")continue;
						if(extranetworkTable.ti_pattern.indexOf(trim_token) >= 0){
							node_list.push(ptr);
							break;
						}
					}
				}
			}
			let maybe_nodes = [];
			for(let i=0; i<node_list.length; ++i){
				let ptr = node_list[i];
				let ptr_inner = ptr.textContent || ptr.innerText || ptr.innerHTML;
				let new_node = ptr;
				let html = ptr_inner.replace(/[^,\s]+|[,\:\|]/g,function(str){
					if(extranetworkTable.ti_pattern.indexOf(str)>-1||str===","||str===":"||str==="|")return `<span class="ace_maybeti">${str}</span>`;
					return str;
				});
				if (ptr.nodeType === Node.TEXT_NODE){
					new_node = $(`<span>${html}</span>`)[0];
					ptr.parentNode.replaceChild(new_node, ptr);
				} else {
					if(ptr.classList.contains("ace_lora_already"))continue;
					ptr.classList.add("ace_lora_already");
					new_node.innerHTML = html;
				}
				let maybe_node_list = new_node.querySelectorAll(".ace_maybeti");
				for(let j=0; j<maybe_node_list.length; ++j){
					maybe_nodes.push(maybe_node_list[j]);
				}
			}
			let ti_name = "";
			let element_list = [];
			let elements = [];
			for(let i=0; i<maybe_nodes.length; ++i){
				let ptr = maybe_nodes[i];
				let ptr_inner = ptr.textContent || ptr.innerText || ptr.innerHTML;
				if (ptr_inner) {
					let should_add = true;
					if(ptr_inner===","||ptr_inner===":"||ptr_inner==="|"){
						element_list = [];
						ti_name = "";
						continue;
					}
					if(ti_name === ""){
						for (const [key, value] of Object.entries(extranetworkTable.textual_inversion)) {
							if(key.indexOf(ptr_inner) == 0){
								ti_name = ptr_inner;
								should_add = false;
								break;
							}
						}
					}
					if(should_add)ti_name += ptr_inner;
					element_list.push(ptr);
					if(extranetworkTable.textual_inversion[ti_name]){
						elements.push({
							name: ti_name,
							elements: element_list
						})
						element_list = [];
						ti_name = "";
						continue;
					}
				}
			}
			for(const element of elements){
				if(extranetworkTable.textual_inversion[element.name]){
					let $element = $(element.elements);
					if($element.attr("data-hasevent")==="yes") continue;
					$element.addClass( "ace_variable ace_language" );
					$element.attr("data-hasevent", "yes");
					if(has_lorahelper()) {
						$element.on( "dblclick", (function(self, select_tab) {return function(event){
							lorahelper.show_trigger_words(event, "ti", self.path, self.name, self.image, select_tab);
						}})(extranetworkTable.textual_inversion[element.name], active_tab) );
					}
					$element.css("pointer-events", "all");
				}
			}
		}
		const extranetwork_list = this.editor.container.querySelectorAll(search_query);
		for (const extranetwork_ptr of extranetwork_list){
			let hyper_name = extranetwork_ptr.textContent || extranetwork_ptr.innerText || extranetwork_ptr.innerHTML;
			if((""+(hyper_name||"")).trim()==="") continue;
			let network_name = "";
			let elements = [];
			for(let ptr = extranetwork_ptr; ptr !== null && typeof(ptr) !== typeof(undefined); ptr = next_element(ptr)) {
				let ptr_inner = ptr.textContent || ptr.innerText || ptr.innerHTML;
				if (ptr_inner) {
					if (check_start(ptr_inner, ">")||check_start(ptr_inner, "&gt;")||check_start(ptr_inner, "&#62;")) break; //end of syntax
					if (check_start(ptr_inner, "<")||check_start(ptr_inner, "&lt;")||check_start(ptr_inner, "&#60;")) break; //syntax error
					if ((ptr?.classList||{contains:()=>false}).contains("ace_name")){
						elements.push(ptr);
						network_name += ptr_inner;
					}
				}
			}
			hyper_name = hyper_name.trim();
			network_name = network_name.trim();
			const checker = data_map[inv_hypermap[hyper_name]];
			if(checker){
				const m_type = inv_hypermap[hyper_name];
				if(extranetworkTable[m_type]){
					const extra_item = extranetworkTable[m_type][network_name];
					let $element = $(elements);
					if($element.attr("data-hasevent")==="yes") continue;
					$element.attr("data-hasevent", "yes");
					if(has_lorahelper()) {
						$element.on( "dblclick", (function(type, self, select_tab) {return function(event){
							lorahelper.show_trigger_words(event, type, self.path, self.name, self.image, select_tab);
						}})(checker, extra_item, active_tab) );
					}
					$element.css("pointer-events", "all");
				}
			}
		}
	}

	TextboxController.prototype.activeTranslating = function(){
        try {
            if(!lorahelper)return;
        } catch (error) {
            return;
        }
		window.setTimeout((function(self){return ()=>self.doTranslating();})(this), 0);
	}
	TextboxController.prototype.doTranslating = function(){
		if(this.isDoTranslating){
			this.padDoTranslating = true;
			return;
		}
		this.isDoTranslating = true;
		this.startTranslating();
		while(this.padDoTranslating){
			this.padDoTranslating = false;
			this.startTranslating();
		}
		this.isDoTranslating = false;
	}
	TextboxController.prototype.startTranslating = function(){
		let node_ptr = (((this.editor.container.querySelector(".ace_text-layer")?.childNodes||[])[0]?.childNodes||[])[0]?.childNodes||[])[0];
		let first_node = null;
		let text = "";
		let trans_list = [];
		for(let ptr = node_ptr; ptr !== null && typeof(ptr) !== typeof(undefined); ptr = next_element(ptr)) {
			let ptr_inner = ptr.textContent || ptr.innerText || ptr.innerHTML;
			if((ptr?.classList||{contains:()=>false}).contains("ace_supercmd"))continue;
			if((ptr?.classList||{contains:()=>false}).contains("ace_supercmd"))continue;
			if (ptr_inner) {
				if((ptr?.classList||{contains:()=>false}).contains("ace_split")||
					(ptr?.classList||{contains:()=>false}).contains("ace_supercmd")||
					(ptr?.classList||{contains:()=>false}).contains("ace_comment")||
					(ptr?.classList||{contains:()=>false}).contains("ace_promptvariable")||
					(ptr?.classList||{contains:()=>false}).contains("ace_extranetwork")||
					(ptr?.classList||{contains:()=>false}).contains("ace_promptwildcard")||
					(ptr?.classList||{contains:()=>false}).contains("ace_promptkeyword")){
					if(text.trim()!=="" && first_node){
						trans_list.push({
							text:prompthighl.unescape_string(text.trim()).replace(/[\s\n\r_]+/g," "),
							element:first_node
						});
					}
					text = "";
					first_node = null;
					continue;
				}
				if(ptr_inner.trim()==="" && text==="")continue;
				if(!first_node)first_node = ptr;
				text += ptr_inner;
			}
		}
		if(text.trim()!=="" && first_node){
			trans_list.push({
				text:prompthighl.unescape_string(text.trim()).replace(/[\s\n\r_]+/g," "),
				element:first_node
			});
		}
		const background_color = document.defaultView.getComputedStyle(this.editor.container, null).getPropertyValue('background-color');
		for(let trans of trans_list){
			if((trans.element.getAttribute("data-translate-orig")||"").trim()===trans.text.trim())continue;
			trans.element.setAttribute("data-translate-orig", trans.text);
			let lang_code = this.selectLanguage.value;
			if(lang_code !== "en"){
				prompthighl.add_translate(trans.text, lang_code, (function(trans_obj){
					return translated=>{
						if(trans_obj.element.getAttribute("data-translate-orig").trim()===translated.trim())return;
						let css = trans_obj.element.style.cssText;
						if (css.indexOf("data-translate") >= 0)css = 
							css.replace(/(data\-translate\s*\:\s*[^;]+);/g, `data-translate: '${translated.replace(/(["'])/g, "\\$1")}'`);
						else css += 
							`--data-translate: '${translated.replace(/(["'])/g, "\\$1")}';`;
						if (css.indexOf("data-background-color") >= 0)css = 
							css.replace(/(data\-background\-color\s*\:\s*[^;]+);/g, `data-background-color: '${background_color}'`);
						else css += 
							`--data-background-color: ${background_color};`;
						trans_obj.element.style.cssText = css;
						trans_obj.element.classList.add("ace_translated_token");
					};
				})(trans));
			}
		}
	}

	TextboxController.prototype.activeWeightColoring = function(){
		window.setTimeout((function(self){return ()=>self.doWeightColoring();})(this), 0);
	}
	TextboxController.prototype.doWeightColoring = function(){
		if(this.isDoWeightColoring){
			this.padDoWeightColoring = true;
			return;
		}
		this.isDoWeightColoring = true;
		this.weightColoring();
		while(this.padDoWeightColoring){
			this.padDoWeightColoring = false;
			this.weightColoring();
		}
		this.isDoWeightColoring = false;
	}

	TextboxController.prototype.weightColoring = function(){
		const syntax_list = {
			"(":{
				query: ".ace_promptweight.ace_keyword.ace_begin",
				base_weight: 1.1,
				begin_pattern: "(",
				end_pattern: ")"
			},
			"[":{
				query: ".ace_promptstep.ace_keyword.ace_begin",
				base_weight: 0.952,
				begin_pattern: "[",
				end_pattern: "]",
				bad_pattern: /\s*\:[^\]]+\]\s*$|\|/
			},
			"{":{
				query: ".ace_dynamicselection.ace_keyword.ace_begin",
				base_weight: 1.05,
				begin_pattern: "{",
				end_pattern: "}",
				bad_pattern: /(\$\$|\||\:\:)/
			}
		};
		const search_query = (()=>{
			let q = "";
			for (const [key, value] of Object.entries(syntax_list)) 
				if (value.query) q += (q===""?"":", ") + value.query;
			return q;
		})();
		let bucket_list = [];
		const jq_list = this.editor.container.querySelectorAll(search_query);
		for(let i=0; i<jq_list.length; ++i)bucket_list.push(jq_list[i]);
		bucket_list.push({});
		function check_start(input, pattern){
			return input.trim().startsWith(pattern);
		}
		function check_pattern(input, pattern){
			for (const [key, value] of Object.entries(syntax_list)) 
				if (value[pattern+"_pattern"]){
					if(check_start(input, value[pattern+"_pattern"])) return value.begin_pattern;
				}
		}
		let data_list = [];
		for(let bucket_item = bucket_list.shift(); bucket_list.length > 0; bucket_item = bucket_list.shift()){
			let inner = bucket_item.textContent || bucket_item.innerText || bucket_item.innerHTML;
			if((bucket_item?.classList||{contains:()=>false}).contains("ace_supercmd"))continue;
			if((bucket_item?.classList||{contains:()=>false}).contains("ace_weight_already"))continue;
			if((bucket_item?.classList||{}).add)bucket_item.classList.add("ace_weight_already");
			if(inner){
				let stack = [];
				for(let ptr = bucket_item; (ptr == bucket_item  || stack.length > 0) && ptr !== null && typeof(ptr) !== typeof(undefined); ptr = next_element(ptr)) {
					if((ptr?.classList||{contains:()=>false}).contains("ace_supercmd"))continue;
					let ptr_inner = ptr.textContent || ptr.innerText || ptr.innerHTML;
					if (ptr_inner) {
						let token = "text";
						let begin_flag = check_pattern(ptr_inner, "begin");
						let end_flag = check_pattern(ptr_inner, "end");
						if(begin_flag){ //push
							const begin_pattern = syntax_list[begin_flag].begin_pattern;
							const calc_layer = ptr_inner.split(begin_pattern).length-1;
							for(let i=0; i<calc_layer; ++i){
								stack.push({
									type: begin_pattern,
									element_list: [],
									child: [],
									innerText: ""
								});
							}
							stack[stack.length-1].parent_distance = calc_layer;
							token = "begin";
						}
						if(end_flag){
							token = "end";
						}
						stack[stack.length-1].innerText += ptr_inner;
						stack[stack.length-1].element_list.push(ptr);
						if (token === "begin"){
							const index = bucket_list.indexOf(ptr);
							if (index > -1) bucket_list.splice(index, 1);
							continue;
						}
						if (token === "end"){ //pop
							const end_pattern = syntax_list[end_flag].end_pattern;
							const begin_pattern = syntax_list[end_flag].begin_pattern;
							const calc_layer = ptr_inner.split(end_pattern).length-1;
							let queue = [];
							let child = [];
							let store_layer = -1;
							let target_pop_layer = -1;
							for(let i=0; i<calc_layer; ++i){
								let current = stack.pop();
								while (current.type !== begin_pattern){
									queue.unshift(current);
									if(stack.length <= 0) break;
									current = stack.pop();
								}
								if((current.parent_distance||0)>0 && store_layer < 0) store_layer = current.parent_distance;
								if(target_pop_layer < 0)target_pop_layer = store_layer;
								if(current.type === begin_pattern) {
									if(current.element_list.length > 0){
										child.push(data_list.length);
										data_list.push({
											type: begin_pattern,
											innerText: current.innerText.trim(),
											elements: current.element_list,
											child: current.child
										});
									}
								}
								if (i == store_layer-1){
									if(stack.length > 0)while(child.length > 0)stack[stack.length-1].child.push(child.shift());
									child = [];
									store_layer = -1;
								}
								if (stack.length <= 0) break;
							}
							while(queue.length > 0)stack.push(queue.shift());
							if(stack.length <= 0) break;
							if(target_pop_layer < calc_layer){
								stack[stack.length-1].parent_distance = calc_layer - target_pop_layer;
							}
							while(child.length > 0)stack[stack.length-1].child.push(child.shift());
							continue;
						}
					}
				}
				while(stack.length > 0){
					const current = stack.pop();
					if(current.element_list.length > 0){
						data_list.push({
							type: current.type,
							innerText: current.innerText.trim(),
							elements: current.element_list,
							child: current.child
						});
					}
				}

			}
		}
		for(let i=0; i<data_list.length; ++i)data_list[i].parent = -1;
		for(let i=0; i<data_list.length; ++i){
			for(const id of data_list[i].child){
				data_list[id].parent = i;
			}
		}
		function calc_prompt_weight(prompt){
			let node = prompt;
			let path = [];
			while(node){
				path.unshift(node);
				node = data_list[node.parent];
			}
			let weight = 1.0;
			for(let i=0; i<path.length; ++i){
				const result_innerText = path[i].innerText;
				if(syntax_list[path[i].type].bad_pattern){
					const checker_bad = syntax_list[path[i].type].bad_pattern.exec(result_innerText);
					if(checker_bad !== null && typeof(checker_bad) !== typeof(undefined)) continue;
				}
				const w_match = /\:\s*([\+\-]?[\d\.]+)\s*\)+\s*$/.exec(result_innerText);
				const base_layer = ((new RegExp("^\\"+path[i].type+"+").exec(result_innerText.replace(/\s*/g,""))||[])[0]||"").split(path[i].type).length - 1;
				const self_weight = Math.pow(syntax_list[path[i].type].base_weight, base_layer<1?1:base_layer);
				weight *= (w_match === null || typeof(w_match) === typeof(undefined)) ? self_weight : (x=>Number.isFinite(x)?x:self_weight)(parseFloat(/[\+\-]?\d*(\.\d+)?/.exec(w_match[1])[0]));
			}
			return weight;
		}
		for(let prompt of data_list){
			const weight = calc_prompt_weight(prompt);
			let $prompt = $(prompt.elements);
			const lvl = Math.floor(Math.max(Math.min(Math.abs(weight-1)*10,5),1)+0.5);
			if(weight > 1) $prompt.addClass( "sd-prompt-weight-up-lvl"+lvl );
			if(weight < 1) $prompt.addClass( "sd-prompt-weight-down-lvl"+lvl );
		}
	}

	TextboxController.prototype.updateOpt = function(){
		this.updateEnable(!!opts.prompt_highlight_enabled);
		this.updateshowInvisibles(!!opts.prompt_highlight_display_invisible_char);
		this.updateWeightColoringEnable(!!opts.prompt_highlight_weight_coloring);
		this.updateFontSize(opts.prompt_highlight_font_size||12);
		const selected_theme = prompthighl.getThemeFromOpts();
		if(selected_theme){
			this.editor.setTheme(selected_theme.theme);
			this.selectThemeLabel.innerHTML = this.themeDist[selected_theme.name];
			this.selectTheme.selectedIndex = this.themeIndexs[selected_theme.name];
		} else {
			this.editor.setTheme("ace/theme/chrome");
			this.selectThemeLabel.innerHTML = this.themeDist.chrome;
		}
		self.editor.renderer.updateText();
	}

	TextboxController.prototype.updateEnable = function(opt) {
		let self = this;
		self.on_off_btn.on_off = opt;
		if(self.on_off_btn.on_off){
			self.on_off_btn.classList.add("oo-ui-image-progressive");
			self.editor.container.style.display = "block";
			self.group_codeeditor_style.style.display = "block";
			self.smyles_editor_wrap.style.display = "block";
			self.textArea.style.opacity = "0";
			self.smyles_dragbar.style.display = "block";
			self.textArea.style.position = "absolute";
			self.textArea.style.height = "0";
			self.textArea.disabled = true;
		}else{
			self.on_off_btn.classList.remove("oo-ui-image-progressive");
			self.textArea.style.height = self.editor.container.clientHeight+"px";
			self.textArea.disabled = false;
			self.editor.container.style.display = "none";
			self.group_codeeditor_style.style.display = "none";
			self.smyles_editor_wrap.style.display = "none";
			self.textArea.style.opacity = "1";
			self.smyles_dragbar.style.display = "none";
			self.textArea.style.position = "unset";
		}
	}

	TextboxController.prototype.updateshowInvisibles = function(opt) {
		let self = this;
		self.show_invisible_btn.on_off = opt;
		if(self.show_invisible_btn.on_off){
			self.show_invisible_btn.classList.add("oo-ui-image-progressive");
		}else{
			self.show_invisible_btn.classList.remove("oo-ui-image-progressive");
		}
		self.editor.setOption("showInvisibles", !!self.show_invisible_btn.on_off);
	}

	TextboxController.prototype.updateWeightColoringEnable = function(opt) {
		let self = this;
		self.weight_coloring_btn.on_off = opt;
		if(self.weight_coloring_btn.on_off){
			self.weight_coloring_btn.classList.add("oo-ui-image-progressive");
			self.weight_coloring_icon.classList.add("oo-ui-weight-coloring");
		}else{
			self.weight_coloring_btn.classList.remove("oo-ui-image-progressive");
			self.weight_coloring_icon.classList.remove("oo-ui-weight-coloring");
		}
		self.editor.renderer.updateText();
	}

	TextboxController.prototype.updateFontSize = function(opt) {
		let self = this;
		if ((""+self.font_size.value).trim() === (""+opt).trim()) return;
		self.font_size.value = opt;
		const font_size = parseFloat(opt)
		if(Number.isFinite(font_size)){
			self.editor.setOptions({
				fontSize: font_size + "pt"
			  });
		}
	}
	
	TextboxController.prototype.createEditor = function() {
		this.editor_div = document.createElement("div");
		this.smyles_dragbar = document.createElement("div");
		this.smyles_editor_wrap = document.createElement("div");
		this.smyles_editor_wrap.style.display = "block"
		this.wikiEditor_ui_toolbar = document.createElement("div");
		this.wikiEditor_ui_toolbar.setAttribute("id",this.name + "-wikiEditor-ui-toolbar");
		this.wikiEditor_ui_toolbar.style.backgroundColor = "var(--panel-background-fill)";
		this.wikiEditor_ui_toolbar.style.boxShadow = "0 2px 1px 0 rgba(0,0,0,0.1)";
		this.wikiEditor_ui_toolbar.style.position = "relative";
		this.wikiEditor_ui_toolbar.style.display = "block";

		this.wikiEditor_section_main = document.createElement("div");
		this.wikiEditor_section_main.setAttribute("id",this.name + "-wikiEditor-section-main");
		this.wikiEditor_section_main.style.position = "relative";
		this.wikiEditor_section_main.style.float = "relative";
		this.wikiEditor_section_main.style.minHeight = "32px";
		this.wikiEditor_section_main.style.height = "100%";
		this.wikiEditor_ui_toolbar.appendChild(this.wikiEditor_section_main);

		this.group_codeeditor_main = document.createElement("div");
		this.group_codeeditor_main.setAttribute("id",this.name + "-group-codeeditor-main");
		this.group_codeeditor_main.style.height = "32px";
		this.group_codeeditor_main.style.margin = "0";
		this.group_codeeditor_main.style.paddingRight = "0";
		this.group_codeeditor_main.style.float = "left";
		this.wikiEditor_section_main.appendChild(this.group_codeeditor_main);

		this.group_codeeditor_style = document.createElement("div");
		this.group_codeeditor_style.setAttribute("id",this.name + "-group-codeeditor-style");
		this.group_codeeditor_style.style.height = "32px";
		this.group_codeeditor_style.style.margin = "0";
		this.group_codeeditor_style.style.paddingRight = "0";
		this.group_codeeditor_style.style.float = "left";
		this.wikiEditor_section_main.appendChild(this.group_codeeditor_style);

		this.on_off_btn = document.createElement("span");
		this.on_off_btn.classList.add("oo-ui-iconElement-icon", "oo-ui-icon-markup", "oo-ui-image-progressive");
		let btn_frame = document.createElement("span");
		btn_frame.classList.add("oo-ui-frame");
		btn_frame.appendChild(this.on_off_btn);
		this.group_codeeditor_main.appendChild(btn_frame);
		this.on_off_btn.on_off = true;
		this.on_off_btn.addEventListener("click", (function(self){return function(event){
			self.updateEnable(!self.on_off_btn.on_off);
		}})(this));


		this.show_invisible_btn = document.createElement("span");
		this.show_invisible_btn.classList.add("oo-ui-iconElement-icon", "oo-ui-icon-pilcrow");
		btn_frame = document.createElement("span");
		btn_frame.classList.add("oo-ui-frame");
		btn_frame.appendChild(this.show_invisible_btn);
		this.group_codeeditor_style.appendChild(btn_frame);
		this.show_invisible_btn.on_off = true;
		this.show_invisible_btn.addEventListener("click", (function(self){return function(event){
			self.updateshowInvisibles(!self.show_invisible_btn.on_off);
		}})(this));
		
		this.search_replace_btn = document.createElement("span");
		this.search_replace_btn.classList.add("oo-ui-iconElement-icon", "oo-ui-icon-promptSearch");
		btn_frame = document.createElement("span");
		btn_frame.classList.add("oo-ui-frame");
		btn_frame.appendChild(this.search_replace_btn);
		this.group_codeeditor_style.appendChild(btn_frame);
		this.search_replace_btn.addEventListener("click", (function(self){return function(event){
			self.search_replace_btn.on_off = !self.search_replace_btn.on_off;
			var searchBox = self.editor.searchBox;
			if ( searchBox && $( searchBox.element ).css( 'display' ) !== 'none' ) {
				searchBox.hide();
			} else {
				self.editor.execCommand(
					self.editor.getReadOnly() ? 'find' : 'replace'
				);
			}
		}})(this));

		this.weight_coloring_btn = document.createElement("span");
		this.weight_coloring_btn.classList.add("oo-ui-iconElement-icon");
		this.weight_coloring_icon = document.createElement("span");
		this.weight_coloring_icon.classList.add("oo-ui-weight-coloring");
		this.weight_coloring_icon.innerHTML = "(:)";
		this.weight_coloring_btn.appendChild(this.weight_coloring_icon);
		btn_frame = document.createElement("span");
		btn_frame.classList.add("oo-ui-frame");
		btn_frame.appendChild(this.weight_coloring_btn);
		this.group_codeeditor_style.appendChild(btn_frame);
		this.weight_coloring_btn.on_off = true;
		this.weight_coloring_btn.addEventListener("click", (function(self){return function(event){
			self.updateWeightColoringEnable(!self.weight_coloring_btn.on_off);
		}})(this));

		//font size tool
		this.font_size = document.createElement("input");
		btn_frame = document.createElement("span");
		btn_frame.classList.add("oo-ui-frame");
		btn_frame.style.width = "50px";
		this.font_size.style.width = "45px";
		this.font_size.style.position = "absolute";
		this.font_size.style.top = "5px";
		this.font_size.value = 12;
		this.font_size.disabled = true;
		btn_frame.appendChild(this.font_size);
		this.group_codeeditor_style.appendChild(btn_frame);
		this.font_size.addEventListener("change", (function(self){return function(event){
			self.updateFontSize(self.font_size.value);
		}})(this));
		btn_frame.addEventListener("click", (function(self){return function(event){
			self.font_size.disabled = false;
		}})(this));
		this.font_size.addEventListener("focusout", (function(self){return function(event){
			self.font_size.disabled = true;
		}})(this));

		
        try {
            if(lorahelper){
				this.translate_btn = document.createElement("span");
				this.translate_btn.classList.add("oo-ui-iconElement-icon");
				this.translate_icon = document.createElement("span");
				this.translate_icon.classList.add("oo-ui-translate");
				this.translate_icon.innerHTML = "文/A";
				this.translate_btn.appendChild(this.translate_icon);
				btn_frame = document.createElement("span");
				btn_frame.classList.add("oo-ui-frame");
				btn_frame.appendChild(this.translate_btn);
				this.group_codeeditor_style.appendChild(btn_frame);
				this.translate_btn.on_off = false;
				this.translate_btn.addEventListener("click", (function(self){return function(event){
					self.translate_btn.on_off = !self.translate_btn.on_off;
					if(self.translate_btn.on_off){
						self.translate_btn.classList.add("oo-ui-image-progressive");
						self.translate_icon.classList.add("oo-ui-weight-coloring");
						prompthighl.startTranslateTask();
					}else{
						self.translate_btn.classList.remove("oo-ui-image-progressive");
						self.translate_icon.classList.remove("oo-ui-weight-coloring");
						prompthighl.stopTranslateTask();
					}
					self.editor.renderer.updateText();
				}})(this));

				//Create and append select list
				this.selectLanguage = document.createElement("select");
				this.selectLanguage.classList.add("wikiEditor-lang-selector")
				this.selectLanguageLabel = document.createElement("span");
				let selectLanguageDisplayWrap = document.createElement("span");
				selectLanguageDisplayWrap.style.width = "50px";
				selectLanguageDisplayWrap.style.position = "absolute";
				selectLanguageDisplayWrap.style.overflow = "hidden";
				btn_frame = document.createElement("span");
				btn_frame.classList.add("oo-ui-frame");
				btn_frame.style.width = "50px";
				this.selectLanguage.style.width = "45px";
				this.selectLanguage.style.position = "absolute";
				this.selectLanguage.style.top = "0";
				this.selectLanguage.style.background = "none";
				this.selectLanguage.style.border = "none";
				selectLanguageDisplayWrap.appendChild(this.selectLanguageLabel);
				btn_frame.appendChild(selectLanguageDisplayWrap);
				btn_frame.appendChild(this.selectLanguage);
				this.group_codeeditor_style.appendChild(btn_frame);

				//Create and append the options
				for (const [key, value] of Object.entries(prompthighl.languages)) {
					var option = document.createElement("option");
					option.value = key;
					option.text = value;
					this.selectLanguage.appendChild(option);
				}

				this.LanguageIndexs = {};
				const option_list = this.selectLanguage.querySelectorAll("option");
				for(let i=0; i<option_list.length; ++i){
					const option = option_list[i];
					this.LanguageIndexs[option.value] = i;
				}
				const selected_Language = prompthighl.getLanguageFromOpts();
				if(selected_Language){
					this.selectLanguageLabel.innerHTML = selected_Language;
					this.selectLanguage.selectedIndex = this.LanguageIndexs[selected_Language];
				} else {
					this.selectLanguageLabel.innerHTML = "";
				}
				this.selectLanguage.addEventListener("change", (function(self){return function(event){
					const selected_Language = self.selectLanguage.value;
					if (!selected_Language)
						return;
					self.selectLanguageLabel.innerHTML = selected_Language;
				}})(this));
			}
        } catch (error) {}

		//Create and append select list
		this.selectTheme = document.createElement("select");
		this.selectTheme.classList.add("wikiEditor-theme-selector")
		this.selectThemeLabel = document.createElement("span");
		let selectThemeDisplayWrap = document.createElement("span");
		selectThemeDisplayWrap.style.width = "50px";
		selectThemeDisplayWrap.style.position = "absolute";
		selectThemeDisplayWrap.style.overflow = "hidden";
		btn_frame = document.createElement("span");
		btn_frame.classList.add("oo-ui-frame");
		btn_frame.style.width = "50px";
		this.selectTheme.style.width = "45px";
		this.selectTheme.style.position = "absolute";
		this.selectTheme.style.top = "0";
		this.selectTheme.style.background = "none";
		this.selectTheme.style.border = "none";
		selectThemeDisplayWrap.appendChild(this.selectThemeLabel);
		btn_frame.appendChild(selectThemeDisplayWrap);
		btn_frame.appendChild(this.selectTheme);
		this.group_codeeditor_style.appendChild(btn_frame);
		let Bright_group = document.createElement("optgroup");
		Bright_group.setAttribute("label", "Bright")
		this.selectTheme.appendChild(Bright_group);
		let Dark_group = document.createElement("optgroup");
		Dark_group.setAttribute("label", "Dark")
		this.selectTheme.appendChild(Dark_group);
		this.themeDist = {};
		this.do_theme = window.setInterval((function(self, BrightGroup, DarkGroup){return function(){
			var themelist = ace.require("ace/ext/themelist");
			if(themelist){
				//Create and append the options
				themelist.themes.forEach(function(x) {
					var option = document.createElement("option");
					option.value = x.name;
					option.text = x.caption;
					self.themeDist[option.value] = option.text;
					(x.isDark ? DarkGroup : BrightGroup).appendChild(option);
				});
				self.themeIndexs = {};
				const option_list = self.selectTheme.querySelectorAll("option");
				for(let i=0; i<option_list.length; ++i){
					const option = option_list[i];
					self.themeIndexs[option.value] = i;
				}
				const selected_theme = prompthighl.getThemeFromOpts();
				if(selected_theme){
					self.editor.setTheme(selected_theme.theme);
					self.selectThemeLabel.innerHTML = self.themeDist[selected_theme.name];
					self.selectTheme.selectedIndex = self.themeIndexs[selected_theme.name];
				} else {
					self.editor.setTheme("ace/theme/chrome");
					self.selectThemeLabel.innerHTML = self.themeDist.chrome;
				}
				window.clearInterval(self.do_theme);
				self.updateOpt();
			}
		}})(this, Bright_group, Dark_group), 100);
		this.selectTheme.addEventListener("change", (function(self){return function(event){
			const selectedTheme = self.selectTheme.value;
			if (!selectedTheme)
				return;
			self.selectThemeLabel.innerHTML = self.themeDist[selectedTheme];
			self.editor.setTheme("ace/theme/" + selectedTheme);
			self.editor.renderer.updateText();
		}})(this));

		this.smyles_dragbar.classList.add("ace_resize-bar");
		this.smyles_dragbar.style.opacity = "1";
		
		this.textArea.parentNode.prepend(this.smyles_dragbar);
		// replace textarea with the editor
		this.smyles_editor_wrap.appendChild(this.editor_div);
		this.textArea.parentNode.prepend(this.smyles_editor_wrap);
		this.textArea.parentNode.prepend(this.wikiEditor_ui_toolbar);
		$smyles_dragbar = $(this.smyles_dragbar);
		
		this.editor = ace.edit(this.editor_div);
		this.editor.session.setMode("ace/mode/sdprompt");
		this.editor.session.setValue(this.textArea.value);
		this.editor.setOptions({
			cursorStyle: "slim",
			behavioursEnabled: true,
			fontSize: "12pt"
		});
		this.value = this.textArea.value;

		// set size
		this.Width = this.textArea.clientWidth;
		this.Height = this.textArea.clientHeight;
		this.editor.container.style.height = this.textArea.clientHeight + "px";
		this.editor.getSession().setUseWrapMode(true);
		
		this.textArea.style.position = "absolute";
		this.textArea.style.opacity = "0";
		this.textArea.style.height = "0";
		this.textArea.disabled = true;
		// trigger redraw of the editor
		this.editor.resize();
		
		$smyles_dragbar.mousedown( (function(self){return function ( e ) {
			e.preventDefault();
			self.dragging = true;
			self.drag_enable = true;
			var smyles_editor = $(self.editor.container);
			self.top_offset = smyles_editor.offset().top - wpoffset;
			
			// Set editor opacity to 0 to make transparent so our wrapper div shows
			smyles_editor.css( 'opacity', 0 );
			// handle mouse movement
			if(!drag_list.includes(self))drag_list.push(self);
			
		}})(this) );
		
		// create an observer instance
		this.observer = new MutationObserver(
			(function(self){ 
				return function(mutations) {
					let should_resize = false;
					if (self.Height != self.textArea.clientHeight){
						should_resize = true;
						self.Height = self.textArea.clientHeight;
						//self.editor.container.style.height = self.Height + "px";
					}
					if(self.value !== self.textArea.value){
						self.value = self.textArea.value;
						self.editor.session.setValue(self.textArea.value);
					}
					//if(should_resize) self.editor.resize();
				}
			})(this)
		);
		const { renderer } = this.editor;
		renderer.on('afterRender', (function(self){ 
			return function(event) {
				if(self.weight_coloring_btn.on_off){
					self.activeWeightColoring();
				}
				self.activeloraBinding();
				
				if(self.translate_btn.on_off){
					self.activeTranslating();
				}

				// each time renderer updates, get all elements with ace_color class
				let color_elements = [];
				for(const color_prompt of self.editor.container.querySelectorAll(".ace_sdpromptcolor, .ace_csscolor")){
					let color_inner = color_prompt.textContent || color_prompt.innerText || color_prompt.innerHTML;
					if((""+(color_inner||"")).trim() === "") continue;
					let color = "";
					let is_rgb = false;
					for(const class_name of color_prompt.classList){
						const check_color = (/ace_color_(.+)$/.exec(class_name)||[])[1];
						if (check_color){
							color = check_color;
							break;
						}
						const check_rgb = (/ace_rgb_(.+)$/.exec(class_name)||[])[1];
						if (check_rgb){
							is_rgb = true;
							color = "rgb("+check_rgb.split("_").join(",")+")";
							break;
						}
					}
					color = color.trim();
					if(color==="")continue;
					if (color_prompt.getAttribute('data-color') === color) {
						// dont rerender the same color 
						continue;
					}
					color_prompt.setAttribute("data-color", color);
					const is_css = !!color_prompt.classList.contains('ace_csscolor');
					if(is_rgb){
						color_elements.push({
							element: color_prompt,
							color: color
						});
					}else{
						let color_item = { title: color, value: color.toLowerCase(), name: color.toLowerCase() };
						if(!is_css){
							color_item = prompthighl.getColorItem(color+"_1");
						}
						color_prompt.innerHTML = color_prompt.innerHTML.replace(new RegExp(`(${color.toLowerCase()})`,"i"),"<span class=\"ace_color ace_toaddcolor\">$1</span>");
						const new_ele = color_prompt.querySelector(".ace_toaddcolor");
						if(new_ele){
							color_elements.push({
								element: new_ele,
								color: color_item.value
							});
						}
					}
				}
				//iterate through them and set their background color and font color accordingly
				for (var i = 0, len = color_elements.length; i < len; i++) {
			
					const colorString = color_elements[i].color;
			
					if (color_elements[i].element.getAttribute('data-color-render') === colorString) {
						// dont rerender the same color 
						continue;
					}
			
					color_elements[i].element.setAttribute("data-color-render", colorString);
					color_elements[i].element.style.cssText = `--data-color: ${colorString};`;
					color_elements[i].element.classList.add("data-color");
					color_elements[i].element.classList.add("ace_support");
					color_elements[i].element.classList.add("ace_constant");
					color_elements[i].element.classList.add("ace_color");
				}

				const background_color = document.defaultView.getComputedStyle(self.editor.container, null).getPropertyValue('background-color');
				for(const escape of self.editor.container.querySelectorAll(".ace_charescape")){
					let escape_inner = escape.textContent || escape.innerText || escape.innerHTML;
					if((""+(escape_inner||"")).trim() === "") continue;
					escape_inner = ""+escape_inner.trim();
					if(escape_inner.length <= 2) continue;
					let parsed = "";
					try{parsed = JSON.parse(`"${escape_inner}"`);}catch(ex){parsed = "";};
					if((""+(parsed||"")).trim() === "") continue;
					parsed = (""+parsed.trim()).replace(/["']/g, function(i) {
					   return '\\'+i;
					});
					escape.classList.add("ace_charescape_data");
					escape.style.cssText = `--data-charescape: '${parsed}';--data-background-color: ${background_color}`;
				}

			}
		})(this));

		this.editor.getSession().on('change', (function(self){ 
			return function(event) {
				const value = self.editor.getSession().getValue();
				if(self.value !== value){
					self.value = value;
					update_inputbox(self.textArea, value);
				}
				if(self.weight_coloring_btn.on_off){
					self.activeWeightColoring();
				}
			}
		})(this));

		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true };

		// pass in the target node, as well as the observer options
		this.observer.observe(this.textArea, config);



	}
	
	function getAllExtranetwork(){
		const extranetwork = document.querySelectorAll('.extra-network-cards,.extra-network-thumbs');
		let extranetwork_list = [];
		for(const extra_network_node of extranetwork){
			const network_type = (/^[^_]+_(.+)_cards?$/.exec(extra_network_node.getAttribute("id"))||[])[1];
			if (network_type === null || typeof(network_type) === typeof(undefined))continue;
			cards = extra_network_node.querySelectorAll(".card");
			for (const card of cards) {
				const model_path_node = card.querySelector(".actions .additional .search_term");
				if (!model_path_node) continue;
				const model_name_node = card.querySelector(".actions .name");
				const model_path = model_path_node.innerHTML;
				if ((""+(model_path||"")).trim()==="") continue;
				let exist = false;
				for (const check_list of extranetwork_list){
					if(check_list.path === model_path && check_list.type === network_type){
						exist = true;
						break;
					}
				}
				if (exist) continue;
				const model_name = ((x,w)=>(x===null||typeof(x)===typeof(undefined)||(""+(x||"")).trim()==="")?((y=>y.length<=1?y:y.slice(0, -1))((z=>z[z.length-1])(w.split(/[\\\/]/)||[]).split(".")).join(".")):x)((model_name_node||{}).innerHTML, model_path);
				if ((""+(model_name||"")).trim()==="") continue;
				let bgimg = card.style.backgroundImage || "url(\"./file=html/card-no-preview.png\")";
				bgimg = new Function('const my_pass_url = x=>x;return ' + bgimg.replace(/^\s*url\s*\(\s*\"/i, "my_pass_url(\""))();
				extranetwork_list.push({
					type: network_type,
					name: model_name,
					path: model_path,
					image: bgimg,
					has_image: !!card.style.backgroundImage
				});
			}
		}
		return extranetwork_list;
	}

	function update_extranetworkTable(){
		for(const enw of extranetworkList){
			if(!extranetworkTable[enw.type])extranetworkTable[enw.type]={};
			extranetworkTable[enw.type][enw.name]=enw;
		}
		if(extranetworkTable.textual_inversion){
			let ti_pattern = "";
			for (const [key, value] of Object.entries(extranetworkTable.textual_inversion)) {
				ti_pattern += (ti_pattern === "" ? "" : "|") + value.name;
			}
			extranetworkTable.ti_pattern = ti_pattern;
		}
	}
	onUiLoaded(() => {
		loadColorList();

		const check_css = document.querySelectorAll("link");
		let find_css = false;
		let req_str = ext_path.split("=");
		req_str = ((req_str.length<=1)?req_str:req_str.slice(1)).join("=").replace(/[\\\/]+$/g,"").split(/[\\\/]/);
		req_str = (req_str.length<=1)?req_str[0]:req_str.pop();
		const re_main_css = new RegExp("sd-webui-prompt-highlight".replace(/\-/g,"\\-")+"[\\\\\\/]style\\.css");
		for(const css_node of check_css){
			if(re_main_css.test(css_node.getAttribute("href"))){
				find_css = true;
				break;
			}
		}
		if(!find_css){
			var head  = document.getElementsByTagName('head')[0];
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = [ext_path, "style.css"].join("/");
			link.media = 'all';
			head.appendChild(link);
		}
		extranetworkList = getAllExtranetwork();
		update_extranetworkTable();
		for(let update_btn of document.querySelectorAll("#txt2img_extra_refresh, #img2img_extra_refresh")){
			update_btn.addEventListener("click",function(event){
				extranetworkList = getAllExtranetwork();
				update_extranetworkTable();
			});
		}
		loadScript([ext_path, "ace", "ace.js"].join("/"), ()=>{
			if(!has_jquery()){
				loadScript([ext_path, "ace", "jquery-3.6.4.min.js"].join("/"), ()=>{
					for(let update_settings of document.querySelectorAll("#settings_submit")){
						update_settings.addEventListener("click",function ( e ) {
							window.setTimeout(()=>{
								if(opts.prompt_highlight_enabled) {
									if((prompthighl.textboxList||[]).length <= 0){
										apply_textbox();
									}
								}
								prompthighl.updateAllTextBox();
							}, 500);
						});
					}
					document.addEventListener("mousemove", function ( e ) {
						for (let drag_ele of drag_list.slice()){
							if(drag_ele.drag_enable){
								var actualY = e.pageY - wpoffset;
								// editor height
								var eheight = actualY - drag_ele.top_offset;
								// Set wrapper height
								$(drag_ele.smyles_editor_wrap).css( 'height', eheight);
								
								// Set dragbar opacity while dragging (set to 0 to not show)
								$(drag_ele.smyles_dragbar).css( 'opacity', 0.15 );
							}
						}
					} , false);
					document.addEventListener("mouseup", function ( e ) {
						for (let drag_ele of drag_list.slice()){
							if ( drag_ele.dragging )
							{
								var smyles_editor = $(drag_ele.editor.container);

								var actualY = e.pageY - wpoffset;
								var top_offset = smyles_editor.offset().top - wpoffset;
								var eheight = actualY - top_offset;

								var list_index = drag_list.indexOf(drag_ele);
								if(list_index > -1){
									drag_list.splice(list_index, 1);
								}
								//$( document ).unbind( 'mousemove' );
								
								// Set dragbar opacity back to 1
								$(drag_ele.smyles_dragbar).css( 'opacity', 1 );
								
								// Set height on actual editor element, and opacity back to 1
								smyles_editor.css( 'height', eheight ).css( 'opacity', 1 );
								
								// Trigger ace editor resize()
								drag_ele.editor.resize();
								drag_ele.dragging = false;
							}
						}
					} , false);
					ace.require("ace/ext/language_tools");
					prompthighl.textboxList = [];
					prompthighl.txt2img_prompt = gradioApp().querySelector("#txt2img_prompt textarea");
					prompthighl.txt2img_neg_prompt = gradioApp().querySelector("#txt2img_neg_prompt textarea");
					prompthighl.img2img_prompt = gradioApp().querySelector("#img2img_prompt textarea");
					prompthighl.img2img_neg_prompt = gradioApp().querySelector("#img2img_neg_prompt textarea");
					function apply_textbox(){
						if(!prompthighl.txt2img_controller){
							if(prompthighl.txt2img_prompt.clientHeight > 0){
								prompthighl.txt2img_prompt.setAttribute("id","ace-txt2img_prompt");
								prompthighl.txt2img_controller = new TextboxController(prompthighl.txt2img_prompt, "txt2img", "txt2img");
								prompthighl.txt2img_controller.createEditor();
								prompthighl.textboxList.push(prompthighl.txt2img_controller);
							}
						}
						if(!prompthighl.txt2img_neg_controller){
							if(prompthighl.txt2img_neg_prompt.clientHeight > 0){
								prompthighl.txt2img_neg_prompt.setAttribute("id","ace-txt2img_neg_prompt");
								prompthighl.txt2img_neg_controller = new TextboxController(prompthighl.txt2img_neg_prompt, "txt2img_neg", "txt2img");
								prompthighl.txt2img_neg_controller.createEditor();
								prompthighl.textboxList.push(prompthighl.txt2img_neg_controller);
							}
						}
						if(!prompthighl.img2img_controller){
							if(prompthighl.img2img_prompt.clientHeight > 0){
								prompthighl.img2img_prompt.setAttribute("id","ace-img2img_prompt");
								prompthighl.img2img_controller = new TextboxController(prompthighl.img2img_prompt, "img2img", "img2img");
								prompthighl.img2img_controller.createEditor();
								prompthighl.textboxList.push(prompthighl.img2img_controller);
							}
						}
						if(!prompthighl.img2img_neg_controller){
							if(prompthighl.img2img_neg_prompt.clientHeight > 0){
								prompthighl.img2img_neg_prompt.setAttribute("id","ace-img2img_neg_prompt");
								prompthighl.img2img_neg_controller = new TextboxController(prompthighl.img2img_neg_prompt, "img2img_neg", "img2img");
								prompthighl.img2img_neg_controller.createEditor();
								prompthighl.textboxList.push(prompthighl.img2img_neg_controller);
							}
						}
					}
	
					//update when tab is changed
					let all_tabs = gradioApp().querySelectorAll(".tab-nav");
					if(all_tabs.length <= 0){
						//support for old version
						all_tabs = gradioApp().querySelectorAll(".tabs");
						for (let tab_parent of all_tabs) {
							all_tab_items = tab_parent.childNodes[0].querySelectorAll("button");
							for (let the_tab of all_tab_items) {
								the_tab.addEventListener('click', function(ev) {
									if(opts.prompt_highlight_enabled) apply_textbox();
									return true;
								}, false);
							}
						}
					}else{
						for (let the_tab of all_tabs) {
							the_tab.addEventListener('click', function(ev) {
								if(opts.prompt_highlight_enabled) apply_textbox();
								return true;
							}, false);
						}
					}
					if(opts.prompt_highlight_enabled) apply_textbox();


				});
			}
		});
	});

})();

