advancement grant @s[a=b] everything
advancement grant @s from minecraft:adventure/adventuring_time
advancement grant @s only minecraft:adventure/adventuring_time
advancement revoke @p through minecraft:adventure/adventuring_time
advancement revoke @r until minecraft:adventure/adventuring_time
bossbar add id ""
bossbar get id
bossbar set id color blue
bossbar set id color green
bossbar set id name ""
bossbar set id players @s
bossbar set id style notched_20
bossbar set id value 10
bossbar list
bossbar remove id
bossbar add id {"name":true}
bossbar get id
bossbar remove id
clear @s minecraft:acacia_bark 64
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ filtered minecraft:diamond_block force
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ masked move
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ replace normal
data get block ~ ~ ~ path 1
data remove block ~ ~ ~ path
data get storage @s path 4
data merge block ~ ~ ~ {}
data modify entity @p targetPath append value value
data modify storage @s targetPath set from block ~ ~ ~ sourcePath
datapack enable name
datapack list
defaultgamemode creative
difficulty hard
effect clear @a minecraft:absorbtion
effect give @s minecraft:conduit_power 10 0 false
execute align xy rotated as @s in overworld positioned as @s anchored eyes facing entity @s eyes if entity @s if blocks ~ ~ ~ ~ ~ ~ ~ ~ ~ masked offset ~ ~ ~ store success block ~ ~ ~ path double 1 run experience query @s points
execute positioned ~ ~ ~ rotated ~ ~
experience add @s 1 points
