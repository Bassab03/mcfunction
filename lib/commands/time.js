const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  EnumOutput = require("../class/output/EnumOutput");

class TimeCommand12 extends BaseCommand {
  constructor() {super("time");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("time", "Sets the world time.")];
      }
      case 2: {
        return [new EnumOutput(
          ["set", "Sub Command", "Sets the time to a specified time."],
          ["add", "Sub Command", "Adds a number of ticks to the time."],
          ["query", "Sub Command", "Gets certain statistics about the time."]
        )];
      }
      case 3: {
        const subCommand = tokens[1].getValue();
        switch (subCommand) {
          case "set": {
            return [
              new EnumOutput(
                ["day", "value", "Sets the time to 1000."],
                ["night", "value", "Sets the time to 13000."]
              ),
              new NumberOutput("value", "The time (in ticks) to set to.")
            ];
          }
          case "add": {
            return [new NumberOutput("value", "The time (in ticks) to add.")];
          }
          case "query": {
            return [new EnumOutput(
              ["day", "Type", "Get the current date/day. This is the number of in-game days that have passed."],
              ["daytime", "Type", "Get the current day time (in ticks)."],
              ["gametime", "Type", "Get the number of ticks that the world has been ticking."]
            )];
          }
        }
      }
    }
  }

}

module.exports = {
  "1.12": new TimeCommand12
};
