"use strict";
require("../ext/themelist");
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var PythonHighlightRules = require("./python_highlight_rules").PythonHighlightRules;
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
var supportConstantColor = "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen";
var sdpromptHighlightRules = function() {
    this.$rules = {
        "start" : [
            {token : "invalid", regex : ">"},
            {token : "invalid", regex : "\\)"},
            {token : "invalid", regex : "\\]"},
            {token : "invalid", regex : "\\}"},
            {token : "text", regex: "\\s+"},
            {token : "constant.language.escape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "comment",  regex : /#.+$/},
            {include: "specialsyntax", caseInsensitive: true},
        ],
        "specialsyntax" : [
            {token : "extranetwork.keyword.begin", regex : prompt.re.extranetwork.begin, push  : "extranetwork"},
            {token : "promptstep.keyword.begin", regex : prompt.re.promptstep.begin, push  : "state.step"},
            {token : "promptweight.keyword.begin", regex : prompt.re.promptweight.begin, push  : "state.weight"},
            {token : "promptvariable.keyword.begin", regex : prompt.re.promptvariable.begin, push  : "state.variable"},
            {token : "dynamicselection.keyword.begin", regex : prompt.re.dynamicselection.begin, push  : "state.dynamicselection"},
            {token : "keyword", regex : prompt.re.wildcard.begin, push  :"state.wildcard"},
            {token : "keyword", regex : "(AND|BREAK)"},
            {token : "qualitytag.variable.language", regex : "\\b(\\w+[\\s_]+quality|masterpiece)"},
            {token : "support.constant.color", regex : "((?<=[\\s_])|\\b)("+supportConstantColor+")((?=[\\s_])|\\b)"},
        ],
        "state.weight" : [
            {token : "constant.language.escape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "promptweight.keyword.end",   regex : prompt.re.promptweight.end,     next  : "pop"},
            {token : "promptweight.keyword.operator", regex : ":", next  : "state.weight.op"},
            {token : "comment",  regex : /#.+$/},
            {include: "specialsyntax"},
            {defaultToken : "promptweight"}
        ],
        "state.weight.op" : [
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "promptweight.keyword.end",   regex : prompt.re.promptweight.end,     next  : "pop"},
            {token : "promptweight.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "comment",  regex : /#.+$/},
            {include: "specialsyntax"},
            {defaultToken : "promptweight"}
        ],
        "state.wildcard" : [
            {token : "constant.language.escape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "promptwildcardtemplate.keyword.begin",   regex : prompt.re.promptweight.begin,     push  : "state.wildcard.template"},
            {token : "promptwildcard.keyword.end",   regex : prompt.re.wildcard.end,     next  : "pop"},
            {token : "promptwildcard.keyword.operator", regex : ":", next  : "state.weight.op"},
            {token : "promptwildcard.keyword.operator", regex : "[~@]"},
            {token : "comment",  regex : /#.+$/},
            {defaultToken : "promptwildcard.keyword"}
        ],
        "state.wildcard.template" : [
            {token : "constant.language.escape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "promptwildcardtemplate.keyword.end",   regex : prompt.re.promptweight.end,     next  : "pop"},
            {token : "promptwildcardtemplate.keyword.operator", regex : "[:=]"},
            {token : "promptwildcardtemplate.keyword.operator", regex : "[~@]"},
            {token : "comment",  regex : /#.+$/},
            {defaultToken : "promptwildcardtemplate"}
        ],
        "state.variable" : [
            {token : "constant.language.escape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "promptvariable.keyword.end",   regex : prompt.re.promptvariable.end,     next  : "pop"},
            {token : "promptvariable.keyword.operator", regex : "[=\\!]"},
            {token : "promptvariable.keyword.operator", regex : "[~@]"},
            {token : "promptvariable.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "comment",  regex : /#.+$/},
            {include: "specialsyntax"},
            {defaultToken : "promptvariable"}
        ],
        "state.dynamicselection" : [
            {token : "constant.language.escape", regex : "\\\\u", push  : "state.escape.unicode"},
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "keyword",   regex : prompt.re.dynamicselection.end,     next  : "pop"},
            {token : "keyword.operator", regex : "[:|\\|]"},
            {token : "keyword", regex : "\\$\\$"},
            {token : "keyword.operator", regex : "[~@]"},
            {token : "constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "comment",  regex : /#.+$/},
            {include: "specialsyntax"},
            {defaultToken : "dynamicselection"}
        ],
        "state.step" : [
            {token : "promptstep.keyword.operator", regex : "\\\\u0023", next  : "supercmd"},
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "promptstep.keyword.end",   regex : prompt.re.promptstep.end,     next  : "pop"},
            {token : "promptstep.keyword.operator", regex : ":", next  : "state.step.op"},
            {token : "promptstep.keyword.operator", regex : "\\|"},
            {token : "comment",  regex : /#.+$/},
            {include: "specialsyntax"},
            {defaultToken : "promptstep"}
        ],
        "state.step.op" : [
            {token : "constant.language.escape", regex : "\\\\", push  : "state.escape"},
            {token : "promptstep.keyword.end",   regex : prompt.re.promptstep.end,     next  : "pop"},
            {token : "promptstep.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {token : "promptstep.keyword.operator", regex : "\\|", next  : "state.step.op"},
            {token : "comment",  regex : /#.+$/},
            {include: "specialsyntax"},
            {defaultToken : "promptstep"}
        ],
        "state.escape.unicode" : [
            {token : "constant.language.escape",   regex : "\\d{4}",     next  : "pop"},
            {defaultToken : "constant.language.escape"}
        ],
        "supercmd" : [
            {token : "keyword",   regex : "cmd\\\\\\(",     next  : "python-start"},
            {token : "keyword",   regex : "\\w+\\b",     next  : "state.step"},
            {token : "supercmd.stop",   regex : "[:\\]]",     next  : "state.step"},
            {defaultToken : "supercmd"}
        ],
        "state.escape" : [
            {token : "constant.language.escape",   regex : ".",     next  : "pop"},
            {defaultToken : "text"}
        ],
        "extranetwork" : [
            {token : "extranetwork.keyword.end",   regex : prompt.re.extranetwork.end,     next  : "pop"},
            {token : "invalid", regex: "<"},
            {token : "extranetwork.storage.type",   regex : "[^:]+",     next  : "extranetwork.id"},
            {defaultToken : "extranetwork"}
        ],
        "extranetwork.id" : [
            {token : "invalid", regex: "<"},
            {token : "extranetwork.name.variable.language",   regex : "[^:>]+",     next  : "extranetwork.param"},
            {token : "extranetwork.keyword.end",   regex : prompt.re.extranetwork.end,     next  : "pop"},
            {token : "extranetwork.split",   regex : ":"},
            {defaultToken : "extranetwork"}
        ],
        "extranetwork.param" : [
            {token : "invalid", regex: "<"},
            {token : "extranetwork.keyword.end",   regex : prompt.re.extranetwork.end,     next  : "pop"},
            {token : "extranetwork.split",   regex : ":"},
            {token : "extranetwork.constant.numeric", regex: "[+-]?[\\d\\.]+\\b"},
            {defaultToken : "extranetwork"}
        ],
    };
	this.embedRules(PythonHighlightRules, "python-", [
        {token : "keyword",   regex : "\\\\\\)",     next  : "supercmd"},
    ]);

    this.normalizeRules();
};

sdpromptHighlightRules.metaData = oop.inherits(sdpromptHighlightRules, TextHighlightRules);

exports.sdpromptHighlightRules = sdpromptHighlightRules;