"use strict";
require("../ext/themelist");
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var PythonHighlightRules = require("./inside_python_highlight_rules").inside_pythonHighlightRules;
var prompttokenselector = "prompttoken";
var prompt = {
    re:{
        extranetwork : {
            begin: "<",
            end: ">",
        },
        promptstep : {
            begin: "\\[",
            end: "\\]",
        },
        promptweight : {
            begin: "\\(",
            end: "\\)",
        },
        promptvariable : {
            begin: "\\$\\{",
            end: "\\}",
        },
        dynamicselection : {
            begin: "\\{",
            end: "\\}",
        },
        wildcard: {
            begin: "__",
            end: "__",
        }
    }
}
var supportConstantColor = /(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)_/;

function getColorToken(base_token){
    return (function(default_token){
        return {
            token : (function(defaultToken){return function(name) {
                const colorItem = prompthighl.getColorItem(name.trim());
                if(colorItem) return "prompttoken.sdpromptcolor.color_"+colorItem.title;
                const cssColor = (supportConstantColor.exec(name.trim())||[])[1];
                if(cssColor) return "prompttoken.csscolor.color_"+cssColor.trim();
                return defaultToken;
            }})(default_token),
            regex : "\\b\\w+(?=rgb\\b)|\\b\\w+\\b"
        };
    })(base_token);
}
const rgbColorToken = {
    token : function(red,green,blue){
        const input_color = {r:parseFloat(red),g:parseFloat(green),b:parseFloat(blue)};
        if(input_color.r < 256 && input_color.g < 256 && input_color.b < 256){
            return `prompttoken.csscolor.rgb_${input_color.r}_${input_color.g}_${input_color.b}`
        }
        return "prompttoken.invalid";
    }, 
    regex : "rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)"
};

var sdpromptHighlightRules = function() {
    this.$rules = {
        "start" : [
            {token : "prompttoken.invalid", regex : ">"},
            {token : "prompttoken.invalid", regex : "\\)"},
            {token : "prompttoken.invalid", regex : "\\]"},
            {token : "prompttoken.invalid", regex : "\\}"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
            getColorToken("prompttoken.text"),
        ],
        "specialsyntax" : [
            {token : "prompttoken.whitespace", regex: "\\s+"},
            rgbColorToken,
            {token : "prompttoken.extranetwork.keyword.begin", regex : prompt.re.extranetwork.begin, push  : "extranetwork"},
            {token : "prompttoken.promptstep.keyword.begin", regex : prompt.re.promptstep.begin, push  : "state.step"},
            {token : "prompttoken.promptweight.keyword.begin", regex : prompt.re.promptweight.begin, push  : "state.weight"},
            {token : "prompttoken.promptvariable.keyword.begin", regex : prompt.re.promptvariable.begin, push  : "state.variable"},
            {token : "prompttoken.dynamicselection.keyword.begin", regex : prompt.re.dynamicselection.begin, push  : "state.dynamicselection"},
            {token : "prompttoken.keyword", regex : prompt.re.wildcard.begin, push  :"state.wildcard"},
            {token : "prompttoken.keyword", regex : "(AND|BREAK)"},
            {token : "prompttoken.qualitytag.variable.language", regex : "\\b(\\w+[\\s_]+quality|masterpiece)"},
        ],
        "state.weight" : [
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.promptweight.keyword.end",   regex : prompt.re.promptweight.end,     next  : "pop"},
            {token : "prompttoken.promptweight.keyword.operator", regex : ":", next  : "state.weight.op"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
            getColorToken("prompttoken.promptweight"),
            {defaultToken : "prompttoken.promptweight"}
        ],
        "state.weight.op" : [
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.promptweight.keyword.end",   regex : prompt.re.promptweight.end,     next  : "pop"},
            {token : "prompttoken.promptweight.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
            getColorToken("prompttoken.promptweight"),
            {defaultToken : "prompttoken.promptweight"}
        ],
        "state.wildcard" : [
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.promptwildcardtemplate.keyword.begin",   regex : prompt.re.promptweight.begin,     push  : "state.wildcard.template"},
            {token : "prompttoken.promptwildcard.keyword.end",   regex : prompt.re.wildcard.end,     next  : "pop"},
            {token : "prompttoken.promptwildcard.keyword.operator", regex : ":", next  : "state.weight.op"},
            {token : "prompttoken.promptwildcard.keyword.operator", regex : "[~@]"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {defaultToken : "prompttoken.promptwildcard.keyword"}
        ],
        "state.wildcard.template" : [
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.promptwildcardtemplate.keyword.end",   regex : prompt.re.promptweight.end,     next  : "pop"},
            {token : "prompttoken.promptwildcardtemplate.keyword.operator", regex : "[:=]"},
            {token : "prompttoken.promptwildcardtemplate.keyword.operator", regex : "[~@]"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            getColorToken("prompttoken.promptwildcardtemplate"),
            {defaultToken : "prompttoken.promptwildcardtemplate"}
        ],
        "state.variable" : [
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.promptvariable.keyword.end",   regex : prompt.re.promptvariable.end,     next  : "pop"},
            {token : "prompttoken.promptvariable.keyword.operator", regex : "[=\\!]"},
            {token : "prompttoken.promptvariable.keyword.operator", regex : "[~@]"},
            {token : "prompttoken.promptvariable.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
            getColorToken("prompttoken.promptvariable"),
            {defaultToken : "prompttoken.promptvariable"}
        ],
        "state.dynamicselection" : [
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.keyword",   regex : prompt.re.dynamicselection.end,     next  : "pop"},
            {token : "prompttoken.keyword.operator", regex : "[:|\\|]"},
            {token : "prompttoken.keyword", regex : "\\$\\$"},
            {token : "prompttoken.keyword.operator", regex : "[~@]"},
            {token : "prompttoken.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
            getColorToken("prompttoken.dynamicselection"),
            {defaultToken : "prompttoken.dynamicselection"}
        ],
        "state.step" : [
            {token : "prompttoken.promptstep.keyword.operator.charescape", regex : "\\\\u0023", next  : "supercmd"},
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.promptstep.keyword.end",   regex : prompt.re.promptstep.end,     next  : "pop"},
            {token : "prompttoken.promptstep.keyword.operator", regex : ":", next  : "state.step.op"},
            {token : "prompttoken.promptstep.keyword.operator", regex : "\\|"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
            getColorToken("prompttoken.promptstep"),
            {defaultToken : "prompttoken.promptstep"}
        ],
        "state.step.op" : [
            {token : "prompttoken.constant.language.escape.charescape", regex : "\\\\", push  : "state.escape"},
            {token : "prompttoken.promptstep.keyword.end",   regex : prompt.re.promptstep.end,     next  : "pop"},
            {token : "prompttoken.promptstep.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "prompttoken.promptstep.keyword.operator", regex : "\\|", next  : "state.step.op"},
            {token : "prompttoken.comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
            getColorToken("prompttoken.promptstep"),
            {defaultToken : "prompttoken.promptstep"}
        ],
        "state.escape.unicode" : [
            {token : "prompttoken.constant.language.escape.charescape",   regex : "\\d{4}",     next  : "pop"},
            {defaultToken : "prompttoken.constant.language.escape.charescape"}
        ],
        "supercmd" : [
            {token : "prompttoken.keyword",   regex : "cmd\\\\\\(",     next  : "python-start"},
            {token : "prompttoken.keyword",   regex : "\\w+\\b",     next  : "state.step"},
            {token : "prompttoken.supercmd.stop",   regex : "[:\\]]",     next  : "state.step"},
            {defaultToken : "prompttoken.supercmd"}
        ],
        "state.escape" : [
            {token : "prompttoken.constant.language.escape.charescape",   regex : ".",     next  : "pop"},
            {defaultToken : "prompttoken.constant.language.escape.charescape"}
        ],
        "extranetwork" : [
            {token : "prompttoken.extranetwork.keyword.end",   regex : prompt.re.extranetwork.end,     next  : "pop"},
            {token : "prompttoken.invalid", regex: "<"},
            {token : "prompttoken.extranetwork.storage.type",   regex : "[^:]+",     next  : "extranetwork.id"},
            {defaultToken : "prompttoken.extranetwork"}
        ],
        "extranetwork.id" : [
            {token : "prompttoken.invalid", regex: "<"},
            {token : "prompttoken.extranetwork.name.variable.language",   regex : "[^:>]+",     next  : "extranetwork.param"},
            {token : "prompttoken.extranetwork.keyword.end",   regex : prompt.re.extranetwork.end,     next  : "pop"},
            {token : "prompttoken.extranetwork.split",   regex : ":"},
            {defaultToken : "prompttoken.extranetwork"}
        ],
        "extranetwork.param" : [
            {token : "prompttoken.invalid", regex: "<"},
            {token : "prompttoken.extranetwork.keyword.end",   regex : prompt.re.extranetwork.end,     next  : "pop"},
            {token : "prompttoken.extranetwork.split",   regex : ":"},
            {token : "prompttoken.extranetwork.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {defaultToken : "prompttoken.extranetwork"}
        ],
    };
	this.embedRules(PythonHighlightRules, "python-", [
        {token : "prompttoken.keyword",   regex : "\\\\\\)(?=\\s*[\\:#\\[\\]])",     next  : "supercmd"},
    ]);

    this.normalizeRules();
};

sdpromptHighlightRules.metaData = oop.inherits(sdpromptHighlightRules, TextHighlightRules);

exports.sdpromptHighlightRules = sdpromptHighlightRules;