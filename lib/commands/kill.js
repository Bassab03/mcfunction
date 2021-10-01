const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class KillCommand extends BaseCommand {
  constructor() {
    super("kill");
  }

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("kill", "Kills entities")];
      }
      case 2: {
        return [new SelectorOutput(null, "targets")];
      }
    }
  }
}

module.exports = {
  "1.12": new KillCommand
};
