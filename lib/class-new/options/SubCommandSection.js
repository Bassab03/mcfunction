const Section = require("./Section");

class SubCommandSection extends Section {

  /**
   * Constructs a SubCommandSection.
   * 
   * @param {String} name The name of the sub command
   * @throws {TypeError} Thrown when an invalid name is provided
   */
  constructor(name) {
    if (typeof name !== "string") {
      throw new TypeError("The name provided to the sub command is invalid.");
    }
    super(name);
    this.setParallel();
  }

}

module.exports = SubCommandSection;