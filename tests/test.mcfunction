give @s[nbt={hi:"true",ok:true,nah:false,test:1},foo=] minecraft:acacia_boat{hi:"ok"} 1
give testing123s minecraft:diamond_sword 12
setblock ~ ~ ~ minecraft:diamond_block[state=false]{test:123s,ok:{yes:"true"},test:false}
scoreboard objectives add name minecraft.crafted:minecraft.minecraft:acacia_bark
bossbar set id visible true
data get block ~ ~ ~ path scale
data get entity @s path scale
data merge block ~ ~ ~ {}
data remove block ~ ~ ~ path
scoreboard objectives
advancement grant @s until minecraft:adventure/adventuring_time
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ filtered minecraft:acacia_bark force
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ masked force
locate 
