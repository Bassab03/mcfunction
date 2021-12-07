const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  StringOutput = require("../class/output/StringOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  NumberOutput = require("../class/output/NumberOutput");

class TriggerCommand extends BaseCommand {
  constructor() {super("trigger");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("trigger", "Modifies scoreboard objectives with a trigger criterion.")];
      }
      case 2: {
        return [new StringOutput("${1:objective}", "The objective to modify", true, "objective")];
      }
      case 3: {
        return [(new EnumOutput(
          ["add", "Sub Command", "Adds a value to the scoreboard."],
          ["set", "Sub Command", "Sets the value to the scoreboard."]
        )).optional()];
      }
      case 4: {
        const subCommand = tokens[2].getValue();
        if (["add", "set"].includes(subCommand)) {
          return [new NumberOutput("value", "The value to add/set", "1")];
        }
      }
    }
  }
}

module.exports = {
  "1.12": new TriggerCommand
};