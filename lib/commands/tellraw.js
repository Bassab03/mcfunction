const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  NBTOutput = require("../class/output/NBTOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class TellRawCommand extends BaseCommand {
  constructor() {super("tellraw");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("tellraw", "Sends JSON messages to players.")];
      }
      case 2: {
        return [new SelectorOutput(null, "targets")];
      }
      case 3: {
        return [new NBTOutput("message", "The raw JSON message.", "{\"text\":\"example\"}")];
      }
    }
  }
}

module.exports = {
  "1.12": new TellRawCommand
};
