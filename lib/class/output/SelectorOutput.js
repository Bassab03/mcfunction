const Output = require("../Output");

/**
 * A dynamic output object. Represents entity selectors:
 * @<parse>[thing=foo,etc=etc]
 */
class SelectorOutput extends Output {

  constructor() {
    this.setDescription("target entity");
    this.setRightLabel("selector");
  }

}
