const provider = require("./provider.js");
module.exports = {

	config: {
		autocomplete: {
			title: "Enable Autocomplete",
			description: "Enable mcfunction's autocomplete+ manager",
			type: "boolean",
			default: true
		},
		showmc: {
			title: "Show \"minecraft:\"",
			description: "Toggle whether you want \"minecraft:\" to appear in the suggestions",
			type: "boolean",
			default: true
		}/*,
		version: {
			title: "Minecraft Version",
			description: "Specify a version for the autocomplete manager",
			type: "string",
			default: "latest",
			enum: ["latest","1.16","1.15","1.14","1.13","1.12 (and below)"]
		}*/
	},

	activate: () => {},

	getProvider: () => provider
}
