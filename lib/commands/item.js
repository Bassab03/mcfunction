const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  BooleanOutput = require("../class/output/BooleanOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  StringOutput = require("../class/output/StringOutput");

class ItemCommand extends BaseCommand {

  constructor() {super("item");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("item", "Modifies items")];
      }
      case 2: {
        return [new EnumOutput(
          ["modify", "Sub Command"],
          ["replace", "Sub Command"]
        )];
      }
    }
    const subCommand = tokens[1].getValue();
    switch (subCommand) {
      case "modify": {
        let index = tokens.length;
        if (index === 3) {
          return [new EnumOutput(
            ["block", "Modify Target"],
            ["entity", "Modify Target"]
          )];
        }
        const subCommand = tokens[2].getValue();
        if (subCommand === "entity") {
          if (index === 4) {
            return [new SelectorOutput("The targets to modify items on", "targets")];
          }
          index += 2;
        } else if (subCommand === "block") {
          
        }
        switch (index) {

        }
        break;
      }
    }
  }

}

module.exports = {
  "1.17": new ItemCommand
};