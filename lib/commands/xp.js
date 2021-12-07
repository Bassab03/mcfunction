const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  StringOutput = require("../class/output/StringOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class XPCommand12 extends BaseCommand {
  constructor() {super("xp");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("xp", "Manages experience of players.")];
      }
      case 2: {
        return [
          new NumberOutput("amount", "The amount of experience points to grant/remove", "100"),
          new StringOutput("${1:1}L", "The amount of levels to grant/remove", true, "amount (L)")
        ];
      }
      case 3: {
        return [(new SelectorOutput("The target(s) to grant/remove experience from.", "target")).optional()];
      }
    }
  }
}

module.exports = {
  "1.12": new XPCommand12
};