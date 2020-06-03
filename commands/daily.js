var userData = require('../userData.json')
const fs = require('fs');

module.exports = {
    name: 'daily',
	description: 'Daily Money!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 86400,
	execute(message, args) {
        var earnings = 1500
        userData[message.author.id].cash += earnings
        message.channel.send(`You got $${earnings} as a daily gift!`)
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}