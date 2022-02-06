const hasProperty = require("../util/hasProperty");
const Section = require("./options/Section");
const BaseOption = require("./BaseOption");

/**
 * @typedef {{
 *   text: String?,
 *   snippet: String?,
 *   displayText: String?,
 *   replacementPrefix: String?,
 *   type: String?,
 *   leftLabel: String?,
 *   leftLabelHTML: String?,
 *   rightLabel: String?,
 *   rightLabelHTML: String?,
 *   className: String?,
 *   iconHTML: String?,
 *   description: String?,
 *   descriptionMoreURL: String?,
 *   characterMatchIndices: Number[]?
 * }} providerOutput
 */

/**
 * Represents a builder to build commands.
 */
class CommandBuilder extends Section {

  /**
   * The names of the command
   * 
   * @type {String[]}
   */
  #names

  /**
   * Constructs a CommandBuilder.
   * 
   * @param {String} name The name of the command 
   */
  constructor(name) {
    super();
    this.#names = [name];
  }

  /**
   * Adds an alias command name to the command.
   * 
   * @param {String} alias The additional name of the command
   */
  addAlias(alias) {
    this.names.push(alias);
    return this;
  }

  /**
   * Builds the command, returns a generator
   * 
   * @generator
   * @yields {BaseOption[]}
   * @returns {Generator<BaseOption[], any, BaseOption[]>}
   */
  *build() {
    yield this;
    yield* super.build();
  }

  /**
   * @returns {providerOutput|providerOutput[]}
   */
  reformatOutput() {
    if (this.#names.length === 1) {
      return this._refOutput(this.#names[0]);
    } else {
      const output = [];
      for (const name of this.#names) {
        output.push(this._refOutput(name));
      }
      return output;
    }
  }

  _refOutput(name) {
    return {
      text: name,
      description: this.description
    };
  }

}

module.exports = CommandBuilder;