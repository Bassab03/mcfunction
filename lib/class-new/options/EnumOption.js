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
  #choices = [];

  /**
   * Adds a choice to this enum option.
   * 
   * @param {String} value The value of the choice
   * @param {String} description The description of the choice
   */
  addChoice(value, description) {
    this.#choices.push({
      value,
      description
    });
  }

  isValid(token) {
    for (const { value } of this.#choices) {
      if (token === value) {
        return 1;
      }
    }
    return 0;
  }

}

module.exports = EnumOption;