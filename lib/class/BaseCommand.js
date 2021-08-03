const Token = require("./Token");

/**
 * The base class of commands
 */
class BaseCommand {

  /**
   * handleSuggestions - executed in getSuggestions
   *
   * @param  {Object} options Atom's suggestion option object
   * @return {Output} the output/suggestions
   */
  handleSuggestions(options) {}

  /**
   * parseLine - Parses a line and returns a list of tokens
   *
   * @param  {String} line   The line text
   * @return {Token[]} The tokens
   */
  parseLine(line) {
    return line.split(" ").map(word => new Token(word));
  }

  /**
   * isAfterExecuteCommand - Determines if the current command is after an execute command.
   *
   * @param  {String} line The line text
   * @return {Boolean}
   */
  isAfterExecuteCommand(line) {
    const parsedLine = this.parseLine(line);
    return parsedLine[0].getValue() === "execute" && parsedLine.find(token => token.getValue() === "run");
  }

}

module.exports = BaseCommand;
