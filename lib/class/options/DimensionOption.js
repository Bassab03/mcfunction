/* global atom */
const BaseOption = require("../BaseOption"),
  VersionLoader = require("../../util/VersionLoader");

/**
 * Represents a dimension option.
 */
class DimensionOption extends BaseOption {

  reformatOutput(lastToken) {
    const DIMENSIONS = ["overworld", "the_end", "the_nether"],
      appendNamespace = atom.config.get("mcfunction-lang.showNamespace"),
      tokenSplit = lastToken.split(/^minecraft:/),
      dimensionName = tokenSplit[0] === "" ? tokenSplit[1] : tokenSplit[0],
      result = [];
    for (const dimension of DIMENSIONS) {
      const output = super.reformatOutput();
      if (appendNamespace && "minecraft".startsWith(lastToken)) {
        Object.assign(output, {
          text: `minecraft:${dimension}`
        });
      } else if (dimension.startsWith(dimensionName) || lastToken === "") {
        Object.assign(output, {
          text: dimension
        });
      } else {
        continue;
      }
      result.push(output);
    }
    return result;
  }

}

module.exports = DimensionOption;