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
    this.setDisplayText(name);
    this.setText(name);
    this.setParallel();
  }

  isValid(token) {
    return token === this.label ? 1 : 0;
  }

  /**
   * Builds the command, returns a generator
   * 
   * @generator
   * @yields {BaseOption[]}
   * @returns {Generator<BaseOption[], any, BaseOption[]>}
   */
  *build() {
    yield [this];
    yield* super.build();
  }

}

module.exports = SubCommandSection;