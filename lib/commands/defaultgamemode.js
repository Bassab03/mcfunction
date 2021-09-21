const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput");

/**
 * defaultgamemode <mode>
 */
class DefaultGameModeCommand12 extends BaseCommand {
  constructor() {
    super("defaultgamemode");
  }

  handleSuggestions(tokens) {
    switch(tokens.length) {
      case 1: {
        return [new CommandNameOutput("defaultgamemode", "Sets the default game mode.")];
      }
      case 2: {
        return [
          new EnumOutput(
            ["creative", "game mode", "Flight, building, and invulnerability"],
            ["survival", "game mode", "Resource gathering, crafting, mining, and survival"],
            ["spectator", "game mode", "Flight, noclip, viewing"],
            ["adventure", "game mode", "Survival, no griefing"]
          )
        ];
      }
    }
  }
}

module.exports = {
  "1.12": DefaultGameModeCommand12
};
