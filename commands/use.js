var userData = require('../userData.json')
const shopData = require('../shop.json')
const fs = require('fs');
const discord = require("discord.js")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'use',
	description: 'Use an item!',
    args: true,
    usage: '<item>',
    guildOnly: false,
    aliases: ['activate'],
    cooldown: 3.3,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        if (args[0].toLowerCase() == "gem") {

            if (args[1] == null) {
                args[1] = 1
            }
            args[1] = parseInt(Math.round(args[1]))
            
            if (userData[message.author.id].gems < args[1]) {
                message.channel.send("You don't have enough gems to use... try leveling up!")
                return false
            }

            message.channel.send("Ok, using " + args[1] + " " + args[0] + (args[1] > 1? "s":"") + " ...")
            userData[message.author.id].gems -= args[1]
            var earnings = randomNumber(1000, 2000) * args[1]
            userData[message.author.id].cash += earnings
            message.channel.send("Congrats, you earned $" + earnings + " from " + (args[1] > 1? "those":"that") + " " + args[0] + (args[1] > 1? "s":"") + ".")
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        } else if (args[0].toLowerCase() == "lock") {

            if (userData[message.author.id].account.secured == true) {
                message.channel.send("Your account is already secured, there's no point re-securing it.")
                return false
            }

            if (userData[message.author.id].inventory.lock.amount < 1) {
                message.channel.send("You don't got any locks.")
                return false
            }

            message.channel.send("Ok, locking your account...")
            userData[message.author.id].inventory.lock.amount -= 1
            userData[message.author.id].account.secured = true
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            message.channel.send("Ok, account secured!")
        } else if (args[0].toLowerCase() == "moneydoubler") {

            if (userData[message.author.id].inventory.moneydoubler == null || userData[message.author.id].inventory.moneydoubler.amount < 1) {
                message.channel.send("You don't got any of those.")
                return false
            }

            message.channel.send("If you want to double your **cash**, say \"yes\". Otherwise say anything else.")

            var collector = new discord.MessageCollector(message.channel, m => m.author == message.author, {time: 10000})
            collector.on('collect', msg => {
                collector.stop()
                if (msg.content.toLowerCase() == "yes") {
                    message.channel.send("Ok, doubling your **cash**...")
                    userData[message.author.id].inventory.moneydoubler.amount -= 1
                    userData[message.author.id].cash += userData[message.author.id].cash
                    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                    message.channel.send("Ok, action complete!")
                } else {
                    message.channel.send("Welp, maybe sometime else huh?")
                }
            })

            collector.once("end", () => {
                message.channel.send("Collect End.")
            })
        } else if (args[0].toLowerCase() == "chest") {
            if (userData[message.author.id].inventory.chest.amount < 1) {
                message.channel.send("You don't got any of those.")
                return false
            }

            var msg = new discord.Message()
            message.channel.send("Opening the chest...").then(m => msg = m)

            setTimeout(function(){
                var chance = randomNumber(1, 10)
                if (!userData[message.author.id].inventory.key || userData[message.author.id].inventory.key.amount < 1) {
                    msg.edit("Hmm... get a key; you need one to open a chest.")
                    return false
                }

                userData[message.author.id].inventory.chest.amount--
                if (chance == 3) {
                    msg.edit("Umm... unfourtunatley, someone already raided this chest. You keep your key though!")
                    return;
                }
                userData[message.author.id].inventory.key.amount--
                
                var cash = randomNumber(0, 50000)
                var gems = randomNumber(0, 5)
                var item = Object.keys(shopData)[randomNumber(0, Object.keys(shopData).length - 1)]

                userData[message.author.id].cash += cash
                userData[message.author.id].gems += gems

                if (userData[message.author.id].inventory[item]) {
                    userData[message.author.id].inventory[item].amount += 1
                } else {
                    userData[message.author.id].inventory[item] = {
                        amount: 1,
                        uses: shopData[item].uses
                    }
                }

                var embed = new discord.MessageEmbed()
                embed.setTitle("Chest successfully opened!")
                embed.setDescription(`**Your earnings:**
                **Cash:** +$${cash}
                **Gems:** +${gems} 💎
                **Item found:** 1 ${item}`)
                embed.setColor("00ff00")
                
                msg.edit("", {embed: embed})
                fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            }, 2500)
        }
    }
}