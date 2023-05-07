"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PythonMode = require("./inside_python").Mode;
var HighlightRules = require("./sdprompt_highlight_rules").sdpromptHighlightRules;
// TODO: pick appropriate fold mode
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = HighlightRules;
    this.foldingRules = new FoldMode();
    this.createModeDelegates({
        "python-": PythonMode
    });
};
oop.inherits(Mode, TextMode);

(function() {
    // this.lineCommentStart = "TODO";
    // this.blockComment = {start: "TODO", end: "TODO"};
    // Extra logic goes here.
    this.$id = "ace/mode/sdprompt";
}).call(Mode.prototype);

exports.Mode = Mode;