/* global atom */
const Output = require("../Output"),
  VersionLoader = require("../../util/VersionLoader");

class AdvancementOutput extends Output {
  constructor() {
    super({});
  }

  getOutput(lastToken) {
    const {advancement:advancements} = VersionLoader.ids,
      appendNamespace = atom.config.get("mcfunction-lang.showNamespace"),
      output = [],
      tokenValue = lastToken.getValue(),
      tokenSplit = tokenValue.split(/^minecraft:/),
      itemName = tokenSplit[0] === "" ? tokenSplit[1] : tokenSplit[0];
    for (const advancement of advancements) {
      if (appendNamespace) {
        if ("minecraft".startsWith(tokenValue)) {
          output.push({
            type: "advancement",
            text: `minecraft:${advancement}`,
            displayText: `minecraft:${advancement}`
          });
          continue;
        } else if (tokenValue.startsWith("minecraft:")) {
          if (advancement.startsWith(itemName)) {
            output.push(this.sanitize({
              type: "advancement",
              text: `${advancement}`,
              displayText: `${advancement}`
            }, itemName));
          }
          continue;
        }
      }
      if (advancement.startsWith(itemName)) {
        output.push(this.sanitize({
          type: "advancement",
          text: advancement,
          displayText: advancement
        }, itemName));
      }
    }
    return output;
  }
}

module.exports = AdvancementOutput;
