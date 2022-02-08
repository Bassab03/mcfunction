const { CommandBuilder } = require("../class/builders");

const dataCommandBuilder13 = new CommandBuilder("data")
  .setDescription("Interacts with NBT data.")
  .createNamedSection("TARGET", (section) => {
    section.addSubCommand("entity", "target type", (sub) => {
      sub.addSelectorOption(
        "target",
        (opt) => opt.setDescription("The entity whose NBT data will be interacted with")
      );
    })
      .addSubCommand("block", "target type", (sub) => {
        sub.addCoordinateOption("position", 3, (opt) => opt.setDescription(
          "The block position whose NBT data will be interacted with"
        ));
      });
  })
  .addSubCommand("get", "sub command", (sub) => {
    sub.setDescription("Gets NBT data.")
      .addSectionOption("TARGET")
      .addStringOption("path", (opt) => {
        opt.setOptional()
          .setSnippet("${1:an.example[0].\"path\"}")
          .setDisplayText("path")
          .setDescription("The NBT path to fetch data from");
      })
      .addNumberOption("scale", (opt) => {
        opt.setOptional()
          .setDefaultValue("1")
          .setDisplayText("scale")
          .setDescription("The multiplier to scale the returned number by");
      });
  })
  .addSubCommand("merge", "sub command", (sub) => {
    sub.setDescription("Merges NBT data.")
      .addSectionOption("TARGET")
      .addNBTOption("nbt", (opt) => {
        opt.setDisplayText("nbt")
          .setDescription("The NBT data to merge with the existing NBT data");
      });
  })
  .addSubCommand("remove", "sub command", (sub) => {
    sub.setDescription("Removes NBT data.")
      .addSectionOption("TARGET")
      .addStringOption("path", (opt) => {
        opt.setOptional()
          .setSnippet("${1:an.example[0].\"path\"}")
          .setDisplayText("path")
          .setDescription("The NBT path to fetch data from");
      });
  });

module.exports = {
  "1.13": {
    name: "data",
    builder: dataCommandBuilder13
  }
};