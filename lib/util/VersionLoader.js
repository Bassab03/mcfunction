const VERSIONS = [
    "1.12", "1.13", "1.14", "1.15", "1.16", "1.17"
  ],
  IDS = [
    "advancement",
    "biomes",
    "block",
    "enchantment",
    "entity",
    "gamerule",
    "item",
    "loot_table",
    "particle",
    "recipe",
    "slot",
    "sound",
    "structures"
  ];

class VersionLoader {

  constructor() {
    this.ids = {};
    atom.config.observe("mcfunction-lang.version", this.updateIDs);
  }

  updateIDs(currentVersion) {
    if (currentVersion === "latest") {currentVersion = VERSIONS[VERSIONS.length - 1]}
    for (const version of VERSIONS) {
      for (const id of IDS) {
        this.ids[id] = this.ids[id] || new Set;
        const data = require(`../data/versions/${version}/${id}`),
          add = data.add || {},
          remove = data.remove || {};
        if (Array.isArray(add)) {
          for (const item of add) {this.ids[id].add(item);}
        } else {
          for (const key in add) {
            for (const item of add[key]) {this.ids[id].add(item);}
          }
        }
        if (Array.isArray(remove)) {
          for (const item of remove) {this.ids[id].delete(item);}
        } else {
          for (const key in remove) {
            for (const item of remove[key]) {this.ids[id].delete(item);}
          }
        }
      }
      if (currentVersion === version) {break;}
    }
  }
}

module.exports = new VersionLoader;
