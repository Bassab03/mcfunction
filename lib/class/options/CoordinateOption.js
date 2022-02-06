const range = require("../../util/range"),
  BaseOption = require("../BaseOption");

/**
 * Represents a coordinate option.
 * 
 * @param {String} label The label for this option
 * @param {Number} amount The number to repeat the output by
 */
class CoordinateOption extends BaseOption {

  /**
   * The number to repeat the output by
   * 
   * @type {Number}
   */
  repeats = 1;

  /**
   * The string to repeat
   * 
   * @type {String}
   */
  defaultString = "~";

  constructor(label, amount) {
    super(label);
    this.repeats = amount;
  }

  tokenIsApplicable(token) {
    return this.isValid(token);
  }

  isValid(token) {
    return /^([~^](-?(\d*\.)?\d+)?)|(-?(\d*\.)?\d+)$/.test(token);
  }

  setDefaultValue(value) {
    this.defaultString = value;
    return this;
  }

  reformatOutput(token) {
    const output = super.reformatOutput(token);
    if (token === "") {
      let str = "";
      for (const i of range(this.repeats)) {
        str += `\${${i + 1}:${this.defaultString}} `;
      }
      Object.assign(output, {
        snippet: str.trim()
      });
    } else {
      Object.assign(output, {
        snippet: "$1"
      });
    }
    return output;
  }

}

module.exports = CoordinateOption;