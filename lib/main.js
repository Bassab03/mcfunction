const provider = require("./provider.js");
module.exports = {

	config: {
		autocomplete: {
			title: "Enable Autocomplete",
			description: "Enable mcfunction's autocomplete+ manager",
			type: "boolean",
			default: true
		}
	},

	activate: () => {},

	getProvider: () => provider
}
