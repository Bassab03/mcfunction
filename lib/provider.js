const res = require("./res");
const fs = require("fs");

module.exports = {

	selector: ".source.mcfunction",
	disableForSelector: ".source.mcfunction .comment",

	inclusionPriority: 1,

	suggestionPriority: 2,

	getCurrentCommand: function (editor, bufferPosition) {
		var text = editor.getTextInBufferRange([[bufferPosition.row, 0], bufferPosition]);
		var matches = text.match(/^\w+/g);
		if(matches == null) return null;
		var cmd = matches[0];
		return cmd;
	},

	getCommandStop: function (text, command) {

		if(command == null) return null;

		//replace all non arg seperating spaces with an _

		var block = [];

		var aux = "";
		for(var c of text) {
			if(c == "{") {
				block.push("}");
				aux += c;
			} else if(c == "[") {
				block.push("]");
				aux += c;
			} else if(c == "\"" && block[block.length - 1] != "\"") {
				block.push("\"");
				aux += c;
			} else if(c == block[block.length - 1]) {
				block.pop();
				aux += c;
			} else if(c == " " && block.length > 0) aux += "_";
			else aux += c;
		}

		var args = aux.split(" ").slice(1, -1);
		if(command["alias"] != null) return this.runCycle(args, res.commands["commands"][command["alias"]]["cycleMarkers"])["cycle"]
		var cycle = command["cycleMarkers"];
		return this.runCycle(args, cycle)["cycle"];
	},

	runCycle: function(args, cycle) {
		var i = 0;
		var c = 0;
		var realLastStop = null;
		for(; i < args.length; ) {
			var arg = args[i];
			var stop = cycle[c];

			var realStop = stop;
			if (stop["include"] != null) {
				realStop = res.commands["reference"][stop["include"]];
			}
			if(realStop["type"] == "option" && (realStop["anyValue"] == null || ! realStop["anyValue"])) {
				if(! realStop["value"].includes(arg)) {
					return {
						pos: cycle.length + 1,
						argPos: args.length + 1,
						cycle: {
							type: "end"
						}
					}
				}
			}
			if (realStop["type"] == "option" && realStop["change"] != null && realStop["change"][arg] != null) {
				var cycleRun = this.runCycle(args.slice(i + 1), realStop["change"][arg]);
				i += cycleRun["argPos"] + 1;
				c += 1;
				if(cycleRun["cycle"] != null) return {
					pos: c,
					argPos: i,
					cycle: cycleRun["cycle"]
				}
			} else if(realStop["type"] == "coord") {
				i += 3;
				c += 1;
				if(args.length < i) return {
					pos: c,
					argPos: i,
					cycle: realStop
				}
			} else if(realStop["type"] == "center" || realStop["type"] == "rotation") {
				i += 2;
				c += 1;
				if(args.length < i) return {
					pos: c,
					argPos: i,
					cycle: realStop
				}
			} else if (realStop["type"] == "end") {
				return {
					pos: c,
					argPos: i,
					cycle: cycle[c]
				}
			} else if(realStop["type"] == "command") {
				var cmd = args[i];
				var newCycle = res.commands["commands"][cmd];
				return {
					pos: cycle.length + 1,
					argPos: args.length + 1,
					cycle: this.getCommandStop(args.slice(i).join(" ") + " !", newCycle)
				}
			} else if(realStop["type"] == "greedy") {
				return {
					pos: cycle.length + 1,
					argPos: args.length + 1,
					cycle: realStop
				}
			} else {
				i++;
				c++;
			}

			if(c >= cycle.length) return {
				pos: c,
				argPos: i,
				cycle: null
			}
			realLastStop = realStop;
		}

		if(cycle[0] != null) {
			var stop = cycle[c];

			var realStop = stop;
			if (stop["include"] != null) {
				realStop = res.commands["reference"][stop["include"]];
			}
			return {
				pos: c,
				argPos: i,
				cycle: realStop
			}
		}
		return {
			pos: c,
			argPos: i,
			cycle: null
		}
	},

	getSuggestions: function (args) {
		if(! atom.config.get("mcfunction-support.autocomplete")) return;

		var current = this.getCurrentCommand(args.editor, args.bufferPosition);
		var lineText = args.editor.getTextInBufferRange([[args.bufferPosition.row, 0], args.bufferPosition]);

		if(! lineText.includes(" ")) { return this.getCommandOption(lineText); }
		if(current == null) { return []; }

		var out = [];
		var splitText = lineText.split(" ");
		var lastText = splitText[splitText.length - 1];

		if(res.commands["commands"][current] == null) return null;
		var stop = this.getCommandStop(lineText, res.commands["commands"][current]);
		if(stop == null) return [];

		let type = stop["type"]
		switch (type) {
			case "command":

				out = this.getCommandOption(lastText);
				break;

			case "option" :
				for(var opt of stop["value"]) {
					if(opt.startsWith(lastText)) out.push({
						text: opt,
						type: "option",
						iconHTML: "<i class=\"icon option\">?</i>"
					});
				}
				break;

			case "effect" :
			case "advancement" :
				for(var id of res.id[type]) {

					if(id.startsWith(lastText)) {
						out.push({
							text: id,
							type: type,
							iconHTML: "<i class=\"icon " + type + "\">e</i>"
						});
					}
				}
				break;


			case "entity-id" :
				for(var ent of res.id.entity) {
					if(ent.startsWith(lastText)) {
						out.push({
							text: ent,
							type: "entity-id",
							iconHTML: "<i class=\"icon entity\">a</i>"
						});
					}
				}
				break;

			case "item" :
			case "block" :
			case "recipe" :
			case "enchantment" :
				for(var item of res.id[type]) {
					if(item.startsWith(lastText)) {
						 out.push({
							text: item,
							type: type,
							iconHTML: "<i class=\"icon "+type+"\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/"+type+".svg\"></i>"
						});
					}
				}
				break;

			case "inventory-slot" :
			case "objective-slot" :
				console.log(type);
				for(var slot of res.id.slot[type.substring(0, type.length - 5)]) {
					if(slot.startsWith(lastText)) {
						out.push({
							text: slot,
							type: "slot",
							iconHTML: "<i class=\"icon slot\">s</i>"
						});
					}
				}
				break;
			case "coord" :
			case "center" :
			case "rotation" :

				out.push({
					text: "0",
					displayText: stop["value"],
					type: "coord",
					iconHTML: "<i class=\"icon coord\">~</i>"
				});
				break;

			case "nbt" :
				out.push({
					snippet: "{$1}",
					displayText: stop["value"],
					type: "nbt",
					iconHTML: "<i class=\"icon nbt\">{}</i>"
				});
				break;

			case "id" :
			case "entity" :
			case "string" :
			case "function" :
				out.push({
					snippet: "${1:" + stop["value"] + "}",
					displayText: stop["value"],
					type: type,
					iconHTML: "<i class=\"icon " + type + "\"> " + type.substring(0, 1) + "</i>"
				});
				break;
			case "greedy" :
				out.push({
					text: "\n",
					displayText: stop["value"],
					replacementPrefix: "",
					type: "string",
					iconHTML: "<i class=\"icon string\">s</i>"
				});
				break;

		}
		return out;
	},

	getCommandOption: function(text) {
		var out = [];
		for(var cmd of Object.values(res.commands["commands"])) {
			if(cmd["name"].startsWith(text)) {
				var cmdObj = {
					text: cmd["name"],
					type: "command",
					iconHTML: "<i class=\"icon command\">/</i>",
					command: cmd
				};
				out.push(cmdObj);
			}
		}
		return out;
	}
}
