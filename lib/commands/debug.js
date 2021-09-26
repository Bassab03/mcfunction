const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  EnumOutput = require("../class/output/EnumOutput");

class DebugCommand12 extends BaseCommand {
  constructor() {super("debug");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("debug", "Starts/Stops debug sessions. Must set 'function-permission-level=3' or higher.")];
      }
      case 2: {
        return [
          (new EnumOutput(
            ["start", "action", "Starts a new debug time profiler session."],
            ["stop", "action", "Stops the active debug time profiler session."]
          )).optional()
        ];
      }
    }
  }
}

module.exports = {
  "1.12": new DebugCommand12
};
