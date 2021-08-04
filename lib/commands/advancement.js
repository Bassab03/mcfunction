const BaseCommand = require("../class/BaseCommand"),
  EnumOutput = require("../class/output/EnumOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  AdvancementOutput = require("../class/output/AdvancementOutput"),
  StringOutput = require("../class/output/StringOutput");

/**
 * advancement <grant, revoke, test> <selector> <advancement> [string]
 */
class AdvancementCommand12 extends BaseCommand {

  constructor() {
    this.name = "advancement";
    this.description = "grants, revokes, and tests advancements for a target";
  }

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: { // command name
        return [
          new GenericOutput(
            ["advancement", null, "Grants, revokes, and tests advancements for a target."]
          )
        ];
      }
      case 2: { // mode
        return [
          new EnumOutput(
            ["grant", "Mode", "Grant an advancement."],
            ["revoke", "Mode", "Revoke an advancement."],
            ["test", "Mode", "Test an advancement."]
          )
        ];
      }
      case 3: { // target
        return [new SelectorOutput];
      }
      case 4: { // advancement
        return [new AdvancementOutput];
      }
      case 5: { // specific string
        return [new StringOutput("criterion", "The specific section of the advancement to grant")];
      }
    }
  }

}

module.exports = {
  "1.12": new AdvancementCommand12
};
