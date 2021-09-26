// unsure if this can be run in a datapack
const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class ReloadCommand12 extends BaseCommand {
  constructor() {super("reload");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
    case 1: {
      return [new CommandNameOutput("reload", "Reloads world resources and datapacks. Must set 'function-permission-level=4' or higher. Unsure if this actually works in datapacks.")];
    }
    case 2: {
      return [
        new SelectorOutput
      ];
    }
    }
  }
}

class ReloadCommand14 extends ReloadCommand12 {

  handleSuggestions(tokens) {
    switch (tokens.length) {
    case 1: {
      return [new CommandNameOutput("reload", "Reloads world resources and datapacks. Unsure if this actually works in datapacks.")];
    }
    default: {
      return super.handleSuggestions(tokens);
    }
    }
  }
}

module.exports = {
  "1.12": new ReloadCommand12,
  "1.14": new ReloadCommand14
};
