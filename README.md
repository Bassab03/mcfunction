# mcfunction-1.14 package

A syntax highlighter, auto-complete provider and snippet package for Minecraft 1.14 function files.

The autocomplete provider is *very* competent and almost has an identical feel to Minecraft's native tab completions.

#Info
This is a fork of https://github.com/MrYurihi/mcfunction.
I have no idea how he made this, but adding and removing entries in a JSON file,
I do know how to do, so I updated it to 1.14. All Credit goes to them.

#Changed :
##Added :
	data "modify ...."
	gamerule "disableRaids"
	scoreboard "get target objective"
	"minecraft:" prefix for NamespacedID
	execute if score target objective "matches range" run .....
##Removed
	gamerule "structureSaveLocation"
	gamerule "gameLoopFunction"

#IMO
This is the best available package on apm for datapacks in 1.14.
This is not the best available package on apm for datapacks in 1.13.
For 1.13 use : https://github.com/MrYurihi/mcfunction.
