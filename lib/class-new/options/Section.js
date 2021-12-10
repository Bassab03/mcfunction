const hasProperty = require("../../util/hasProperty");
const BaseOption = require("../BaseOption");
const EnumOption = require("./EnumOption");
const NumberOption = require("./NumberOption");
const SubCommandSection = require("./SubCommandSection");

/**
 * @callback optionCallback
 * @param {BaseOption} option
 */
/**
 * @callback sectionGenerator
 * @returns {BaseOption}
 */

/**
 * Represents a section, which can contain options
 */
class Section extends BaseOption {

  /**
     * The named sections of this section
     * 
     * @type {Object.<string, Section>}
     */
  #namedSections = {}

  /**
   * The paths this section can take
   * Contains functions that will return the option
   * 
   * @type {sectionGenerator[]}
   */
  #path = []

  /**
   * Adds a sub command to this section's path.
   * 
   * @param {String} name The name of the sub command
   * @param {optionCallback} subCommandCallback The function to handle the sub command
   */
  addSubCommand(name, subCommandCallback) {
    const subCommand = new SubCommandSection(name);
    this.#addCallbackOptionToPath(subCommand, subCommandCallback)
    return this;
  }

  /**
   * Adds a number option to this section's path.
   * 
   * @param {String} label The label of the number option
   * @param {optionCallback} numberCallback The function to handle the number option
   */
  addNumberOption(label, numberCallback) {
    const numberOption = new NumberOption(label);
    this.#addCallbackOptionToPath(numberOption, numberCallback);
    return this;
  }

  /**
   * Adds an enum option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} enumCallback The function to handle the enum option
   */
  addEnumOption(label, enumCallback) {
    const enumOption = new EnumOption(label);
    this.#addCallbackOptionToPath(enumOption, enumCallback);
    return this;
  }

  /**
   * Adds a section to the path.
   * 
   * @param {String|optionCallback} section The saved section or a function that accepts a section
   * @throws {ReferenceError} Thrown if the section added does not exist.
   * @throws {TypeError} Thrown if the input is neither a string, nor a function.
   */
  addSectionOption(section) {
    if (typeof section === "string") {
      if (hasProperty(this.#namedSections, section)) {
        this.#addToPath(this.#namedSections[section]);
      } else {
        throw new ReferenceError(`Section '${section}' does not exist.`);
      }
    } else if (typeof section === "function") {
      const newSection = new Section();
      section(newSection);
      this.#addToPath(newSection);
    } else {
      throw new TypeError(`Provided input '${section}' is not a string or a function.`);
    }
    return this;
  }

  /**
   * Adds an option to this section's path and set a callback.
   * 
   * @param {BaseOption} option The option to add to the path
   * @param {optionCallback} callback The callback to run on the option
   */
  #addCallbackOptionToPath(option, callback) {
    option.setCallback(callback);
    this.#addToPath(option);
  }

  /**
   * Adds an option to this section's path.
   * 
   * @param {BaseOption} option The option to add to the path
   */
  #addToPath(option) {
    // The reason for this is to prevent infinite loops with recursive paths
    this.#path.push(() => {
      option.executeCallback();
      return option;
    });
  }

  /**
   * Creates a named section, which can be used later.
   * @see {Section#addSectionOption}
   * 
   * @param {String} sectionName The name of the section to be added.
   * @param {optionCallback} sectionCallback A function to handle the new section.
   * @throws {Error} Throw when the section already exists.
   */
  createNamedSection(sectionName, sectionCallback) {
    if (hasProperty(this.#namedSections, sectionName)) {
      const section = new Section();
      section.setCallback(sectionCallback);
      this.#namedSections[sectionName] = section;
    } else {
      throw new Error(`A section by the name '${sectionName}' already exists.`);
    }
    return this;
  }

  /**
   * Finishes the creation phase of the section and returns a generator function that outputs outputs.
   * 
   * @generator
   * @yields {BaseOption[]}
   * @returns {Generator<BaseOption[], any, BaseOption[]>}
   */
  *build() {
    const output = [];
    let index = 0;
    while (index < self.#path.length) {
      const option = self.#path[index]();
      // Check option for specific cases
      // In the case of a sub command, additional sub commands or options may be present
      if (option.isParallel()) {
        // TODO: handle a section as a parallel option...
        output.push(option);
        continue;
      }
      // If the option is a section, keep outputting all the section's options
      if (option instanceof Section) {
        const sectionGenerator = option.build();
        yield* sectionGenerator;
        continue;
      }
      output.push(option);
      yield output;
      // Done collecting output, clear the output list
      output.splice(0);
    }
  }

}

module.exports = Section;