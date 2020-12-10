var userData = require('../userData.json')
const fs = require('fs');
const DBL = require('dblapi.js')
const discord = require("discord.js")

module.exports = {
    name: 'vote',
    description: 'Get rewards for voting!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        if (userData[message.author.id].nextVoteTime > Date.now()) {
            const voteAgainTime = (userData[message.author.id].nextVoteTime - Date.now()) / (1000 * 60 * 60)
            var embed = new discord.MessageEmbed()
                .setTitle("You've already voted!")
                .setDescription("[Vote](https://top.gg/bot/596715111511490560/vote 'My voting site') again in " + voteAgainTime.toFixed(2) + " hours!")
                .setColor("2f3237")
            message.channel.send(embed)
            return;
        }

        const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NjcxNTExMTUxMTQ5MDU2MCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTk1NzgxOTAxfQ.bbb9DPH39Q2roE1jKpRxZNMnzyFJQ_ivLJTxoB10cv4', message.client);
        dbl.hasVoted(message.author.id).then(voted => {
            if (voted) {
                userData[message.author.id].gems++
                userData[message.author.id].nextVoteTime = (Date.now() + (1000 * 60 * 60 * 12))
                var embed = new discord.MessageEmbed()
                    .setTitle("Thanks for voting!")
                    .setDescription("You earned 1 gem! If possible, [vote again](https://top.gg/bot/596715111511490560/vote 'My voting site') in 12 hours!")
                    .setColor("2f3237")
                message.channel.send(embed)
            } else {
                var embed = new discord.MessageEmbed()
                    .setTitle("You haven't voted!")
                    .setDescription("You can vote [here](https://top.gg/bot/596715111511490560/vote 'My voting site')")
                    .setColor("2f3237")
                message.channel.send(embed)
                return false
            }
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[ERROR/SHARD] " + err) : null)
        });
    }
}