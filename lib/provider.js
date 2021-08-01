class Provider {

  constructor() {
    this.selector = ".source.mcfunction-lang";
    this.disableForSelector = ".source.mcfunction-lang .comment";
    this.inclusionPriority = 1;
    this.suggestionPriority = 2;
  }

  getSuggestions() {}
}

module.exports = Provider;
