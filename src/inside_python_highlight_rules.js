"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var inside_pythonHighlightRules = function() {

    var keywords = (
        "and|as|assert|break|class|continue|def|del|elif|else|except|" +
        "finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|" +
        "raise|return|try|while|with|yield|async|await|nonlocal"
    );

    var builtinConstants = (
        "True|False|None|NotImplemented|Ellipsis|__debug__|pi|weight|life|" +
        "steps"
    );

    var specialVariable = ("self|cls|lora|lora_module|lora_type|lora_name|layer_name|"+
        "current_prompt|sd_processing|enable_prepare_step|step"
    );

    var builtinFunctions = (
        "abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|" +
        "isinstance|pow|sum|basestring|execfile|issubclass|print|super|" +
        "binfile|bin|iter|property|tuple|bool|filter|len|range|type|bytearray|" +
        "float|list|raw_input|unichr|callable|format|locals|reduce|unicode|" +
        "chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|" +
        "cmp|globals|max|reversed|zip|hasattr|memoryview|round|" +
        "complex|hash|min|apply|delattr|help|next|setattr|set|" +
        "buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern|" +
        "ascii|bytes|ceil|fmod|gcd|perm|sqrt|exp|log|clamp|" +
        "asin|acos|atan|sin|cos|tan|sinr|asinr|sinh|asinh|abssin|abscos|" +
        "random|warmup|cooldown"
    );

    var functionNotAlloe = (
        "eval|exec|compile|breakpoint|__import__"
    );

    //var futureReserved = "";
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

    const STRING_TOKEN = "prompttoken.string";
    this.$rules = {
        "start" : [ {
            token : "prompttoken.comment",
            regex : "#.*$"
        }, {
            token : STRING_TOKEN,           // multi line """ string start
            regex : strPre + '"{3}',
            next : "qqstring3"
        }, {
            token : STRING_TOKEN,           // " string
            regex : strPre + '"(?=.)',
            next : "qqstring"
        }, {
            token : STRING_TOKEN,           // multi line ''' string start
            regex : strPre + "'{3}",
            next : "qstring3"
        }, {
            token : STRING_TOKEN,           // ' string
            regex : strPre + "'(?=.)",
            next : "qstring"
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
        },{
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
            token: STRING_TOKEN, // multi line """ string end
            regex: '"{3}',
            next: "start"
        }, {
            defaultToken: STRING_TOKEN
        }],
        "qstring3": [{
            token: "prompttoken.constant.language.escape.charescape",
            regex: stringEscape
        }, {
            token: STRING_TOKEN,  // multi line ''' string end
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
            token: STRING_TOKEN, // multi line """ string end
            regex: '"{3}',
            next: "start"
        }, {
            defaultToken: STRING_TOKEN
        }],
        "rawqstring3": [{
            token: STRING_TOKEN,  // multi line ''' string end
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
            token: STRING_TOKEN, // multi line """ string end
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
            token: STRING_TOKEN,  // multi line ''' string end
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
            token: STRING_TOKEN, // multi line """ string end
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
            token: STRING_TOKEN,  // multi line ''' string end
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
        "fqstringParRules": [{//TODO: nested {}
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
        },{
            token: 'prompttoken.paren.rparen',
            regex: "\\\\?\\}",
            next: 'pop'
        },{
            token: 'prompttoken.paren.lparen',
            regex: "\\\\?\\{",
            push: "fqstringParRules"
        }],
        "constants": [{
            token: "prompttoken.constant.numeric", // imaginary
            regex: "(?:" + floatNumber + "|\\d+)[jJ]\\b"
        }, {
            token: "prompttoken.constant.numeric", // float
            regex: floatNumber
        }, {
            token: "prompttoken.constant.numeric", // long integer
            regex: integer + "[lL]\\b"
        }, {
            token: "prompttoken.constant.numeric", // integer
            regex: integer + "\\b"
        }, {
            token: ["prompttoken.punctuation", "prompttoken.function.support"],// method
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