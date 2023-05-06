define("ace/ext/themelist",["require","exports","module"], function(require, exports, module){/**
 * Generates a list of themes available when ace was built.
 * @fileOverview Generates a list of themes available when ace was built.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */
"use strict";
var themeData = [
    ["Chrome"],
    ["Clouds"],
    ["Crimson Editor"],
    ["Dawn"],
    ["Dreamweaver"],
    ["Eclipse"],
    ["GitHub"],
    ["IPlastic"],
    ["Solarized Light"],
    ["TextMate"],
    ["Tomorrow"],
    ["XCode"],
    ["Kuroir"],
    ["KatzenMilch"],
    ["SQL Server", "sqlserver", "light"],
    ["Ambiance", "ambiance", "dark"],
    ["Chaos", "chaos", "dark"],
    ["Clouds Midnight", "clouds_midnight", "dark"],
    ["Dracula", "", "dark"],
    ["Cobalt", "cobalt", "dark"],
    ["Gruvbox", "gruvbox", "dark"],
    ["Green on Black", "gob", "dark"],
    ["idle Fingers", "idle_fingers", "dark"],
    ["krTheme", "kr_theme", "dark"],
    ["Merbivore", "merbivore", "dark"],
    ["Merbivore Soft", "merbivore_soft", "dark"],
    ["Mono Industrial", "mono_industrial", "dark"],
    ["Monokai", "monokai", "dark"],
    ["Nord Dark", "nord_dark", "dark"],
    ["One Dark", "one_dark", "dark"],
    ["Pastel on dark", "pastel_on_dark", "dark"],
    ["Solarized Dark", "solarized_dark", "dark"],
    ["Terminal", "terminal", "dark"],
    ["Tomorrow Night", "tomorrow_night", "dark"],
    ["Tomorrow Night Blue", "tomorrow_night_blue", "dark"],
    ["Tomorrow Night Bright", "tomorrow_night_bright", "dark"],
    ["Tomorrow Night 80s", "tomorrow_night_eighties", "dark"],
    ["Twilight", "twilight", "dark"],
    ["Vibrant Ink", "vibrant_ink", "dark"]
];
exports.themesByName = {};
exports.themes = themeData.map(function (data) {
    var name = data[1] || data[0].replace(/ /g, "_").toLowerCase();
    var theme = {
        caption: data[0],
        theme: "ace/theme/" + name,
        isDark: data[2] == "dark",
        name: name
    };
    exports.themesByName[name] = theme;
    return theme;
});

});

define("ace/mode/python_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module){/*
 * TODO: python delimiters
 */
"use strict";
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var PythonHighlightRules = function () {
    var keywords = ("and|as|assert|break|class|continue|def|del|elif|else|except|exec|" +
        "finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|" +
        "raise|return|try|while|with|yield|async|await|nonlocal");
    var builtinConstants = ("True|False|None|NotImplemented|Ellipsis|__debug__");
    var builtinFunctions = ("abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|" +
        "eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|" +
        "binfile|bin|iter|property|tuple|bool|filter|len|range|type|bytearray|" +
        "float|list|raw_input|unichr|callable|format|locals|reduce|unicode|" +
        "chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|" +
        "cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|" +
        "__import__|complex|hash|min|apply|delattr|help|next|setattr|set|" +
        "buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern|" +
        "ascii|breakpoint|bytes");
    var keywordMapper = this.createKeywordMapper({
        "invalid.deprecated": "debugger",
        "support.function": builtinFunctions,
        "variable.language": "self|cls",
        "constant.language": builtinConstants,
        "keyword": keywords
    }, "identifier");
    var strPre = "[uU]?";
    var strRawPre = "[rR]";
    var strFormatPre = "[fF]";
    var strRawFormatPre = "(?:[rR][fF]|[fF][rR])";
    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var octInteger = "(?:0[oO]?[0-7]+)";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + "|" + binInteger + ")";
    var exponent = "(?:[eE][+-]?\\d+)";
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var exponentFloat = "(?:(?:" + pointFloat + "|" + intPart + ")" + exponent + ")";
    var floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";
    var stringEscape = "\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";
    this.$rules = {
        "start": [{
                token: "comment",
                regex: "#.*$"
            }, {
                token: "string",
                regex: strPre + '"{3}',
                next: "qqstring3"
            }, {
                token: "string",
                regex: strPre + '"(?=.)',
                next: "qqstring"
            }, {
                token: "string",
                regex: strPre + "'{3}",
                next: "qstring3"
            }, {
                token: "string",
                regex: strPre + "'(?=.)",
                next: "qstring"
            }, {
                token: "string",
                regex: strRawPre + '"{3}',
                next: "rawqqstring3"
            }, {
                token: "string",
                regex: strRawPre + '"(?=.)',
                next: "rawqqstring"
            }, {
                token: "string",
                regex: strRawPre + "'{3}",
                next: "rawqstring3"
            }, {
                token: "string",
                regex: strRawPre + "'(?=.)",
                next: "rawqstring"
            }, {
                token: "string",
                regex: strFormatPre + '"{3}',
                next: "fqqstring3"
            }, {
                token: "string",
                regex: strFormatPre + '"(?=.)',
                next: "fqqstring"
            }, {
                token: "string",
                regex: strFormatPre + "'{3}",
                next: "fqstring3"
            }, {
                token: "string",
                regex: strFormatPre + "'(?=.)",
                next: "fqstring"
            }, {
                token: "string",
                regex: strRawFormatPre + '"{3}',
                next: "rfqqstring3"
            }, {
                token: "string",
                regex: strRawFormatPre + '"(?=.)',
                next: "rfqqstring"
            }, {
                token: "string",
                regex: strRawFormatPre + "'{3}",
                next: "rfqstring3"
            }, {
                token: "string",
                regex: strRawFormatPre + "'(?=.)",
                next: "rfqstring"
            }, {
                token: "keyword.operator",
                regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|@|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
            }, {
                token: "punctuation",
                regex: ",|:|;|\\->|\\+=|\\-=|\\*=|\\/=|\\/\\/=|%=|@=|&=|\\|=|^=|>>=|<<=|\\*\\*="
            }, {
                token: "paren.lparen",
                regex: "[\\[\\(\\{]"
            }, {
                token: "paren.rparen",
                regex: "[\\]\\)\\}]"
            }, {
                token: ["keyword", "text", "entity.name.function"],
                regex: "(def|class)(\\s+)([\\u00BF-\\u1FFF\\u2C00-\\uD7FF\\w]+)"
            }, {
                token: "text",
                regex: "\\s+"
            }, {
                include: "constants"
            }],
        "qqstring3": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: '"{3}',
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "qstring3": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "'{3}",
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "qqstring": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "\\\\$",
                next: "qqstring"
            }, {
                token: "string",
                regex: '"|$',
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "qstring": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "\\\\$",
                next: "qstring"
            }, {
                token: "string",
                regex: "'|$",
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "rawqqstring3": [{
                token: "string",
                regex: '"{3}',
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "rawqstring3": [{
                token: "string",
                regex: "'{3}",
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "rawqqstring": [{
                token: "string",
                regex: "\\\\$",
                next: "rawqqstring"
            }, {
                token: "string",
                regex: '"|$',
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "rawqstring": [{
                token: "string",
                regex: "\\\\$",
                next: "rawqstring"
            }, {
                token: "string",
                regex: "'|$",
                next: "start"
            }, {
                defaultToken: "string"
            }],
        "fqqstring3": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: '"{3}',
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "fqstring3": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "'{3}",
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "fqqstring": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "\\\\$",
                next: "fqqstring"
            }, {
                token: "string",
                regex: '"|$',
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "fqstring": [{
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                token: "string",
                regex: "'|$",
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "rfqqstring3": [{
                token: "string",
                regex: '"{3}',
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "rfqstring3": [{
                token: "string",
                regex: "'{3}",
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "rfqqstring": [{
                token: "string",
                regex: "\\\\$",
                next: "rfqqstring"
            }, {
                token: "string",
                regex: '"|$',
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "rfqstring": [{
                token: "string",
                regex: "'|$",
                next: "start"
            }, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {
                defaultToken: "string"
            }],
        "fqstringParRules": [{
                token: "paren.lparen",
                regex: "[\\[\\(]"
            }, {
                token: "paren.rparen",
                regex: "[\\]\\)]"
            }, {
                token: "string",
                regex: "\\s+"
            }, {
                token: "string",
                regex: "'[^']*'"
            }, {
                token: "string",
                regex: '"[^"]*"'
            }, {
                token: "function.support",
                regex: "(!s|!r|!a)"
            }, {
                include: "constants"
            }, {
                token: 'paren.rparen',
                regex: "}",
                next: 'pop'
            }, {
                token: 'paren.lparen',
                regex: "{",
                push: "fqstringParRules"
            }],
        "constants": [{
                token: "constant.numeric",
                regex: "(?:" + floatNumber + "|\\d+)[jJ]\\b"
            }, {
                token: "constant.numeric",
                regex: floatNumber
            }, {
                token: "constant.numeric",
                regex: integer + "[lL]\\b"
            }, {
                token: "constant.numeric",
                regex: integer + "\\b"
            }, {
                token: ["punctuation", "function.support"],
                regex: "(\\.)([a-zA-Z_]+)\\b"
            }, {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }]
    };
    this.normalizeRules();
};
oop.inherits(PythonHighlightRules, TextHighlightRules);
exports.PythonHighlightRules = PythonHighlightRules;

});

define("ace/mode/sdprompt_highlight_rules",["require","exports","module","ace/ext/themelist","ace/lib/oop","ace/mode/text_highlight_rules","ace/mode/python_highlight_rules"], function(require, exports, module){"use strict";
require("../ext/themelist");
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var PythonHighlightRules = require("./python_highlight_rules").PythonHighlightRules;
var prompt = {
    re: {
        extranetwork: {
            begin: "<",
            end: ">",
        },
        promptstep: {
            begin: "\\[",
            end: "\\]",
        },
        promptweight: {
            begin: "\\(",
            end: "\\)",
        },
        promptvariable: {
            begin: "\\$\\{",
            end: "\\}",
        },
        dynamicselection: {
            begin: "\\{",
            end: "\\}",
        },
        wildcard: {
            begin: "__",
            end: "__",
        }
    }
};
var supportConstantColor = "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen";
var sdpromptHighlightRules = function () {
    this.$rules = {
        "start": [
            { token: "invalid", regex: ">" },
            { token: "invalid", regex: "\\)" },
            { token: "invalid", regex: "\\]" },
            { token: "invalid", regex: "\\}" },
            { token: "text", regex: "\\s+" },
            { token: "constant.language.escape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
        ],
        "specialsyntax": [
            { token: "extranetwork.keyword.begin", regex: prompt.re.extranetwork.begin, push: "extranetwork" },
            { token: "promptstep.keyword.begin", regex: prompt.re.promptstep.begin, push: "state.step" },
            { token: "promptweight.keyword.begin", regex: prompt.re.promptweight.begin, push: "state.weight" },
            { token: "promptvariable.keyword.begin", regex: prompt.re.promptvariable.begin, push: "state.variable" },
            { token: "dynamicselection.keyword.begin", regex: prompt.re.dynamicselection.begin, push: "state.dynamicselection" },
            { token: "keyword", regex: prompt.re.wildcard.begin, push: "state.wildcard" },
            { token: "keyword", regex: "(AND|BREAK)" },
            { token: "qualitytag.variable.language", regex: "\\b(\\w+[\\s_]+quality|masterpiece)" },
            { token: "support.constant.color", regex: "((?<=[\\s_])|\\b)(" + supportConstantColor + ")((?=[\\s_])|\\b)" },
        ],
        "state.weight": [
            { token: "constant.language.escape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "promptweight.keyword.end", regex: prompt.re.promptweight.end, next: "pop" },
            { token: "promptweight.keyword.operator", regex: ":", next: "state.weight.op" },
            { token: "comment", regex: /#.+$/ },
            { include: "specialsyntax" },
            { defaultToken: "promptweight" }
        ],
        "state.weight.op": [
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "promptweight.keyword.end", regex: prompt.re.promptweight.end, next: "pop" },
            { token: "promptweight.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "comment", regex: /#.+$/ },
            { include: "specialsyntax" },
            { defaultToken: "promptweight" }
        ],
        "state.wildcard": [
            { token: "constant.language.escape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "promptwildcardtemplate.keyword.begin", regex: prompt.re.promptweight.begin, push: "state.wildcard.template" },
            { token: "promptwildcard.keyword.end", regex: prompt.re.wildcard.end, next: "pop" },
            { token: "promptwildcard.keyword.operator", regex: ":", next: "state.weight.op" },
            { token: "promptwildcard.keyword.operator", regex: "[~@]" },
            { token: "comment", regex: /#.+$/ },
            { defaultToken: "promptwildcard.keyword" }
        ],
        "state.wildcard.template": [
            { token: "constant.language.escape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "promptwildcardtemplate.keyword.end", regex: prompt.re.promptweight.end, next: "pop" },
            { token: "promptwildcardtemplate.keyword.operator", regex: "[:=]" },
            { token: "promptwildcardtemplate.keyword.operator", regex: "[~@]" },
            { token: "comment", regex: /#.+$/ },
            { defaultToken: "promptwildcardtemplate" }
        ],
        "state.variable": [
            { token: "constant.language.escape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "promptvariable.keyword.end", regex: prompt.re.promptvariable.end, next: "pop" },
            { token: "promptvariable.keyword.operator", regex: "[=\\!]" },
            { token: "promptvariable.keyword.operator", regex: "[~@]" },
            { token: "promptvariable.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "comment", regex: /#.+$/ },
            { include: "specialsyntax" },
            { defaultToken: "promptvariable" }
        ],
        "state.dynamicselection": [
            { token: "constant.language.escape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "keyword", regex: prompt.re.dynamicselection.end, next: "pop" },
            { token: "keyword.operator", regex: "[:|\\|]" },
            { token: "keyword", regex: "\\$\\$" },
            { token: "keyword.operator", regex: "[~@]" },
            { token: "constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "comment", regex: /#.+$/ },
            { include: "specialsyntax" },
            { defaultToken: "dynamicselection" }
        ],
        "state.step": [
            { token: "promptstep.keyword.operator", regex: "\\\\u0023", next: "supercmd" },
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "promptstep.keyword.end", regex: prompt.re.promptstep.end, next: "pop" },
            { token: "promptstep.keyword.operator", regex: ":", next: "state.step.op" },
            { token: "promptstep.keyword.operator", regex: "\\|" },
            { token: "comment", regex: /#.+$/ },
            { include: "specialsyntax" },
            { defaultToken: "promptstep" }
        ],
        "state.step.op": [
            { token: "constant.language.escape", regex: "\\\\", push: "state.escape" },
            { token: "promptstep.keyword.end", regex: prompt.re.promptstep.end, next: "pop" },
            { token: "promptstep.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "promptstep.keyword.operator", regex: "\\|", next: "state.step.op" },
            { token: "comment", regex: /#.+$/ },
            { include: "specialsyntax" },
            { defaultToken: "promptstep" }
        ],
        "state.escape.unicode": [
            { token: "constant.language.escape", regex: "\\d{4}", next: "pop" },
            { defaultToken: "constant.language.escape" }
        ],
        "supercmd": [
            { token: "keyword", regex: "cmd\\\\\\(", next: "python-start" },
            { token: "keyword", regex: "\\w+\\b", next: "state.step" },
            { token: "supercmd.stop", regex: "[:\\]]", next: "state.step" },
            { defaultToken: "supercmd" }
        ],
        "state.escape": [
            { token: "constant.language.escape", regex: ".", next: "pop" },
            { defaultToken: "text" }
        ],
        "extranetwork": [
            { token: "extranetwork.keyword.end", regex: prompt.re.extranetwork.end, next: "pop" },
            { token: "invalid", regex: "<" },
            { token: "extranetwork.storage.type", regex: "[^:]+", next: "extranetwork.id" },
            { defaultToken: "extranetwork" }
        ],
        "extranetwork.id": [
            { token: "invalid", regex: "<" },
            { token: "extranetwork.name.variable.language", regex: "[^:>]+", next: "extranetwork.param" },
            { token: "extranetwork.keyword.end", regex: prompt.re.extranetwork.end, next: "pop" },
            { token: "extranetwork.split", regex: ":" },
            { defaultToken: "extranetwork" }
        ],
        "extranetwork.param": [
            { token: "invalid", regex: "<" },
            { token: "extranetwork.keyword.end", regex: prompt.re.extranetwork.end, next: "pop" },
            { token: "extranetwork.split", regex: ":" },
            { token: "extranetwork.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { defaultToken: "extranetwork" }
        ],
    };
    this.embedRules(PythonHighlightRules, "python-", [
        { token: "keyword", regex: "\\\\\\)", next: "supercmd" },
    ]);
    this.normalizeRules();
};
sdpromptHighlightRules.metaData = oop.inherits(sdpromptHighlightRules, TextHighlightRules);
exports.sdpromptHighlightRules = sdpromptHighlightRules;

});

define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module){"use strict";
var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;
var FoldMode = exports.FoldMode = function (commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start));
        this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end));
    }
};
oop.inherits(FoldMode, BaseFoldMode);
(function () {
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function (session, foldStyle, row) {
        var line = session.getLine(row);
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
        return fw;
    };
    this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;
            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                }
                else if (foldStyle != "all")
                    range = null;
            }
            return range;
        }
        if (foldStyle === "markbegin")
            return;
        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;
            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);
            return session.getCommentFoldRange(row, i, -1);
        }
    };
    this.getSectionRange = function (session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                }
                else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                }
                else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function (session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m)
                continue;
            if (m[1])
                depth--;
            else
                depth++;
            if (!depth)
                break;
        }
        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };
}).call(FoldMode.prototype);

});

define("ace/mode/sdprompt",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/sdprompt_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HighlightRules = require("./sdprompt_highlight_rules").sdpromptHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;
var Mode = function () {
    this.HighlightRules = HighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);
(function () {
    this.$id = "ace/mode/sdprompt";
}).call(Mode.prototype);
exports.Mode = Mode;

});
                (function() {
                    window.require(["ace/mode/sdprompt"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            