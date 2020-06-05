var userData = require('../userData.json')
const fs = require('fs');

module.exports = {
    name: 'work',
	description: 'Work for money!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 3600,
	execute(message, args, mention) {
        var min = Math.ceil(100);
        var max = Math.floor(500);
        var earnings = Math.floor(Math.random() * (max - min + 1)) + min;

        userData[message.author.id].cash += earnings

        var workTypes = ["cook", 'coder', 'janitor', 'teacher', 'discord developer']
        var workType = workTypes[Math.floor((Math.random() * workTypes.length))]
        
        message.channel.send(`You got $${earnings} from working as a ${workType}!`)
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}