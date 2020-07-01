var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'music',
	description: 'Play random music in the voice channel!',
    args: false,
    usage: '<music command>',
    guildOnly: true,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
	execute(message, args, mention) {

        if (!message.author.id == "509874745567870987") return false;

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
            "You need to be in a voice channel to play music!"
            );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
            );
        }

        if (args[0] == "play") {
            message.member.voice.channel.join().then(function(connection) {
                const songs = fs.readdirSync('./media/music').filter(m => m.endsWith(".mp3"))
                if (args[1] == null) {
                    args[1] = songs[randomNumber(0, songs.length - 1)]
                }

                if (!songs.includes(args[1])) {
                    message.channel.send("That doesn't exist")
                    return false
                }

                connection.play('./media/music/' + args[1])
                message.channel.send("Playing " + args[1])
            })
        } else if (args[0] == "stop") {
            voiceChannel.leave()
            message.channel.send("Music stopped.")
        }
    }
}