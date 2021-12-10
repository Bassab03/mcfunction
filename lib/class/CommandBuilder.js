const hasProperty = require("../util/hasProperty");
const Section = require("./options/Section");
const BaseOption = require("./BaseOption")

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

}