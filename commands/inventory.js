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
    usage: '[@mention] [page]',
    guildOnly: false,
    aliases: ['inv'],
    cooldown: 3,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        if (!mention) {
            var userInv = {}
            Object.assign(userInv, userData[message.author.id].inventory)
            var keys = Object.keys(userInv)

            var keysToDelete = []
            for (var i = 0; i < keys.length; i++) {
                if (userInv[keys[i]].amount < 1) {
                    keysToDelete.push(keys[i])
                }
            }

            for (i = 0; i < keysToDelete.length; i++) {
                delete userInv[keysToDelete[i]]
                keys.splice(keys.indexOf(keysToDelete[i], 1))
            }

            const pageNumber = ((parseInt(args[0]) - 1) || 0)
            var pages = []

            for (var i = 0; i < (keys.length / 5); i++) {
                try {
                    pages.push(keys.splice(0, 5))
                } catch {
                    //pass
                }
            }
            
            console.log(pages)

            const page = pages[pageNumber]
            console.log(page)

            
            if (!page && pageNumber != 0) {
                message.channel.send("Not a valid page!")
                return
            }

            const embed = new discord.MessageEmbed()
            embed.setTitle("Your inventory:")
            
            if (!page && pageNumber == 0) {
                embed.setDescription("You have nothing!")
                message.channel.send(embed)
                return
            }

            for (i = 0; i < page.length; i++) {
                var item = shopData[page[i]]
                if (!item) {
                    item = specialShopData[page[i]]
                }

                if (!item) {
                    item = {
                        image: "?"
                    }
                }
                
                var usesDisplay = "Uses: " + userInv[page[i]].uses + " left."
                embed.addField((item.image.length > 5 ? emoji(item.image, message) : item.image) + page[i], 
                `Amount: ${userInv[page[i]].amount}
                ${(userInv[page[i]].uses == 1 ? "" : usesDisplay)}
                `)
            }
            embed.setColor("2f3237")
            embed.setFooter("Inventory page #" + (pageNumber + 1) + " out of " + pages.length + " pages.")
            message.channel.send(embed)
        } else {
            if (!userData[mention.id]) {
                message.channel.send("That person doesn't have a bank account yet!")
                return false;
            }

            var userInv = userData[mention.id].inventory
            var pages = []
            var keys = Object.keys(userInv)
            var keysLength = keys.length
            for (var i = 0; i < (keysLength / 5); i++) {
                try {
                    pages.push(keys.splice(0, 5))
                } catch {
                    //pass
                }
            }

            console.log(pages)

            var page = (args[1] == null ? 0 : parseInt(args[1]) - 1)
            console.log(page)
            keys = pages[page]
            if (!keys) {
                message.channel.send("That page doesn't exist.")
                return false
            }

            var embed = new discord.MessageEmbed()

            if (keys.toString() == "[]") {
                embed.setTitle(mention.tag + "'s inventory").setDescription("They have nothing!").setColor("2f3237")
                message.channel.send(embed)
            } else {
                var itemString = ""
                for (var i = 0; i < keys.length; i++) {
                    if (!(parseInt(userInv[keys[i]].amount) < 1)) {
                        var usesDisplay = "- " + userInv[keys[i]].uses + " use(s) for current item left."
                        var item = shopData[keys[i]]
                        if (!item) {
                            item = specialShopData[keys[i]]
                        }

                        if (!item) {
                            item = {
                                image: "?"
                            }
                        }

                        if (!item.image) item.image = "?"

                        itemString += (item.image.length > 5 ? emoji(item.image, message) : item.image) +
                            " " + userInv[keys[i]].amount + " " + keys[i] + "(s) " + (userInv[keys[i]].uses == 1 ? "" : usesDisplay) + "\n \n"
                    }
                }

                if (itemString == "") {
                    embed.setTitle(mention.tag + "'s inventory").setDescription("They have nothing!").setColor("2f3237")
                    message.channel.send(embed)
                    return
                }
                embed.setTitle(mention.tag + "'s inventory").setDescription(itemString).setColor("2f3237")
                embed.setFooter("Inventory page #" + (page + 1) + " out of " + pages.length + " pages.")
                message.channel.send(embed)
            }
        }

    }
}