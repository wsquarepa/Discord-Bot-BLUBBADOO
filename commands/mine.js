var userData = require('../userData.json')
const fs = require('fs');
const shopData = require('../shop.json')
const discord = require("discord.js")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createEmbed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

module.exports = {
    name: 'mine',
	description: 'Mine for rare earth elements!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 60,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {

        if (userData[message.author.id].inventory["pickaxe"] == null || userData[message.author.id].inventory["pickaxe"].amount < 1) {
            var embed = new discord.MessageEmbed({
                title: "Error",
                description: "How do you suppose you mine without a proper mining tool?",
                color: "ff0000"
            })
            message.channel.send(embed)
            return false
        }

        userData[message.author.id].inventory.pickaxe.uses -= 1
        if (userData[message.author.id].inventory.pickaxe.uses < 1) {
            userData[message.author.id].inventory.pickaxe.amount -= 1
            userData[message.author.id].inventory.pickaxe.uses = shopData.pickaxe.uses
        }

        var iron = randomNumber(0, 5)
        var gold = randomNumber(0, 2)
        var gemChance = randomNumber(0, 1)
        if (gemChance) {
            userData[message.author.id].gems++
        }

        if (!iron == 0) {
            if (userData[message.author.id].inventory["iron"]) {
                userData[message.author.id].inventory["iron"].amount += iron
            } else {
                userData[message.author.id].inventory["iron"] = {
                    amount: iron,
                    uses: 1
                }
            }
        }

        if (!gold == 0) {
            if (userData[message.author.id].inventory["gold"]) {
                userData[message.author.id].inventory["gold"].amount += gold
            } else {
                userData[message.author.id].inventory["gold"] = {
                    amount: gold,
                    uses: 1
                }
            }
        }

        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)

        message.channel.send(createEmbed("Total earnings:", `
        **Iron:** ${iron}
        **Gold:** ${gold}
        **Gems:** ${gemChance}
        `, "00ff00"))
    }
}