const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  BooleanOutput = require("../class/output/BooleanOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  StringOutput = require("../class/output/StringOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  ScoreboardDisplayOutput = require("../class/output/ScoreboardDisplayOutput"),
  ObjectiveOutput = require("../class/output/ObjectiveOutput");

class ScoreboardCommand12 extends BaseCommand {
  constructor() {super("scoreboard");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("scoreboard", "Interacts with scoreboards and related data.")];
      }
      case 2: {
        return [new EnumOutput(
          ["objectives", "Sub Command", "Add, remove, and edit scoreboard objectives."],
          ["players", "Sub Command", "Add, remove, and modify the objective scores of players."],
          ["teams", "Sub Command", "Add, remove, and edit teams."]
        )];
      }
    }
    const subCommand = tokens[1].getValue();
    switch (subCommand) {
      case "objectives": {
        if (tokens.length === 3) {
          return [new EnumOutput(
            ["list", "Objectives Sub Command", "List all objectives."],
            ["add", "Objectives Sub Command", "Add a new objective."],
            ["remove", "Objectives Sub Command", "Remove an objective."],
            ["setdisplay", "Objectives Sub Command", "Set where the objective stats display."]
          )];
        } else {
          const subValue = tokens[2].getValue();
          if (
            (tokens.length >= 4 && subValue === "list") ||
            (tokens.length >= 5 && subValue === "remove") ||
            (tokens.length >= 6 && subValue === "setdisplay")
          ) {
            return;
          }
          switch (tokens.length) {
            case 3: {
              return [new EnumOutput(
                ["list", "Objectives Sub Command", "List all existing objectives."],
                ["add", "Objectives Sub Command", "Create new objectives."],
                ["remove", "Objectives Sub Command", "Remove objectives."],
                ["setdisplay", "Objectives Sub Command", "Set where the objective's scores are displayed."]
              )];
            }
            case 4: {
              if (subValue === "setdisplay") {
                return [new ScoreboardDisplayOutput];
              } else {
                return [new StringOutput("${1:name}", "The name of the objective.", true, "name")];
              }
            }
            case 5: {
              if (subValue === "setdisplay") {
                return [new StringOutput("${1:objective}", "The objective to modify.", true, "objective")];
              } else {
                return [new ObjectiveOutput]
              }
            }
            default: {
              return [new StringOutput(tokens[tokens.length - 1].getValue() || " ", null, false, "display name")];
            }
          }
        }
      }
      case "players": {

      }
      case "teams": {

      }
    }
  }
}

module.exports = {
  "1.12": new ScoreboardCommand12
};
