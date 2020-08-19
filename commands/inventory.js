const userData = require('../userData.json')
const discord = require('discord.js')
const shopData = require('../shop.json')
const specialShopData = require('../specialShop.json')

function emoji(id, message) {
    return message.client.emojis.cache.find(x => x.id == id).toString()
}

module.exports = {
    name: 'inventory',
	description: 'Check your inventory!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['inv'],
    cooldown: 3,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        if (!mention) {
            var userInv = userData[message.author.id].inventory
            var keys = Object.keys(userInv)
            var embed = new discord.MessageEmbed()

            if (keys.toString() == "[]") {
                embed.setTitle("Your inventory").setDescription("You have nothing!").setColor("2f3237")
                message.channel.send(embed)
            } else {
                var itemString = ""
                for (var i = 0; i < keys.length; i++) {
                    if (!(parseInt(userInv[keys[i]].amount) < 1)) {
                        var usesDisplay =  "- " + userInv[keys[i]].uses + " use(s) for current item left."
                        var item = shopData[keys[i]]
                        if (!item) {
                            item = specialShopData[keys[i]]
                        }

                        if (!item.image) item.image = "?"

                        itemString += (item.image.length > 5? emoji(item.image, message):item.image) 
                            + " " + userInv[keys[i]].amount + " " + keys[i] + "(s) " + (userInv[keys[i]].uses == 1? "":usesDisplay) + "\n \n"
                    }
                }

                if (itemString == "") {
                    embed.setTitle("Your inventory").setDescription("You have nothing!").setColor("2f3237")
                    message.channel.send(embed)
                    return
                }
                embed.setTitle("Your inventory").setDescription(itemString).setColor("2f3237")
                message.channel.send(embed)
            }
        } else {
            if (!userData[mention.id]) {
                message.channel.send("That person doesn't have a bank account yet!")
                return false;
            }

            var userInv = userData[mention.id].inventory
            var keys = Object.keys(userInv)
            var embed = new discord.MessageEmbed()

            if (keys.toString() == "[]") {
                embed.setTitle(mention.tag + "'s inventory").setDescription("They have nothing!").setColor("2f3237")
                message.channel.send(embed)
            } else {
                var itemString = ""
                for (var i = 0; i < keys.length; i++) {
                    if (!(parseInt(userInv[keys[i]].amount) < 1)) {
                        var usesDisplay =  "- " + userInv[keys[i]].uses + " use(s) for current item left."
                        var item = shopData[keys[i]]
                        if (!item) {
                            item = specialShopData[keys[i]]
                        }

                        if (!item.image) item.image = "?"
                        
                        itemString += (item.image.length > 5? emoji(item.image, message):item.image) 
                            + " " + userInv[keys[i]].amount + " " + keys[i] + "(s) " + (userInv[keys[i]].uses == 1? "":usesDisplay) + "\n \n"
                    }
                }

                if (itemString == "") {
                    embed.setTitle(mention.tag + "'s inventory").setDescription("They have nothing!").setColor("2f3237")
                    message.channel.send(embed)
                    return
                }
                embed.setTitle(mention.tag + "'s inventory").setDescription(itemString).setColor("2f3237")
                message.channel.send(embed)
            }
        }
        
    }
}