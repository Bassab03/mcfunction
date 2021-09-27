/* global atom */
const Output = require("../Output"),
  VersionLoader = require("../../util/VersionLoader");

class RecipeOutput extends Output {
  constructor() {
    super({});
  }

  getOutput(lastToken) {
    const {recipe:recipes} = VersionLoader.ids,
      appendNamespace = atom.config.get("mcfunction-lang.showNamespace"),
      output = [],
      tokenValue = lastToken.getValue(),
      tokenSplit = tokenValue.split(/^minecraft:/),
      recipeName = tokenSplit[0] === "" ? tokenSplit[1] : tokenSplit[0];
    for (const recipe of recipes) {
      if (appendNamespace) {
        if ("minecraft".startsWith(tokenValue)) {
          output.push({
            type: "recipe",
            text: `minecraft:${recipe}`,
            displayText: `minecraft:${recipe}`
          });
          continue;
        } else if (tokenValue.startsWith("minecraft:")) {
          if (recipe.startsWith(recipeName)) {
            output.push(this.sanitize({
              type: "recipe",
              text: `${recipe}`,
              displayText: `${recipe}`
            }, recipeName));
          }
          continue;
        }
      }
      if (recipe.startsWith(recipeName)) {
        output.push(this.sanitize({
          type: "recipe",
          text: recipe,
          displayText: recipe
        }, recipeName));
      }
    }
    return output;
  }
}

module.exports = RecipeOutput;