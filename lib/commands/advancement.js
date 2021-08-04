const BaseCommand = require("../class/BaseCommand"),
  VersionLoader = require("../util/VersionLoader"),
  GenericOutput = require("../class/output/GenericOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

/**
 * advancement [grant, revoke, test] [selector] [advancement] [string]
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
            ["advancement", null, "grants, revokes, and tests advancements for a target"]
          )
        ];
      }
      case 2: { // mode
        return [
          new GenericOutput(
            ["grant", "Mode", "grant an advancement"],
            ["revoke", "Mode", "revoke an advancement"],
            ["tset", "Mode", "test an advancement"]
          )
        ];
      }
      case 3: { // target
        return [new SelectorOutput]
      }
    }
  }

}

module.exports = {
  "1.12": new AdvancementCommand12
};
