var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")
const quests = require("../quests.json")

module.exports = {
    name: 'quest',
	description: 'View your quests or start a quest.',
    args: false,
    usage: '[quest id]',
    guildOnly: false,
    aliases: ['adventure'],
    cooldown: 5,
    levelRequirement: 3,
    category: "economy",
    adminOnly: true, //change to false later
	execute(message, args, mention, specialArgs) {
        if (functions.isEmpty(userData[message.author.id].quest)) {
            const embed = new discord.MessageEmbed()
            embed.setTitle("Available Quests:")
            var pages = []
            const keys = Object.keys(quests)
            for (var i = 0; i < (keys.length / 3); i++) {
                try {
                    pages.push(keys.splice(0, 5))
                } catch {
                    //pass
                }
            }
    
            console.log("[SHARD/DEBUG] " + pages)
            var page = (args[0] == null? 0:parseInt(args[0]) - 1)
            var pageKeys = pages[page]
            
            for (i = 0; i < pageKeys.length; i++) {
                embed.addField(pageKeys[i], 
`**ID:** ${i}
**Profit:**
    **Cash:** $${quests[pageKeys[i]].minCash} - $${quests[pageKeys[i]].maxCash}
    **Gems:** ${quests[pageKeys[i]].minGems} 💎 - ${quests[pageKeys[i]].maxGems} 💎
    **Item(s):** ${quests[pageKeys[i]].itemList.join(", ")}
**Time:** ${quests[pageKeys[i]].timeH} hour(s)
**Survival Chance:** ${quests[pageKeys[i]].survivalChance}%
`
                )
            }
        }
    }
}