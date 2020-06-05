var userData = require('../userData.json')
const fs = require('fs')

module.exports = {
    name: 'deposit',
	description: 'Deposit money!',
    args: true,
    usage: '<amount | all>',
    guildOnly: false,
    aliases: ['dep'],
    cooldown: 1.5,
	execute(message, args, mention) {
        if (args[0] == null) {
            message.channel.send("Next time, tell me what you want to put in the bank.")
            return
        }
        args[0] = args[0].trim()
        if (args[0] == "all") {
            userData[message.author.id].bank += userData[message.author.id].cash
            userData[message.author.id].cash = 0
        } else if (args[0] != null) {
            if ((userData[message.author.id].cash - parseInt(args[0])) < 0) {
                message.channel.send("You can't deposit more than you have.")
                return;
            }
            userData[message.author.id].bank += parseInt(args[0])
            userData[message.author.id].cash -= parseInt(args[0])
        }
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        message.channel.send("You deposited " + (args[0] != "all" ? `$${args[0]}` : "all your money") + " to the bank.")
    }
}