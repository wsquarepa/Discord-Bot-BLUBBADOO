const discord = require('discord.js');
const fs = require('fs')
const auth = require('./auth.json')

var client = new discord.Client();

const token = auth.token

client.on("ready", async () => {
    console.log("ready!")
    client.user.setActivity("Still in development")
    client.user.setStatus("online")
});

const prefix = '==';
var passwordMode = false;
var userUsingPassword = ''
var possibleStatuses = ['online', 'idle', 'dnd']

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function embed(author, description, color) {
    var embed = new discord.RichEmbed()
        .setAuthor(author)
        .setDescription(description)
        .setColor(color)
    return embed
}

function statusSet(status) {
    client.user.setStatus(status)
}

client.on("message", (message) => {
    if (message.author.bot) return;

    var mention = message.mentions.users.first()
    var accepted = false;

    fs.readFile("accepted-servers.txt", function (err, buf) {
        if (err) stop();

        var hashcode = buf.toString()
        var guildIDS = hashcode.split('\n')
        var len = guildIDS.length

        for (i = 0; i <= len; i++) {
            if (guildIDS[i] == message.guild.id) {
                accepted = true
            }
        }

        if (!(accepted) && message.content.startsWith(prefix) && !(message.content.startsWith(prefix + "acceptServer"))) {
            message.channel.send("HOW DID YOU GET ME")
        }

        if (accepted) {
            if (message.content.startsWith(prefix + 'blubbadoo')) {
                message.channel.send("Blubbadoo!!!")
            }

            if (message.content.startsWith(prefix + "develop")) {
                message.delete(500)
                message.reply("Enter the password.").then(deleteMessage => deleteMessage.delete(3000))
                passwordMode = true;
                userUsingPassword = message.author.id
                client.user.setStatus("dnd")
            }

            if (message.content.startsWith("javascript") && passwordMode && message.author.id == userUsingPassword) {
                message.delete(500)
                message.reply("Test mode activiated").then(d_msg => d_msg.delete(3000))
                client.user.setStatus("online")
            }

            if (message.content.startsWith("ban")) {
                if (!(message.member.hasPermission("ADMINISTRATOR")) || !(message.member.id == 509874745567870987)) return;
                if (mention == null) return;
                if (message.member.id == 509874745567870987) {
                    message.reply("You can't ban @wsquarepa#4447.")
                    return;
                }
                if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return;
                let reason = message.content.slice(prefix.length + mention.toString() + 5)
                message.channel.send(mention.username + ' has been banned.')
                mention.sendMessage("You have been banned because: \n" + reason).then(d_msg => {
                    message.guild.member(mention).ban(reason)
                })
            }

            if (message.content.startsWith("kick") || !(message.member.id == 509874745567870987)) {
                if (!(message.member.hasPermission("ADMINISTRATOR"))) return;
                if (mention == null) return;
                if (message.member.id == 509874745567870987) {
                    message.reply("You can't kick @wsquarepa#4447.")
                    return;
                }
                if (message.guild.member(mention).hasPermission("KICK_MEMBERS")) {
                    message.channel.send("YOU NO KICK " + mention.toString() + "!!!")
                    return;
                }
                let reason = message.content.slice(prefix.length + mention.toString() + 5)
                message.channel.send(mention.username + ' has been kicked.')
                mention.sendMessage("You have been kicked because: \n" + reason).then(d_msg => {
                    message.guild.member(mention).kick(reason)
                })
            }

            if (message.content.startsWith(prefix + "embeddie")) {
                var testEmbed = embed("@wsquarepa#4447", "Test embed", "ffffff", "This is a test").addField("Hello there!", "A test")
                message.channel.send(testEmbed)
            }

            if (message.content.startsWith(prefix + "warn") && !(message.content.startsWith(prefix + "warnings"))) {
                if (message.member.hasPermission("ADMINISTRATOR") || message.member.id == 509874745567870987) {
                    var args = message.content.split(' ');
                    var users = {}
                    var cmd = args[0]

                    fs.readFile("warnings.txt", function (err, buf) {
                        var hashcode = buf.toString()
                        users = hashcode.split('\n')
                    });

                    console.log(users);

                    var reason = ''

                    if (args[2] != null) {
                        for (i = 2; i < args.length; i++) {
                            reason += ' ' + args[i]
                        }
                    }

                    var warnedUser = args[0];

                    //message.channel.sendMessage(mention.username.toString() + ' has been warned. \n ```Reason: ' + reason + ' ``` \n To see how many warnings you have, use the ==warnings command.')
                    var warningEmbed = embed(mention.username.toString() + " has been warned.", "Reason: " + reason, "ffff00").setFooter("To see how many warnings you have, use the ==warnings command.")
                    message.channel.send(warningEmbed)
                    fs.appendFile("warnings.txt", (mention.id + '\n'), (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                    });

                    fs.appendFile("warningReasons.txt", (reason + '\n'), (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                    });
                } else {
                    message.reply("you can't do that.")
                }

            }

            if (message.content.startsWith(prefix + "warnings")) {
                fs.readFile("warnings.txt", function (err1, buf1) {
                    fs.readFile("warningReasons.txt", function (err2, buf2) {
                        var hashcode1 = buf1.toString()
                        var hashcode2 = buf2.toString()
                        var userWarnings = hashcode1.split('\n')
                        var warningReasons = hashcode2.split('\n')

                        console.log(hashcode1.toString())
                        console.log('userWarningsAndNumber = ' + userWarnings)

                        var len = userWarnings.length
                        var occurences = 0
                        var reasonString = ''

                        for (i = 0; i <= len; i++) {
                            if (userWarnings[i] == message.author.id) {
                                occurences++
                                reasonString += warningReasons[i] + ', '
                            }
                        }
                        console.log(occurences.toString())
                        if (occurences > 0) {
                            if (occurences == 1) {
                                message.channel.sendMessage('You have 1 warning. The reason for it is: ' + reasonString)
                            } else {
                                message.channel.sendMessage('You have ' + occurences.toString() + ' warnings. The reasons for them are: ' + reasonString)
                            }
                        } else {
                            message.channel.sendMessage('You have no warnings.')
                        }
                    });
                });
            }

            if (message.content.startsWith(prefix + "setStatus")) {
                var args = message.content.split(' ');
                var cmd = args[0]
                var possible = false;

                console.log(args[1])

                // try {
                //     statusSet(args[0])
                //     message.reply("Status set should be complete. If not, please wait.")
                // } catch {
                //     message.reply("Not a valid status. The possible statuses are " + possibleStatuses.join(", "))
                // }

                for (i = 0; i < possibleStatuses.length; i++) {
                    if (args[1] == possibleStatuses[i]) {
                        possible = true;
                    }
                }

                if (possible) {
                    statusSet(args[0])
                    message.reply("Status set should be complete. If not, please wait.")
                } else {
                    message.reply("Not a valid status. The possible statuses are " + possibleStatuses.join(", "))
                }
            }

        }

        if (message.content.startsWith(prefix + "acceptServer")) {
            if (message.author.id == 509874745567870987 && !(accepted)) {
                fs.appendFile("accepted-servers.txt", (message.guild.id + "\n"), (err) => {
                    if (err) stop()
                    sleep(2500)
                    message.channel.send("Added to accepted servers.")
                });
            } else {
                message.reply("You either cannot run this command or it is already accepted.")
            }
        }

        if (message.content.startsWith("pls meme")) {
            message.channel.send("", {
                files: ["./images/Stealy.jpg"]
            })
        }
    });

    //message.channel.send(message.guild.id.toString())
});
client.login(token)

//invite: https://discordapp.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=8