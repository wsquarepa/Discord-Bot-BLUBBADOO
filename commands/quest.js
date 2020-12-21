var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")
const quests = require("../quests.json")
const shopData = require("../shop.json")

module.exports = {
    name: 'quest',
	description: 'View your quests or start a quest.',
    args: false,
    usage: '[quest name]',
    guildOnly: false,
    aliases: ['adventure'],
    cooldown: 5,
    levelRequirement: 3,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        const keys = Object.keys(quests)
        if (functions.isEmpty(userData[message.author.id].quest) && (!args.length || !isNaN(parseInt(args[0])))) {
            const embed = new discord.MessageEmbed()
            embed.setTitle("Available Quests:")
            var pages = []            
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
**Cash:** $${quests[pageKeys[i]].minCash} - $${quests[pageKeys[i]].maxCash}
**Gems:** ${quests[pageKeys[i]].minGems} 💎 - ${quests[pageKeys[i]].maxGems} 💎
**Item(s):** ${quests[pageKeys[i]].itemList.join(", ")}
**Time:** ${quests[pageKeys[i]].timeH} hour(s)
`
                , true)
            }
            embed.setColor(functions.globalEmbedColor)
            embed.setFooter("Page " + (page + 1) + " of " + pages.length)
            message.channel.send(embed)
        } else if (userData[message.author.id].quest.cooldown) {
            const embed = new discord.MessageEmbed()
            const now = Date.now()
            const timeLeft = new Date(userData[message.author.id].quest.cooldown - now)
            embed.setTitle("Uh Oh!")
            embed.setDescription("You cannot do any quests as you are on cooldown! \n" + 
            "You have to wait " + timeLeft.getHours() + " hours and " + timeLeft.getMinutes() + " minutes before doing another quest!")
            embed.setColor(functions.globalEmbedColor)
            message.channel.send(embed)
        } else if (functions.isEmpty(userData[message.author.id].quest)) {
            if (!quests[args.join(" ")]) {
                message.channel.send("Whoops! That quest doesn't exist, my friend!")
                return
            }

            message.channel.send("Are you 100% sure you want to start the quest? When you start a quest, you **CANNOT** execute any commands except for this one, " +
            "as well you may die and lose most of your health. Also, you must do `quest collect` to collect your reward within an hour of finishing. Otherwise, " + 
            "you **will not** automatically collct your reward. Also, you can end your quest at any time by saying `quest end`. " + 
            "Say **yes** to confirm that you would like to start the quest.")
            const collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {time: 10000, max: 1})
            collector.on('end', (msgs) => {
                if (msgs.size < 1) {
                    message.channel.send("I guess not then... ok.")
                    return;
                }
                const msg = msgs.first()
                if (msg.content.toLowerCase() == "yes") {
                    userData[message.author.id].quest = {
                        expiryTime: (Date.now() + (1000 * 60 * 60 * quests[args.join(" ")].timeH)),
                        id: keys.indexOf(args.join(" "))
                    }
                    message.channel.send("Quest started! Check back in " + quests[args.join(" ")].timeH + " hours to collect your prize!")
                } else {
                    message.channel.send("Oh. Ok. Maybe another time then.")
                }
            })
        } else if (args[0] == "collect") {
            if (Date.now() > userData[message.author.id].quest.expiryTime) {
                if ((Date.now() - userData[message.author.id].quest.expiryTime) > 1000 * 60 * 60) {
                    const overTime = new Date((Date.now() - userData[message.author.id].quest.expiryTime) - 1000 * 60 * 60)
                    message.channel.send("Uh oh, you collected your quest " + overTime.getHours() + " hour(s) and " + overTime.getMinutes() + " minute(s) late! That means" + 
                    " you get nothing! Oops!")
                    userData[message.author.id].quest = {
                        cooldown: 1000 * 60 * 60 * 24
                    }
                    return;
                }

                const questData = quests[keys[userData[message.author.id].quest.id]]
                for (var i = 0; i < questData.itemList.length; i++) {
                    const itemName = questData.itemList[i]
                    if (userData[message.author.id].inventory[itemName]) {
                        userData[message.author.id].inventory[itemName].amount += 1
                    } else {
                        userData[message.author.id].inventory[itemName] = {
                            amount: 1,
                            uses: shopData[itemName].uses
                        }
                    }
                }

                const cashEarnings = functions.randomNumber(questData.minCash, questData.maxCash)
                const gemEarnings = functions.randomNumber(questData.minGems, questData.maxGems)

                userData[message.author.id].cash += cashEarnings
                userData[message.author.id].gems += gemEarnings
                
                const embed = new discord.MessageEmbed()
                embed.setTitle("Successfull quest!")
                embed.setDescription("**Earnings:** \n **Cash:** $" + cashEarnings + "\n **Gems:** " + gemEarnings + " 💎 \n **Item(s):** " + questData.itemList.join(", "))
                embed.setColor(functions.globalEmbedColor)
                embed.setFooter("You cannot do any quests again for 1 day.")
                message.channel.send(embed)

                userData[message.author.id].quest = {
                    cooldown: 1000 * 60 * 60 * 24
                }
            } else {
                message.channel.send("You're still on the quest.")
            }
        } else if (args[0] == "end") {
            message.channel.send("Are you sure you want to end your quest? You will forfiet all your earnings and will have a 1 day cooldown before starting another quest.")
            const collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {time: 10000, max: 1})
            collector.on('end', (msgs) => {
                if (msgs.size < 1) {
                    message.channel.send("I guess not then... ok.")
                    return;
                }
                const msg = msgs.first()
                if (msg.content.toLowerCase() == "yes") {
                    userData[message.author.id].quest = {
                        cooldown: Date.now() + 1000 * 60 * 60
                    }
                    message.channel.send("Quest ended! Wait 1 hour before *questing* again!")
                } else {
                    message.channel.send("Okay.")
                }
            })
        } else {
            const timeLeft = new Date(userData[message.author.id].quest.expiryTime - Date.now())
            const embed = new discord.MessageEmbed()
            embed.setTitle("Your Quest:")
            embed.setDescription(
`**ID:** ${userData[message.author.id].quest.id}
**Cash:** $${quests[keys[userData[message.author.id].quest.id]].minCash} - $${quests[keys[userData[message.author.id].quest.id]].maxCash}
**Gems:** ${quests[keys[userData[message.author.id].quest.id]].minGems} 💎 - ${quests[keys[userData[message.author.id].quest.id]].maxGems} 💎
**Item(s):** ${quests[keys[userData[message.author.id].quest.id]].itemList.join(", ")}
**Time:** ${timeLeft.getHours()} hour(s) and ${timeLeft.getMinutes()} minute(s) remaining.`
            )
            embed.setColor(functions.globalEmbedColor)
            message.channel.send(embed)
        }
        functions.save("./userData.json", userData)
    }
}