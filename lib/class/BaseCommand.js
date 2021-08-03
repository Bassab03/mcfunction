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
  getActualCommandLine(tokens=this.tokens) {
    if (tokens.getValue() === "execute") {
      if (atom.config.get("mcfunction-lang.version") === "1.12") {
        if (tokens.length < 6) {
          return tokens;
        }
        if (tokens[5].getValue() === "detect") { e a x y z detect x y z foo bar
          if (tokens.length < 11) {
            return tokens;
          } else {
            return this.getActualCommandLine(tokens.slice(11));
          }
        } else {
          return this.getActualCommandLine(tokens.slice(5));
        }
      } else {
        let i = 1;
        while (tokens[i].getValue() !== "run" && i < tokens.length) {
          i++;
        }
        if (tokens[i]) {
          return this.getActualCommandLine(tokens.slice(i + 1));
        } else {
          return tokens;
        }
      }
    } else {
      return tokens;
    }
  }

  /**
   * isAfterExecuteCommand - Determines if the current command is after an execute command.
   *
   * @return {Boolean}
   */
  isAfterExecuteCommand() {
    return this.tokens[0].getValue() === "execute"
  }

}

module.exports = BaseCommand;
