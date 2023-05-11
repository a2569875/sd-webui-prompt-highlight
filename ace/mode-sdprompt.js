define("ace/mode/inside_python_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var inside_pythonHighlightRules = function () {
    var keywords = ("and|as|assert|break|class|continue|def|del|elif|else|except|" +
        "finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|" +
        "raise|return|try|while|with|yield|async|await|nonlocal");
    var builtinConstants = ("True|False|None|NotImplemented|Ellipsis|__debug__|pi|weight|life|" +
        "steps");
    var specialVariable = ("self|cls|lora|lora_module|lora_type|lora_name|layer_name|" +
        "current_prompt|sd_processing|enable_prepare_step|step");
    var builtinFunctions = ("abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|" +
        "isinstance|pow|sum|basestring|execfile|issubclass|print|super|" +
        "binfile|bin|iter|property|tuple|bool|filter|len|range|type|bytearray|" +
        "float|list|raw_input|unichr|callable|format|locals|reduce|unicode|" +
        "chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|" +
        "cmp|globals|max|reversed|zip|hasattr|memoryview|round|" +
        "complex|hash|min|apply|delattr|help|next|setattr|set|" +
        "buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern|" +
        "ascii|bytes|ceil|fmod|gcd|perm|sqrt|exp|log|clamp|" +
        "asin|acos|atan|sin|cos|tan|sinr|asinr|sinh|asinh|abssin|abscos|" +
        "random|warmup|cooldown");
    var functionNotAlloe = ("eval|exec|compile|breakpoint|__import__");
    var keywordMapper = this.createKeywordMapper({
        "prompttoken.invalid.deprecated": "debugger",
        "prompttoken.support.function": builtinFunctions,
        "prompttoken.variable.language": specialVariable,
        "prompttoken.constant.language": builtinConstants,
        "prompttoken.keyword": keywords,
        "prompttoken.support.function.invalid": functionNotAlloe,
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
    var STRING_TOKEN = "prompttoken.string";
    this.$rules = {
        "start": [{
                token: "prompttoken.comment",
                regex: "#.*$"
            }, {
                token: STRING_TOKEN,
                regex: strPre + '"{3}',
                next: "qqstring3"
            }, {
                token: STRING_TOKEN,
                regex: strPre + '"(?=.)',
                next: "qqstring"
            }, {
                token: STRING_TOKEN,
                regex: strPre + "'{3}",
                next: "qstring3"
            }, {
                token: STRING_TOKEN,
                regex: strPre + "'(?=.)",
                next: "qstring"
            }, {
                token: STRING_TOKEN,
                regex: strRawPre + '"{3}',
                next: "rawqqstring3"
            }, {
                token: STRING_TOKEN,
                regex: strRawPre + '"(?=.)',
                next: "rawqqstring"
            }, {
                token: STRING_TOKEN,
                regex: strRawPre + "'{3}",
                next: "rawqstring3"
            }, {
                token: STRING_TOKEN,
                regex: strRawPre + "'(?=.)",
                next: "rawqstring"
            }, {
                token: STRING_TOKEN,
                regex: strFormatPre + '"{3}',
                next: "fqqstring3"
            }, {
                token: STRING_TOKEN,
                regex: strFormatPre + '"(?=.)',
                next: "fqqstring"
            }, {
                token: STRING_TOKEN,
                regex: strFormatPre + "'{3}",
                next: "fqstring3"
            }, {
                token: STRING_TOKEN,
                regex: strFormatPre + "'(?=.)",
                next: "fqstring"
            }, {
                token: STRING_TOKEN,
                regex: strRawFormatPre + '"{3}',
                next: "rfqqstring3"
            }, {
                token: STRING_TOKEN,
                regex: strRawFormatPre + '"(?=.)',
                next: "rfqqstring"
            }, {
                token: STRING_TOKEN,
                regex: strRawFormatPre + "'{3}",
                next: "rfqstring3"
            }, {
                token: STRING_TOKEN,
                regex: strRawFormatPre + "'(?=.)",
                next: "rfqstring"
            }, {
                token: "prompttoken.keyword.operator",
                regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|@|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
            }, {
                token: "prompttoken.punctuation",
                regex: ",|:|;|\\->|\\+=|\\-=|\\*=|\\/=|\\/\\/=|%=|@=|&=|\\|=|^=|>>=|<<=|\\*\\*="
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?[\\[\\(\\{]"
            }, {
                token: "prompttoken.paren.rparen",
                regex: "\\\\?[\\]\\)\\}]"
            }, {
                token: ["prompttoken.keyword", "prompttoken.text", "prompttoken.entity.name.function"],
                regex: "(def|class)(\\s+)([\\u00BF-\\u1FFF\\u2C00-\\uD7FF\\w]+)"
            }, {
                token: "prompttoken.text",
                regex: "\\s+"
            }, {
                include: "constants"
            }],
        "qqstring3": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: '"{3}',
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "qstring3": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: "'{3}",
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "qqstring": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: "\\\\$",
                next: "qqstring"
            }, {
                token: STRING_TOKEN,
                regex: '"|$',
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "qstring": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: "\\\\$",
                next: "qstring"
            }, {
                token: STRING_TOKEN,
                regex: "'|$",
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rawqqstring3": [{
                token: STRING_TOKEN,
                regex: '"{3}',
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rawqstring3": [{
                token: STRING_TOKEN,
                regex: "'{3}",
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rawqqstring": [{
                token: STRING_TOKEN,
                regex: "\\\\$",
                next: "rawqqstring"
            }, {
                token: STRING_TOKEN,
                regex: '"|$',
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rawqstring": [{
                token: STRING_TOKEN,
                regex: "\\\\$",
                next: "rawqstring"
            }, {
                token: STRING_TOKEN,
                regex: "'|$",
                next: "start"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "fqqstring3": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: '"{3}',
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "fqstring3": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: "'{3}",
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "fqqstring": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: "\\\\$",
                next: "fqqstring"
            }, {
                token: STRING_TOKEN,
                regex: '"|$',
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "fqstring": [{
                token: "prompttoken.constant.language.escape.charescape",
                regex: stringEscape
            }, {
                token: STRING_TOKEN,
                regex: "'|$",
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rfqqstring3": [{
                token: STRING_TOKEN,
                regex: '"{3}',
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rfqstring3": [{
                token: STRING_TOKEN,
                regex: "'{3}",
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rfqqstring": [{
                token: STRING_TOKEN,
                regex: "\\\\$",
                next: "rfqqstring"
            }, {
                token: STRING_TOKEN,
                regex: '"|$',
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "rfqstring": [{
                token: STRING_TOKEN,
                regex: "'|$",
                next: "start"
            }, {
                token: "prompttoken.paren.lparen",
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }, {
                defaultToken: STRING_TOKEN
            }],
        "fqstringParRules": [{
                token: "prompttoken.paren.lparen",
                regex: "\\\\?[\\[\\(]"
            }, {
                token: "prompttoken.paren.rparen",
                regex: "\\\\?[\\]\\)]"
            }, {
                token: STRING_TOKEN,
                regex: "\\s+"
            }, {
                token: STRING_TOKEN,
                regex: "'[^']*'"
            }, {
                token: STRING_TOKEN,
                regex: '"[^"]*"'
            }, {
                token: "prompttoken.function.support",
                regex: "(!s|!r|!a)"
            }, {
                include: "constants"
            }, {
                token: 'prompttoken.paren.rparen',
                regex: "\\\\?\\}",
                next: 'pop'
            }, {
                token: 'prompttoken.paren.lparen',
                regex: "\\\\?\\{",
                push: "fqstringParRules"
            }],
        "constants": [{
                token: "prompttoken.constant.numeric",
                regex: "(?:" + floatNumber + "|\\d+)[jJ]\\b"
            }, {
                token: "prompttoken.constant.numeric",
                regex: floatNumber
            }, {
                token: "prompttoken.constant.numeric",
                regex: integer + "[lL]\\b"
            }, {
                token: "prompttoken.constant.numeric",
                regex: integer + "\\b"
            }, {
                token: ["prompttoken.punctuation", "prompttoken.function.support"],
                regex: "(\\.)([a-zA-Z_]+)\\b"
            }, {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }]
    };
    this.normalizeRules();
};
oop.inherits(inside_pythonHighlightRules, TextHighlightRules);
exports.inside_pythonHighlightRules = inside_pythonHighlightRules;

});

define("ace/mode/inside_pythonic",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode"], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var BaseFoldMode = require("./folding/fold_mode").FoldMode;
var FoldMode = exports.FoldMode = function (markers) {
    this.foldingStartMarker = new RegExp("(\\\\?[\\[{])(?:\\s*)$|\\\\?(" + markers + ")(?:\\s*)(?:#.*)?$");
};
oop.inherits(FoldMode, BaseFoldMode);
(function () {
    this.getFoldWidgetRange = function (session, foldStyle, row) {
        var line = session.getLine(row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            if (match[1])
                return this.openingBracketBlock(session, match[1], row, match.index);
            if (match[2])
                return this.indentationBlock(session, row, match.index + match[2].length);
            return this.indentationBlock(session, row);
        }
    };
}).call(FoldMode.prototype);

});

define("ace/mode/inside_python",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/inside_python_highlight_rules","ace/mode/inside_pythonic","ace/range"], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var InsidePythonHighlightRules = require("./inside_python_highlight_rules").inside_pythonHighlightRules;
var InsidePythonFoldMode = require("./inside_pythonic").FoldMode;
var Range = require("../range").Range;
var Mode = function () {
    this.HighlightRules = InsidePythonHighlightRules;
    this.foldingRules = new InsidePythonFoldMode("\\:");
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);
(function () {
    this.lineCommentStart = "#";
    this.$pairQuotesAfter = {
        "'": /[ruf]/i,
        '"': /[ruf]/i
    };
    this.getNextLineIndent = function (state, line, tab) {
        var indent = this.$getIndent(line);
        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        if (tokens.length && tokens[tokens.length - 1].type == "prompttoken.comment") {
            return indent;
        }
        if (state == "start") {
            var match = line.match(/^.*[\{\(\[:]\s*$/);
            if (match) {
                indent += tab;
            }
        }
        return indent;
    };
    var outdents = {
        "pass": 1,
        "return": 1,
        "raise": 1,
        "break": 1,
        "continue": 1
    };
    this.checkOutdent = function (state, line, input) {
        if (input !== "\r\n" && input !== "\r" && input !== "\n")
            return false;
        var tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;
        if (!tokens)
            return false;
        do {
            var last = tokens.pop();
        } while (last && (last.type == "prompttoken.comment" || (last.type == "prompttoken.text" && last.value.match(/^\s+$/))));
        if (!last)
            return false;
        return (last.type == "prompttoken.keyword" && outdents[last.value]);
    };
    this.autoOutdent = function (state, doc, row) {
        row += 1;
        var indent = this.$getIndent(doc.getLine(row));
        var tab = doc.getTabString();
        if (indent.slice(-tab.length) == tab)
            doc.remove(new Range(row, indent.length - tab.length, row, indent.length));
    };
    this.$id = "ace/mode/inside_python";
    this.snippetFileId = "ace/snippets/python";
}).call(Mode.prototype);
exports.Mode = Mode;

});

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

define("ace/mode/sdprompt_highlight_rules",["require","exports","module","ace/ext/themelist","ace/lib/oop","ace/mode/text_highlight_rules","ace/mode/inside_python_highlight_rules"], function(require, exports, module){"use strict";
require("../ext/themelist");
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var PythonHighlightRules = require("./inside_python_highlight_rules").inside_pythonHighlightRules;
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
var supportConstantColor = /(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)_/;
function getColorToken(base_token) {
    return (function (default_token) {
        return {
            token: (function (defaultToken) {
                return function (name) {
                    var colorItem = prompthighl.getColorItem(name.trim());
                    if (colorItem)
                        return "prompttoken.sdpromptcolor.color_" + colorItem.title;
                    var cssColor = (supportConstantColor.exec(name.trim()) || [])[1];
                    if (cssColor)
                        return "prompttoken.csscolor.color_" + cssColor.trim();
                    return defaultToken;
                };
            })(default_token),
            regex: "\\b\\w+(?=rgb\\b)|\\b\\w+\\b"
        };
    })(base_token);
}
var rgbColorToken = {
    token: function (red, green, blue) {
        var input_color = { r: parseFloat(red), g: parseFloat(green), b: parseFloat(blue) };
        if (input_color.r < 256 && input_color.g < 256 && input_color.b < 256) {
            return "prompttoken.csscolor.rgb_".concat(input_color.r, "_").concat(input_color.g, "_").concat(input_color.b);
        }
        return "prompttoken.invalid";
    },
    regex: "rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)"
};
var sdpromptHighlightRules = function () {
    this.$rules = {
        "start": [
            { token: "prompttoken.invalid", regex: ">" },
            { token: "prompttoken.invalid", regex: "\\)" },
            { token: "prompttoken.invalid", regex: "\\]" },
            { token: "prompttoken.invalid", regex: "\\}" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
            getColorToken("prompttoken.text"),
        ],
        "specialsyntax": [
            { token: "prompttoken.whitespace", regex: "\\s+" },
            rgbColorToken,
            { token: "prompttoken.split", regex: "," },
            { token: "prompttoken.extranetwork.keyword.begin", regex: prompt.re.extranetwork.begin, push: "extranetwork" },
            { token: "prompttoken.promptstep.keyword.begin", regex: prompt.re.promptstep.begin, push: "state.step" },
            { token: "prompttoken.promptweight.keyword.begin", regex: prompt.re.promptweight.begin, push: "state.weight" },
            { token: "prompttoken.promptvariable.keyword.begin", regex: prompt.re.promptvariable.begin, push: "state.variable" },
            { token: "prompttoken.dynamicselection.keyword.begin", regex: prompt.re.dynamicselection.begin, push: "state.dynamicselection" },
            { token: "prompttoken.keyword", regex: prompt.re.wildcard.begin, push: "state.wildcard" },
            { token: "prompttoken.promptkeyword.keyword", regex: "(AND|BREAK)" },
            { token: "prompttoken.qualitytag.variable.language", regex: "\\b(\\w+[\\s_]+quality|masterpiece)" },
        ],
        "state.weight": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.promptweight.keyword.end", regex: prompt.re.promptweight.end, next: "pop" },
            { token: "prompttoken.promptweight.keyword.operator", regex: ":", next: "state.weight.op" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
            getColorToken("prompttoken.promptweight"),
            { defaultToken: "prompttoken.promptweight" }
        ],
        "state.weight.op": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.promptweight.keyword.end", regex: prompt.re.promptweight.end, next: "pop" },
            { token: "prompttoken.promptweight.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
            getColorToken("prompttoken.promptweight"),
            { defaultToken: "prompttoken.promptweight" }
        ],
        "state.wildcard": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.promptwildcardtemplate.keyword.begin", regex: prompt.re.promptweight.begin, push: "state.wildcard.template" },
            { token: "prompttoken.promptwildcard.keyword.end", regex: prompt.re.wildcard.end, next: "pop" },
            { token: "prompttoken.promptwildcard.keyword.operator", regex: ":", next: "state.weight.op" },
            { token: "prompttoken.promptwildcard.keyword.operator", regex: "[~@]" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { defaultToken: "prompttoken.promptwildcard.keyword" }
        ],
        "state.wildcard.template": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.promptwildcardtemplate.keyword.end", regex: prompt.re.promptweight.end, next: "pop" },
            { token: "prompttoken.promptwildcardtemplate.keyword.operator", regex: "[:=]" },
            { token: "prompttoken.promptwildcardtemplate.keyword.operator", regex: "[~@]" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            getColorToken("prompttoken.promptwildcardtemplate"),
            { defaultToken: "prompttoken.promptwildcardtemplate" }
        ],
        "state.variable": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.promptvariable.keyword.end", regex: prompt.re.promptvariable.end, next: "pop" },
            { token: "prompttoken.promptvariable.keyword.operator", regex: "[=\\!]" },
            { token: "prompttoken.promptvariable.keyword.operator", regex: "[~@]" },
            { token: "prompttoken.promptvariable.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
            getColorToken("prompttoken.promptvariable"),
            { defaultToken: "prompttoken.promptvariable" }
        ],
        "state.dynamicselection": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\u", push: "state.escape.unicode" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.keyword", regex: prompt.re.dynamicselection.end, next: "pop" },
            { token: "prompttoken.keyword.operator", regex: "[:|\\|]" },
            { token: "prompttoken.keyword", regex: "\\$\\$" },
            { token: "prompttoken.keyword.operator", regex: "[~@]" },
            { token: "prompttoken.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
            getColorToken("prompttoken.dynamicselection"),
            { defaultToken: "prompttoken.dynamicselection" }
        ],
        "state.step": [
            { token: "prompttoken.promptstep.keyword.operator.charescape", regex: "\\\\u0023", next: "supercmd" },
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.promptstep.keyword.end", regex: prompt.re.promptstep.end, next: "pop" },
            { token: "prompttoken.promptstep.keyword.operator", regex: ":", next: "state.step.op" },
            { token: "prompttoken.promptstep.keyword.operator", regex: "\\|" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
            getColorToken("prompttoken.promptstep"),
            { defaultToken: "prompttoken.promptstep" }
        ],
        "state.step.op": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\\\", push: "state.escape" },
            { token: "prompttoken.promptstep.keyword.end", regex: prompt.re.promptstep.end, next: "pop" },
            { token: "prompttoken.promptstep.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { token: "prompttoken.promptstep.keyword.operator", regex: "\\|", next: "state.step.op" },
            { token: "prompttoken.comment", regex: /#.+$/ },
            { include: "specialsyntax", caseInsensitive: true },
            getColorToken("prompttoken.promptstep"),
            { defaultToken: "prompttoken.promptstep" }
        ],
        "state.escape.unicode": [
            { token: "prompttoken.constant.language.escape.charescape", regex: "\\d{4}", next: "pop" },
            { defaultToken: "prompttoken.constant.language.escape.charescape" }
        ],
        "supercmd": [
            { token: "prompttoken.supercmd.keyword", regex: "cmd\\\\\\(", next: "python-start" },
            { token: "prompttoken.supercmd.keyword", regex: "\\w+\\b", next: "state.step" },
            { token: "prompttoken.supercmd.stop", regex: "[:\\]]", next: "state.step" },
            { defaultToken: "prompttoken.supercmd" }
        ],
        "state.escape": [
            { token: "prompttoken.constant.language.escape.charescape", regex: ".", next: "pop" },
            { defaultToken: "prompttoken.constant.language.escape.charescape" }
        ],
        "extranetwork": [
            { token: "prompttoken.extranetwork.keyword.end", regex: prompt.re.extranetwork.end, next: "pop" },
            { token: "prompttoken.extranetwork.invalid", regex: "<" },
            { token: "prompttoken.extranetwork.storage.type", regex: "[^:]+", next: "extranetwork.id" },
            { defaultToken: "prompttoken.extranetwork" }
        ],
        "extranetwork.id": [
            { token: "prompttoken.extranetwork.invalid", regex: "<" },
            { token: "prompttoken.extranetwork.name.variable.language", regex: "[^:>]+", next: "extranetwork.param" },
            { token: "prompttoken.extranetwork.keyword.end", regex: prompt.re.extranetwork.end, next: "pop" },
            { token: "prompttoken.extranetwork.split", regex: ":" },
            { defaultToken: "prompttoken.extranetwork" }
        ],
        "extranetwork.param": [
            { token: "prompttoken.extranetwork.invalid", regex: "<" },
            { token: "prompttoken.extranetwork.keyword.end", regex: prompt.re.extranetwork.end, next: "pop" },
            { token: "prompttoken.extranetwork.split", regex: ":" },
            { token: "prompttoken.extranetwork.constant.numeric", regex: "[+-]?[\\d\\.]+\\b" },
            { defaultToken: "prompttoken.extranetwork" }
        ],
    };
    this.embedRules(PythonHighlightRules, "python-", [
        { token: "prompttoken.keyword", regex: "\\\\\\)(?=\\s*[\\:#\\[\\]])", next: "supercmd" },
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

define("ace/mode/sdprompt",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/inside_python","ace/mode/sdprompt_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PythonMode = require("./inside_python").Mode;
var HighlightRules = require("./sdprompt_highlight_rules").sdpromptHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;
var Mode = function () {
    this.HighlightRules = HighlightRules;
    this.foldingRules = new FoldMode();
    this.createModeDelegates({
        "python-": PythonMode
    });
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
            