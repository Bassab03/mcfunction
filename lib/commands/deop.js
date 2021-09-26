const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  StringOutput = require("../class/output/StringOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class DeopCommand extends BaseCommand {
  constructor() {super("deop");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
    case 1: {
      return [new CommandNameOutput("deop", "Removes operator permissions from players. Multiplayer only; Must set <code>function-permission-level=3</code> or higher.")];
    }
    case 2: {
      return [
        new SelectorOutput
      ];
    }
    }
  }
}

module.exports = {
  "1.12": new DeopCommand
};
