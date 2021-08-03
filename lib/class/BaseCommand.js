/**
 * The base class of commands
 */
class BaseCommand {

  constructor(tokens) {
    this.tokens = tokens;
  }

  /**
   * handleSuggestions - executed in getSuggestions
   *
   * @param  {Object} options Atom's suggestion option object
   * @return {Output} the output/suggestions
   */
  handleSuggestions(options) {}

  /**
   * getActualCommandLine - Gets the command line, excluding previous execute statements
   *
   * @return {Token[]} The current command tokens
   */
  getActualCommandLine(line) {
    return false;
  }

  /**
   * isAfterExecuteCommand - Determines if the current command is after an execute command.
   *
   * @return {Boolean}
   */
  isAfterExecuteCommand() {
    return false;
  }

}

module.exports = BaseCommand;
