var userData = require('../userData.json')
const fs = require('fs')

module.exports = {
    name: 'withdraw',
	description: 'Withdraw money!',
    args: true,
    usage: '<amount | all>',
    guildOnly: false,
    aliases: ['with', 'wdrw'],
    cooldown: 1.5,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        if (args[0] == null) {
            message.channel.send("Next time, tell me what you want to take out of the bank.")
            return false
        }
        args[0] = args[0].trim()
        if (args[0] == "all") {
            userData[message.author.id].cash += userData[message.author.id].bank
            userData[message.author.id].bank = 0
        } else if (args[0] != null) {
            if (isNaN(parseInt(args[0]))) {
                message.channel.send("You can't withdraw that.")
                return false;
            }

            if ((userData[message.author.id].bank - parseInt(args[0])) < 0) {
                message.channel.send("You can't withdraw more than you have.")
                return false;
            }
            
            userData[message.author.id].bank -= parseInt(args[0])
            userData[message.author.id].cash += parseInt(args[0])
        }
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
        message.channel.send("You withdrew " + (args[0] != "all" ? `$${args[0]}` : "all your money") + " from the bank.")
    }
}