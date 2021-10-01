const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  BooleanOutput = require("../class/output/BooleanOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  EffectOutput = require("../class/output/EffectOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  StringOutput = require("../class/output/StringOutput");

class EffectCommand12 extends BaseCommand {
  constructor() {
    super("effect");
  }

  handleSuggestions(tokens) {
    if (tokens.length >= 4) {
      const notEffect = tokens[2].getValue() !== "effect";
      if (notEffect) {
        return [];
      }
    }
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("effect", "Gives potion effects to entities.")];
      }
      case 2: {
        return [new SelectorOutput(null, "targets")];
      }
      case 3: {
        return [
          new StringOutput("clear", "Clears all effects from the target player."),
          new EffectOutput(null, "effect")
        ];
      }
      case 4: {
        return [(new NumberOutput("seconds", "How long the effect should be applied for", "10")).optional()];
      }
      case 5: {
        return [(new NumberOutput("amplifier", "The power level of the potion effect", "0")).optional()];
      }
      case 6: {
        return [(new BooleanOutput("hideParticles", "Whether to hide particles from the effect. By default, particles are shown.")).optional()];
      }
    }
  }
}

module.exports = {
  "1.12": new EffectCommand12
};
