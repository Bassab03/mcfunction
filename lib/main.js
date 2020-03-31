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
		}
	},

	activate: () => {},

	getProvider: () => provider
}
