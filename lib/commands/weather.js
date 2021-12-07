const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  NumberOutput = require("../class/output/NumberOutput");

class WeatherCommand extends BaseCommand {
  constructor() {super("weather");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("weather", "Interacts and modifies the weather.")];
      }
      case 2: {
        return [new EnumOutput(
          ["clear", "Clear weather", "Type"],
          ["rain", "Light rain/snow weather", "Type"],
          ["thunder", "Heavy rain, with lightning", "Type"]
        )];
      }
      case 3: {
        return [(new NumberOutput("duration", "The time in ticks for the weather to be applied.", "12000")).optional()];
      }
    }
  }
}

module.exports = {
  "1.12": new WeatherCommand
}