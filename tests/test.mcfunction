give @s[nbt={hi:"true",ok:true,nah:false,test:1},foo=] minecraft:acacia_boat{hi:"ok"} 1
give testing123s minecraft:diamond_sword 0
setblock ~ ~ ~ minecraft:diamond_block[state=false]{test:123s,ok:{yes:"true"},test:false}
scoreboard objectives add name minecraft.crafted:minecraft.minecraft:acacia_bark
bossbar set id visible true
data get block ~ ~ ~ path scale
data get entity @s path scale
datapack list available
datapack enable info before datapack:etc
data merge block ~ ~ ~ {but:5s}
data remove block ~ ~ ~ path
scoreboard objectives
advancement grant @s until minecraft:adventure/adventuring_time
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ filtered minecraft:acacia_bark force
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ masked force
locate EndCity
me sdfjsadfjsajfjasljf
# yes, i know this isn't a real recipe, but i'm too lazy too look up all the recipes
recipe give @s minecraft:zombie_head
spawnpoint @s ~ ~ ~
setworldspawn
spreadplayers ~ ~ 1 maxRange
spreadplayers ~ ~ 1 1 true @s
worldborder center ~ ~
worldborder add 1 1
stopsound @s ambient
summon minecraft:armor_stand ~ ~ ~
time query day
title @s title {what:"is_this"}
w
weather
worldborder
tell
tellraw @s {hi:true}
trigger
xp add @s 1 points
loot give @s mine ~ ~ ~ <item>
loot spawn ~ ~ ~ fish minecraft:empty
loot spawn ~ ~ ~ fish minecraft:entity/minecraft:enderman
loot spawn ~ ~ ~ loot minecraft:blocks/minecraft:banner
loot give @s kill @s
loot give @s mine ~ ~ ~ <item>
tp @e[test=ya] ~ ~ ~ facing entity @s feet
tp @s ~ ~ ~ ~ ~
tp ~ ~ ~ ~ ~
spectate @s @s
schedule clear function
schedule function function time append
execute if score @s targetObjective matches ..1
give @s minecraft:diamond_axe
locatebiome minecraft:river
execute align x align xz offset ~ ~ ~ in overworld run
particle minecraft:block minecraft:minecraft:diamond_block ~ ~ ~ ~ ~ ~ 1 30 normal
advancement grant @s from minecraft:adventure/adventuring_time
scoreboard objectives add test minecraft.dropped:minecraft.minecraft:diamond_block
playsound minecraft:ambient.underwater.exit ambient @s ~ ~ ~ volume pitch minVolume
