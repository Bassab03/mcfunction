const BaseOption = require("../BaseOption");

/**
 * Represents an 'enum' option, an option which is a list of strings.
 */
class EnumOption extends BaseOption {

  /**
   * The choices in the enum
   * 
   * @type {{value: String, description: String}[]}
   */
  choices = [];

  /**
   * Adds a choice to this enum option.
   * 
   * @param {String} value The value of the choice
   * @param {String} description The description of the choice
   */
  addChoice(value, description) {
    this.choices.push({
      value,
      description
    });
  }

  tokenIsApplicable(token) {
    return this.choices.includes(token);
  }

  isValid(token) {
    for (const { value } of this.choices) {
      if (token === value) {
        return 1;
      }
    }
    return 0;
  }

  reformatOutput() {
    const result = [];
    for (const choice of this.choices) {
      const output = super.reformatOutput();
      Object.assign(output, {
        text: choice.value,
        description: choice.description
      });
      result.push(output);
    }
    return result;
  }

}

module.exports = EnumOption;