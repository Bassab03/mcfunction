const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  StringOutput = require("../class/output/StringOutput"),
  NBTOutput = require("../class/output/NBTOutput");
const SelectorOutput = require("../class/output/SelectorOutput");

class TitleCommand extends BaseCommand {
  
  constructor() {super("title");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("title", "Interact with titles and subtitles.")];
      }
      case 2: {
        return [new SelectorOutput("The targets to manage titles/subtitles on", "targets")];
      }
      case 3: {
        return [new EnumOutput(
          ["clear", "Clears titles for the targets.", "Sub Command"],
          ["reset", "Resets the subtitle text for the targets to blank text and default fade times.", "Sub Command"],
          ["times", "Modifies title timing.", "Sub Command"],
          ["title", "Modifies title text.", "Sub Command"],
          ["subtitle", "Modifies subtitle text.", "Sub Command"],
          ["actionbar", "Modifies actionbar text.", "Sub Command"]
        )];
      }
    }
    const subCommand = tokens[2].getValue();
    if (subCommand === "clear" || subCommand === "reset") {return;}
    if (["title", "subtitle", "actionbar"].includes(subCommand)) {
      if (tokens.length === 4) {
        return [new NBTOutput("title text", "The raw JSON text to display", `{"text":"my text"}`)];
      }
    } else if (subCommand === "times") {
      switch (tokens.length) {
        case 4: {
          return [new NumberOutput("fadeIn", "The time in ticks for the title to fade in.")];
        }
        case 5: {
          return [new NumberOutput("stay", "The time in ticks for the title to stay on the screen.", "100")];
        }
        case 6: {
          return [new NumberOutput("fadeOut", "The time in ticks for the title to fade out.")];
        }
      }
    }
  }

}

module.exports = {
  "1.12": new TitleCommand
};