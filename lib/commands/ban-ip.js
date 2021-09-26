const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  StringOutput = require("../class/output/StringOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class BanIPCommand extends BaseCommand {
  constructor() {super("ban-ip");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
    case 1: {
      return [new CommandNameOutput("ban-ip", "Ban players from a server by IP address. Multiplayer only; Must set <code>function-permission-level=3</code> or higher.")];
    }
    case 2: {
      return [
        new SelectorOutput
      ];
    }
    case 3: {
      return [
        (new StringOutput(tokens[tokens.length - 1].getValue() || " ", null, false, "reason")).optional(),
      ];
    }
    }
  }
}

module.exports = {
  "1.12": new BanIPCommand
};
