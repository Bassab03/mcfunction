const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  StringOutput = require("../class/output/StringOutput");

class MeCommand extends BaseCommand {
  constructor() {super("me");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("me", "Sends a chat message like: '* player some text'")]
      }
      default: {
        return [new StringOutput(tokens[tokens.length - 1].getValue() || " ", null, false, "message")]
      }
    }
  }
}

module.exports = {
  "1.12": new MeCommand
};
