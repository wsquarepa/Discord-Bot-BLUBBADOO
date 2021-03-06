var userData = require('../userData.json')
const config = require('../config.json')
const fs = require('fs');
const discord = require("discord.js")
const execSync = require('child_process').execSync;

module.exports = {
    name: 'sudo',
	description: 'Super User - Bot admins only.',
    args: true,
    usage: 'help',
    guildOnly: false,
    aliases: ['su', 'bot'],
    cooldown: 0,
    category: "admincmd",
    adminOnly: true,
	execute(message, args, mention, specialArgs) {
        if (!config["botAdmins"].includes(message.author.id) &&
            userData[message.author.id].account.type.toLowerCase() != "admin") return message.channel.send("You can't run that.")

        if (args[0] == "help") {
            var embed = new discord.MessageEmbed().setTitle("Help on SUDO").setDescription(`
                addMoney <@mention> <cash|bank> <amount> - add money to mention
                removeMoney <@mention> <cash|bank> <amount> - remove money from mention
                botBan <@mention> - Ban someone from the bot
                botUnban <@mention> - Unbans someone from the bot
                set <@mention> <type> - Sets mention's user type to type
            `).setColor("2f3237")
            message.channel.send(embed)
        } else if (args[0] == "petCtl") {
            if (args[1] == "nameSet") {
                userData[mention.id].pet.name = args.splice(3).join(" ")
                message.channel.send("Complete! " + mention.username + "'s pet is now named " + userData[mention.id].pet.name + "!")
            } else if (args[1] == "typeSet") {
                userData[mention.id].pet.type = args.splice(3).join(" ")
                message.channel.send("Complete! " + mention.username + "'s pet is now typed as " + userData[mention.id].pet.type + "!")
            } else if (args[1] == "coinSet") {
                userData[mention.id].pet.coins = parseInt(args[3])
                message.channel.send("Complete! " + mention.username + "'s pet now has $" + userData[mention.id].pet.coins + "!")
            } else if (args[1] == "energySet") {
                userData[mention.id].pet.food = parseInt(args[3])
                message.channel.send("Complete! " + mention.username + "'s pet's energy is set to " + (userData[mention.id].pet.food) + "!")
            } else {
                message.channel.send("That's not a valid petCtl command.")
            }
        } else if (args[0] == "backup") {
            message.channel.send("Working...").then(function() {
                try {
                    var output = ""
                    output += execSync('git pull', { encoding: 'utf-8' })
                    output += execSync('git add .', { encoding: 'utf-8' });
                    output += execSync('git commit -m backup', { encoding: 'utf-8' })
                    output += execSync('git push', { encoding: 'utf-8' })
                    message.channel.send(output).catch(message.channel.send("Complete!"))
                } catch (e) {
                    message.channel.send(e)
                }
            })
            
        } else if (args[0] == "purgeUsers") {
            message.channel.send("Working...").then(function(msg) {
                const keys = Object.keys(userData)
                var usersPurged = 0
                for (var i = 0; i < keys.length; i++) {
                    const userCheckCash = userData[keys[i]].cash
                    const userCheckBank = userData[keys[i]].bank
                    const userCheckGems = userData[keys[i]].gems

                    if ((userCheckCash + userCheckBank + userCheckGems) <= 0) {
                        delete userData[keys[i]]
                        usersPurged++
                    }
                }
                msg.edit("Complete! Purged " + usersPurged + " users.") 
            })
        } else {
            message.channel.send("That's not a valid command.")
        }
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
    }
}