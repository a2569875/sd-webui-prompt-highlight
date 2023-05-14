(function(){

function module_init() {
	prompthighl.translates = {};
    prompthighl.googletranslates = {};
    prompthighl.translatequeue = [];
    prompthighl.translatequeue_slow = [];

    prompthighl.stopTranslateTask = function(){
        if(prompthighl.translateTask){
            window.clearInterval(prompthighl.translateTask);
        }
        prompthighl.translateTask = null;
    }

    prompthighl.startTranslateTask = function(){
        try {
            if(!lorahelper)return;
        } catch (error) {
            return;
        }
        if(!prompthighl.translateTask)
        prompthighl.translateTask = window.setInterval(()=>{
            if (prompthighl.translatequeue.length > 0){
                const lang_word = prompthighl.translatequeue.shift();
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
                        prompthighl.call(word_obj.call_back, result);
                    }})(lang_word));
                }
                return;
            }
            if (prompthighl.translatequeue_slow.length > 0){
                const lang_word = prompthighl.translatequeue_slow.shift();
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
                        prompthighl.call(word_obj.call_back, result);
                    }})(lang_word));
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
        auto: 'Automatic',
        af: 'Afrikaans',
        sq: 'Albanian',
        am: 'Amharic',
        ar: 'Arabic',
        hy: 'Armenian',
        az: 'Azerbaijani',
        eu: 'Basque',
        be: 'Belarusian',
        bn: 'Bengali',
        bs: 'Bosnian',
        bg: 'Bulgarian',
        ca: 'Catalan',
        ceb: 'Cebuano',
        ny: 'Chichewa',
        zh: 'Chinese Simplified',
        zh_cn: 'Chinese Simplified',
        zh_tw: 'Chinese Traditional',
        co: 'Corsican',
        hr: 'Croatian',
        cs: 'Czech',
        da: 'Danish',
        nl: 'Dutch',
        en: 'English',
        eo: 'Esperanto',
        et: 'Estonian',
        tl: 'Filipino',
        fi: 'Finnish',
        fr: 'French',
        fy: 'Frisian',
        gl: 'Galician',
        ka: 'Georgian',
        de: 'German',
        el: 'Greek',
        gu: 'Gujarati',
        ht: 'Haitian Creole',
        ha: 'Hausa',
        haw: 'Hawaiian',
        he: 'Hebrew',
        iw: 'Hebrew',
        hi: 'Hindi',
        hmn: 'Hmong',
        hu: 'Hungarian',
        is: 'Icelandic',
        ig: 'Igbo',
        id: 'Indonesian',
        ga: 'Irish',
        it: 'Italian',
        ja: 'Japanese',
        jw: 'Javanese',
        kn: 'Kannada',
        kk: 'Kazakh',
        km: 'Khmer',
        rw: 'Kinyarwanda',
        ko: 'Korean',
        ku: 'Kurdish (Kurmanji)',
        ky: 'Kyrgyz',
        lo: 'Lao',
        la: 'Latin',
        lv: 'Latvian',
        lt: 'Lithuanian',
        lb: 'Luxembourgish',
        mk: 'Macedonian',
        mg: 'Malagasy',
        ms: 'Malay',
        ml: 'Malayalam',
        mt: 'Maltese',
        mi: 'Maori',
        mr: 'Marathi',
        mn: 'Mongolian',
        my: 'Myanmar (Burmese)',
        ne: 'Nepali',
        no: 'Norwegian',
        or: 'Odia (Oriya)',
        ps: 'Pashto',
        fa: 'Persian',
        pl: 'Polish',
        pt: 'Portuguese',
        pa: 'Punjabi',
        ro: 'Romanian',
        ru: 'Russian',
        sm: 'Samoan',
        gd: 'Scots Gaelic',
        sr: 'Serbian',
        st: 'Sesotho',
        sn: 'Shona',
        sd: 'Sindhi',
        si: 'Sinhala',
        sk: 'Slovak',
        sl: 'Slovenian',
        so: 'Somali',
        es: 'Spanish',
        su: 'Sundanese',
        sw: 'Swahili',
        sv: 'Swedish',
        tg: 'Tajik',
        ta: 'Tamil',
        tt: 'Tatar',
        te: 'Telugu',
        th: 'Thai',
        tr: 'Turkish',
        tk: 'Turkmen',
        uk: 'Ukrainian',
        ur: 'Urdu',
        ug: 'Uyghur',
        uz: 'Uzbek',
        vi: 'Vietnamese',
        cy: 'Welsh',
        xh: 'Xhosa',
        yi: 'Yiddish',
        yo: 'Yoruba',
        zu: 'Zulu',
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