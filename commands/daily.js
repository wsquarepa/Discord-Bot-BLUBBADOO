var userData = require('../userData.json')
const fs = require('fs');
const discord = require('discord.js')

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'daily',
	description: 'Daily Money!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 86400,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        // if (userData[message.author.id].account.daily.expires - (1000 * 60 * 60 * 24) > Date.now()) {
        //     const embed = new discord.MessageEmbed()
		// 	embed.setAuthor("ERR_TIMEOUT")
		// 	embed.setTitle("Error: ")
		// 	embed.setDescription(`You have to wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${command.name}\` command.`)
        //     embed.setColor("ff0000")
        //     message.channel.send(embed)
        //     return;
        // }

        if (userData[message.author.id].account.daily.expires < (new Date().getTime())) {
            userData[message.author.id].account.daily.streak = -1
            userData[message.author.id].account.daily.previousAmt = 0
        }
        var max = userData[message.author.id].account.daily.streak == 30? true:false
        if (!max) userData[message.author.id].account.daily.streak += 1
        var randNum = 0
        if (!max) randNum = randomNumber(10, 20)
        var earnings = 1500 + userData[message.author.id].account.daily.previousAmt + (randNum * userData[message.author.id].account.daily.streak)
        userData[message.author.id].account.daily.previousAmt += (randNum * userData[message.author.id].account.daily.streak)
        userData[message.author.id].cash += earnings
        var embed = new discord.MessageEmbed({
            title: "Daily",
            description: `You got $${earnings} as a daily gift!`,
            color: "2f3237"
        })

        var streakText = `${max? "MAX":`${userData[message.author.id].account.daily.streak} day(s)`}`
        embed.setFooter(`Streak: ${streakText}. (+$${userData[message.author.id].account.daily.previousAmt})`)
        message.channel.send(embed)
        userData[message.author.id].account.daily.expires = new Date().getTime() + 1000 * 60 * 60 * (24 + 24)
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}