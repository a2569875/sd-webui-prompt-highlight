"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var InsidePythonHighlightRules = require("./inside_python_highlight_rules").inside_pythonHighlightRules;
var InsidePythonFoldMode = require("./inside_pythonic").FoldMode;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = InsidePythonHighlightRules;
    this.foldingRules = new InsidePythonFoldMode("\\:");
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "#";
    this.$pairQuotesAfter = {
        "'": /[ruf]/i,
        '"': /[ruf]/i
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length-1].type == "prompttoken.comment") {
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
    
    this.checkOutdent = function(state, line, input) {
        if (input !== "\r\n" && input !== "\r" && input !== "\n")
            return false;

        var tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;
        
        if (!tokens)
            return false;
        
        // ignore trailing comments
        do {
            var last = tokens.pop();
        } while (last && (last.type == "prompttoken.comment" || (last.type == "prompttoken.text" && last.value.match(/^\s+$/))));
        
        if (!last)
            return false;
        
        return (last.type == "prompttoken.keyword" && outdents[last.value]);
    };

    this.autoOutdent = function(state, doc, row) {
        // outdenting in python is slightly different because it always applies
        // to the next line and only of a new line is inserted
        
        row += 1;
        var indent = this.$getIndent(doc.getLine(row));
        var tab = doc.getTabString();
        if (indent.slice(-tab.length) == tab)
            doc.remove(new Range(row, indent.length-tab.length, row, indent.length));
    };

    this.$id = "ace/mode/inside_python";
    this.snippetFileId = "ace/snippets/python";
}).call(Mode.prototype);

exports.Mode = Mode;
