(function(){

function module_init() {
	prompthighl.translates = {};
    prompthighl.googletranslates = {};
    prompthighl.translatequeue = [];
    prompthighl.translatequeue_slow = [];
    prompthighl.working_translatequeue = [];

    prompthighl.stopTranslateTask = function(){
        if(prompthighl.translateTask){
            window.clearInterval(prompthighl.translateTask);
        }
        prompthighl.translateTask = null;
    }

    prompthighl.startTranslateTask = function(){
        try {if(!lorahelper)return;} catch (error) {return;}
        const shift_queue = word_obj => (()=>{
            const id = prompthighl.optionalIndex(prompthighl.working_translatequeue.indexOf(word_obj));
            if(id>=0)prompthighl.working_translatequeue.splice(id, 1);
        });
        if(!prompthighl.translateTask)
        prompthighl.translateTask = window.setInterval(()=>{
            if (prompthighl.working_translatequeue.length > 0)return;
            if (prompthighl.translatequeue.length > 0){
                const lang_word = prompthighl.translatequeue.shift();
                prompthighl.working_translatequeue.push(lang_word);
                if(lang_word){
                    google_translate(lang_word.word, { from: "en", to: lang_word.lang_code })
                    .then((function(word_obj){return res => {
                        const word = word_obj.word;
                        const lang_code = word_obj.lang_code;
                        const result = res.text;
                        if(prompthighl.is_empty(prompthighl.googletranslates[word])){
                            prompthighl.googletranslates[word] = {};
                        }
                        prompthighl.googletranslates[word][lang_code] = result;
                        window.setTimeout(shift_queue(word_obj), 250);
                        prompthighl.call(word_obj.call_back, result);
                    }})(lang_word)).catch((function(word_obj){return err => window.setTimeout(shift_queue(word_obj), 250);})(lang_word)).finally((function(word_obj){return err => window.setTimeout(shift_queue(word_obj), 250);})
                    (lang_word));
                }
                return;
            }
            if (prompthighl.working_translatequeue.length > 0)return;
            if (prompthighl.translatequeue_slow.length > 0){
                const lang_word = prompthighl.translatequeue_slow.shift();
                prompthighl.working_translatequeue.push(lang_word);
                if(lang_word){
                    google_translate(lang_word.word, { from: "en", to: lang_word.lang_code })
                    .then((function(word_obj){return res => {
                        const word = word_obj.word;
                        const lang_code = word_obj.lang_code;
                        const result = res.text;
                        if(prompthighl.is_empty(prompthighl.googletranslates[word])){
                            prompthighl.googletranslates[word] = {};
                        }
                        prompthighl.googletranslates[word][lang_code] = result;
                        window.setTimeout(shift_queue(word_obj), 250);
                        prompthighl.call(word_obj.call_back, result);
                    }})(lang_word)).catch((function(word_obj){return err => window.setTimeout(shift_queue(word_obj), 250);})(lang_word)).finally((function(word_obj){return err => window.setTimeout(shift_queue(word_obj), 250);})
                    (lang_word));
                }
                return;
            }
        },500);
    }
    prompthighl.load_translate = function(word, lang_code, call_back) {
        if(lang_code === "en") {
            prompthighl.call(call_back, word);
            return;
        }
        if(!prompthighl.is_empty(prompthighl.translates[word])){
            if(!prompthighl.is_empty(prompthighl.translates[word][lang_code])){
                prompthighl.call(call_back, prompthighl.translates[word][lang_code]);
            }
        }
        prompthighl.call(call_back, word);
    }
    prompthighl.get_translate = function(word, lang_code, call_back) {
        if(lang_code === "en") {
            prompthighl.call(call_back, word);
            return;
        }
        if(!prompthighl.is_empty(prompthighl.translates[word])){
            if(!prompthighl.is_empty(prompthighl.translates[word][lang_code])){
                prompthighl.call(call_back, prompthighl.translates[word][lang_code]);
            }
        }
        if(prompthighl.is_empty(prompthighl.googletranslates[word+" language"])){
            prompthighl.googletranslates[word+" language"] = {};
            prompthighl.translatequeue_slow.push({
                word: word+" language",
                lang_code: lang_code,
                call_back: call_back
            });
            return;
        }
        if(prompthighl.is_empty(prompthighl.googletranslates[word+" language"][lang_code])){
            prompthighl.translatequeue_slow.push({
                word: word+" language",
                lang_code: lang_code,
                call_back: call_back
            });
            return;
        }
        prompthighl.call(call_back, prompthighl.googletranslates[word+" language"][lang_code]);
    }

    prompthighl.add_translate = function(word, lang_code, call_back) {
        if(lang_code === "en") {
            prompthighl.call(call_back, word);
            return;
        }
        if(prompthighl.is_empty(prompthighl.googletranslates[word])){
            prompthighl.googletranslates[word] = {};
            prompthighl.translatequeue.push({
                word: word,
                lang_code: lang_code,
                call_back: call_back
            });
            return;
        }
        if(prompthighl.is_empty(prompthighl.googletranslates[word][lang_code])){
            prompthighl.translatequeue.push({
                word: word,
                lang_code: lang_code,
                call_back: call_back
            });
            return;
        }
        prompthighl.call(call_back, prompthighl.googletranslates[word][lang_code]);
    }

    prompthighl.languages = {
        "auto": "Auto",
        "af": {
          "name": "Afrikaans",
          "display": "Afrikaans"
        },
        "sq": {
          "name": "Albanian",
          "display": "shqip"
        },
        "am": {
          "name": "Amharic",
          "display": "አማርኛ"
        },
        "ar": {
          "name": "Arabic",
          "display": "العربية"
        },
        "hy": {
          "name": "Armenian",
          "display": "հայերեն"
        },
        "az": {
          "name": "Azerbaijani",
          "display": "azərbaycanca"
        },
        "eu": {
          "name": "Basque",
          "display": "euskara"
        },
        "be": {
          "name": "Belarusian",
          "display": "беларуская"
        },
        "bn": {
          "name": "Bengali",
          "display": "বাংলা"
        },
        "bs": {
          "name": "Bosnian",
          "display": "bosanski"
        },
        "bg": {
          "name": "Bulgarian",
          "display": "български"
        },
        "ca": {
          "name": "Catalan",
          "display": "català"
        },
        "ceb": {
          "name": "Cebuano",
          "display": "Cebuano"
        },
        "ny": {
          "name": "Chichewa",
          "display": "Chi-Chewa"
        },
        "zh": {
          "name": "Chinese",
          "display": "中文"
        },
        "zh_cn": {
          "name": "Chinese Simplified",
          "display": "简体中文 (中国大陆)"
        },
        "zh_tw": {
          "name": "Chinese Traditional",
          "display": "繁體中文 (臺灣)"
        },
        "zh_hk": {
          "name": "Chinese Traditional",
          "display": "繁體中文 (香港)"
        },
        "co": {
          "name": "Corsican",
          "display": "corsu"
        },
        "hr": {
          "name": "Croatian",
          "display": "hrvatski"
        },
        "cs": {
          "name": "Czech",
          "display": "čeština"
        },
        "da": {
          "name": "Danish",
          "display": "dansk"
        },
        "nl": {
          "name": "Dutch",
          "display": "Nederlands"
        },
        "en": {
          "name": "English",
          "display": "English"
        },
        "eo": {
          "name": "Esperanto",
          "display": "Esperanto"
        },
        "et": {
          "name": "Estonian",
          "display": "eesti"
        },
        "tl": {
          "name": "Filipino",
          "display": "Tagalog"
        },
        "fi": {
          "name": "Finnish",
          "display": "suomi"
        },
        "fr": {
          "name": "French",
          "display": "français"
        },
        "fy": {
          "name": "Frisian",
          "display": "Frysk"
        },
        "gl": {
          "name": "Galician",
          "display": "galego"
        },
        "ka": {
          "name": "Georgian",
          "display": "ქართული"
        },
        "de": {
          "name": "German",
          "display": "Deutsch"
        },
        "el": {
          "name": "Greek",
          "display": "Ελληνικά"
        },
        "gu": {
          "name": "Gujarati",
          "display": "ગુજરાતી"
        },
        "ht": {
          "name": "Haitian Creole",
          "display": "Kreyòl ayisyen"
        },
        "ha": {
          "name": "Hausa",
          "display": "Hausa"
        },
        "haw": {
          "name": "Hawaiian",
          "display": "Hawaiʻi"
        },
        "he": {
          "name": "Hebrew",
          "display": "עברית"
        },
        "iw": "Hebrew",
        "hi": {
          "name": "Hindi",
          "display": "हिन्दी"
        },
        "hmn": "Hmong",
        "hu": {
          "name": "Hungarian",
          "display": "magyar"
        },
        "is": {
          "name": "Icelandic",
          "display": "íslenska"
        },
        "ig": {
          "name": "Igbo",
          "display": "Igbo"
        },
        "id": {
          "name": "Indonesian",
          "display": "Bahasa Indonesia"
        },
        "ga": {
          "name": "Irish",
          "display": "Gaeilge"
        },
        "it": {
          "name": "Italian",
          "display": "italiano"
        },
        "ja": {
          "name": "Japanese",
          "display": "日本語"
        },
        "jw": "Javanese",
        "kn": {
          "name": "Kannada",
          "display": "ಕನ್ನಡ"
        },
        "kk": {
          "name": "Kazakh",
          "display": "қазақша"
        },
        "km": {
          "name": "Khmer",
          "display": "ភាសាខ្មែរ"
        },
        "rw": {
          "name": "Kinyarwanda",
          "display": "Ikinyarwanda"
        },
        "ko": {
          "name": "Korean",
          "display": "한국어"
        },
        "ku": {
          "name": "Kurdish (Kurmanji)",
          "display": "kurdî"
        },
        "ky": {
          "name": "Kyrgyz",
          "display": "кыргызча"
        },
        "lo": {
          "name": "Lao",
          "display": "ລາວ"
        },
        "la": {
          "name": "Latin",
          "display": "Latina"
        },
        "lv": {
          "name": "Latvian",
          "display": "latviešu"
        },
        "lt": {
          "name": "Lithuanian",
          "display": "lietuvių"
        },
        "lb": {
          "name": "Luxembourgish",
          "display": "Lëtzebuergesch"
        },
        "mk": {
          "name": "Macedonian",
          "display": "македонски"
        },
        "mg": {
          "name": "Malagasy",
          "display": "Malagasy"
        },
        "ms": {
          "name": "Malay",
          "display": "Bahasa Melayu"
        },
        "ml": {
          "name": "Malayalam",
          "display": "മലയാളം"
        },
        "mt": {
          "name": "Maltese",
          "display": "Malti"
        },
        "mi": {
          "name": "Maori",
          "display": "Māori"
        },
        "mr": {
          "name": "Marathi",
          "display": "मराठी"
        },
        "mn": {
          "name": "Mongolian",
          "display": "монгол"
        },
        "my": {
          "name": "Myanmar (Burmese)",
          "display": "မြန်မာဘာသာ"
        },
        "ne": {
          "name": "Nepali",
          "display": "नेपाली"
        },
        "no": "Norwegian",
        "or": {
          "name": "Odia (Oriya)",
          "display": "ଓଡ଼ିଆ"
        },
        "ps": {
          "name": "Pashto",
          "display": "پښتو"
        },
        "fa": {
          "name": "Persian",
          "display": "فارسی"
        },
        "pl": {
          "name": "Polish",
          "display": "polski"
        },
        "pt": {
          "name": "Portuguese",
          "display": "português"
        },
        "pa": {
          "name": "Punjabi",
          "display": "ਪੰਜਾਬੀ"
        },
        "ro": {
          "name": "Romanian",
          "display": "română"
        },
        "ru": {
          "name": "Russian",
          "display": "русский"
        },
        "sm": {
          "name": "Samoan",
          "display": "Gagana Samoa"
        },
        "gd": {
          "name": "Scots Gaelic",
          "display": "Gàidhlig"
        },
        "sr": {
          "name": "Serbian",
          "display": "српски / srpski"
        },
        "st": {
          "name": "Sesotho",
          "display": "Sesotho"
        },
        "sn": {
          "name": "Shona",
          "display": "chiShona"
        },
        "sd": {
          "name": "Sindhi",
          "display": "سنڌي"
        },
        "si": {
          "name": "Sinhala",
          "display": "සිංහල"
        },
        "sk": {
          "name": "Slovak",
          "display": "slovenčina"
        },
        "sl": {
          "name": "Slovenian",
          "display": "slovenščina"
        },
        "so": {
          "name": "Somali",
          "display": "Soomaaliga"
        },
        "es": {
          "name": "Spanish",
          "display": "español"
        },
        "su": {
          "name": "Sundanese",
          "display": "Sunda"
        },
        "sw": {
          "name": "Swahili",
          "display": "Kiswahili"
        },
        "sv": {
          "name": "Swedish",
          "display": "svenska"
        },
        "tg": {
          "name": "Tajik",
          "display": "тоҷикӣ"
        },
        "ta": {
          "name": "Tamil",
          "display": "தமிழ்"
        },
        "tt": {
          "name": "Tatar",
          "display": "татарча / tatarça"
        },
        "te": {
          "name": "Telugu",
          "display": "తెలుగు"
        },
        "th": {
          "name": "Thai",
          "display": "ไทย"
        },
        "tr": {
          "name": "Turkish",
          "display": "Türkçe"
        },
        "tk": {
          "name": "Turkmen",
          "display": "Türkmençe"
        },
        "uk": {
          "name": "Ukrainian",
          "display": "українська"
        },
        "ur": {
          "name": "Urdu",
          "display": "اردو"
        },
        "ug": {
          "name": "Uyghur",
          "display": "ئۇيغۇرچە / Uyghurche"
        },
        "uz": {
          "name": "Uzbek",
          "display": "oʻzbekcha / ўзбекча"
        },
        "vi": {
          "name": "Vietnamese",
          "display": "Tiếng Việt"
        },
        "cy": {
          "name": "Welsh",
          "display": "Cymraeg"
        },
        "xh": {
          "name": "Xhosa",
          "display": "isiXhosa"
        },
        "yi": {
          "name": "Yiddish",
          "display": "ייִדיש"
        },
        "yo": {
          "name": "Yoruba",
          "display": "Yorùbá"
        },
        "zu": {
          "name": "Zulu",
          "display": "isiZulu"
        }
      };


    async function google_translate(text, options = {}) {
        const defaultTranslateOptions = {
            client: 'gtx',
            from: 'auto',
            to: 'en',
            hl: 'en',
            tld: 'com',
        };
        function sM(a) {
            let e = [];
            let f = 0;
            for (let g = 0; g < a.length; g++) {
                let l = a.charCodeAt(g)
                128 > l
                ? (e[f++] = l)
                : (2048 > l
                    ? (e[f++] = (l >> 6) | 192)
                    : (55296 == (l & 64512) &&
                        g + 1 < a.length &&
                        56320 == (a.charCodeAt(g + 1) & 64512)
                        ? ((l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                            (e[f++] = (l >> 18) | 240),
                            (e[f++] = ((l >> 12) & 63) | 128))
                        : (e[f++] = (l >> 12) | 224),
                        (e[f++] = ((l >> 6) & 63) | 128)),
                    (e[f++] = (l & 63) | 128));
            }
            let a_ = 0
            for (f = 0; f < e.length; f++) {
                a_ += e[f];
                a_ = xr(a_, "+-a^+6");
            }
            a_ = xr(a_, "+-3^+b+-f");
            a_ ^= 0;
            0 > a_ && (a_ = (a_ & 2147483647) + 2147483648);
            a_ %= 1e6;
            return a_.toString() + "." + a_.toString();
        }
        function xr(a, b) {
            for (let c = 0; c < b.length - 2; c += 3) {
                let d = b.charAt(c + 2);
                d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
                d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
                a = "+" == b.charAt(c) ? a + d : a ^ d;
            }
            return a;
        }
        function normaliseResponse(body, raw = false) {
            const result = {
                text: "",
                pronunciation: "",
                from: {
                    language: {
                        didYouMean: false,
                        iso: ""
                    },
                    text: {
                        autoCorrected: false,
                        value: "",
                        didYouMean: false
                    }
                }
            };
            body[0].forEach(obj => {
                if (obj[0]) {
                    result.text += obj[0];
                } else if (obj[2]) {
                    result.pronunciation += obj[2];
                }
            })
            if (body[2] === body[8][0][0]) {
                result.from.language.iso = body[2];
            } else {
                result.from.language.didYouMean = true;
                result.from.language.iso = body[8][0][0];
            }
            if (body[7] && body[7][0]) {
                let str = body[7][0];
    
                str = str.replace(/<b><i>/g, "[");
                str = str.replace(/<\/i><\/b>/g, "]");
    
                result.from.text.value = str;
    
                if (body[7][5] === true) {
                    result.from.text.autoCorrected = true;
                } else {
                    result.from.text.didYouMean = true;
                }
            }
    
            if (raw) {
                result.raw = body;
            }
    
            return result;
        }
    
        function generateRequestUrl(text, options) {
          const translateOptions = { ...defaultTranslateOptions, ...options }
    
          const queryParams = {
            client: translateOptions.client,
            sl: translateOptions.from,
            tl: translateOptions.to,
            hl: translateOptions.hl,
            ie: "UTF-8",
            oe: "UTF-8",
            otf: "1",
            ssel: "0",
            tsel: "0",
            kc: "7",
            q: text,
            tk: sM(text)
          }
          const searchParams = new URLSearchParams(queryParams);
          ["at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"].forEach(l =>
            searchParams.append("dt", l)
          )
    
          return `https://translate.google.${translateOptions.tld}/translate_a/single?${searchParams}`;
        }
        const translateUrl = generateRequestUrl(text, options);
        const response = await lorahelper.build_cors_request(translateUrl);
    
        const body = await JSON.parse(response);
        return normaliseResponse(body, options.raw);
    }
    function getLanguageFromOpts(){
        return ""+((z=>({"zh-hans":"zh-hans","zh-hant":"zh-hant"})[z.toLowerCase()]||(y=>(x=>(x[1]&&x[3])?x[1]+"_"+x[3]:x[0])(/(zh)([\-\.\_].*(tw|cn))?/i.exec(y)||[y]))(z).toLowerCase())(get_language_code()||"en")||"en");
    }
    
    function load_lang_json(lang_json){
        const lang_code = getLanguageFromOpts();
        if(lang_code === "en") return;
        for (const [key, value] of Object.entries(lang_json)) {
            if(typeof(key) === typeof("string") && typeof(value) === typeof("string")){
                if(prompthighl.is_empty(prompthighl.translates[key])){
                    prompthighl.translates[key] = {};
                }
                if(prompthighl.is_empty(prompthighl.translates[key][lang_code])){
                    prompthighl.translates[key][lang_code] = value;
                }
            }
        }
    }

    function get_language_code(){
        const selected_language_code = get_if_not_empty(opts.localization);
        if(selected_language_code){
            return selected_language_code
        } else {
            if(opts.bilingual_localization_enabled){
                const bilingual_language_code = get_if_not_empty(opts.bilingual_localization_file);
                if (bilingual_language_code){
                    return (x=>((x||[]).length>1)?x.slice(0,-1):x)(bilingual_language_code.split(".")).join(".");
                }
            } else {
                const browser_language_code = get_if_not_empty(navigator.language || navigator.userLanguage);
                if (browser_language_code){
                    return browser_language_code;
                }
                const system_language_code = get_if_not_empty(get_system_language());
                if (system_language_code){
                    return system_language_code;
                }
                return "en"; //default english
            }
        }
        return undefined;
    }

    function has_bilingual(){
        return !!opts.bilingual_localization_enabled && !!get_if_not_empty(opts.bilingual_localization_file) && !(Object.keys(window.localization||{}).length);
    }

    function get_if_not_empty(toget){
        if(prompthighl.is_empty(toget)) return undefined;
        if((''+toget).toLowerCase() === "none") return undefined;
        return toget;
    }
    function get_system_language(){
        let DateTimeFormat_obj = Intl?.DateTimeFormat;
        if(typeof(DateTimeFormat_obj) !== typeof(prompthighl.noop_func)) return undefined;
        return DateTimeFormat_obj()?.resolvedOptions()?.locale
    }

    let try_localization_looping = false;
    let try_localization = window.setInterval(function(){
        if (try_localization_looping) return;
        try {
            if(!prompthighl.is_nullptr(window.localization) && !prompthighl.is_nullptr(opts.localization)){
                try_localization_looping = true;
                if (Object.keys(window.localization).length) {
                    load_lang_json(window.localization)
                } else {
                    if(has_bilingual()){
                        const dirs = opts["bilingual_localization_dirs"];
                        const file = opts["bilingual_localization_file"];
                        if (file !== "None" && dirs !== "None"){
                            const dirs_list = JSON.parse(dirs);
                            prompthighl.readFile(`file=${dirs_list[file]}`).then((res) => {
                                load_lang_json(JSON.parse(res));
                            })
                        }
                    }
                }
                try_localization_looping = false;
                window.clearInterval(try_localization);
            }
        } catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    },10);

    prompthighl.getLanguageFromOpts = getLanguageFromOpts;

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