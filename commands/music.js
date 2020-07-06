var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const ytdl = require('ytdl-core');

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

        if (!message.author.id == "509874745567870987") {
            message.channel.send("Sorry, but music commands are currently limited to admins only!")
            return false;
        } 

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
            if (!ytdl.validateURL(args[1])) {
                message.channel.send("That's not a valid youtube video url!")
                return false;
            }

            message.member.voice.channel.join().then(function(connection) {
                const stream = ytdl(args[1] , { filter: 'audioonly' });
                const dispatcher = connection.play(stream);

                dispatcher.on('end', () => voiceChannel.leave());
            })
        } else if (args[0] == "stop") {
            voiceChannel.leave()
            message.channel.send("Music stopped.")
        }
    }
}