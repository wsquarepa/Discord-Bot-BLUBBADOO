const Discord = require('discord.js')
const fs = require('fs');
const { prefix, token } = require('./config.json');
const cooldowns = new Discord.Collection();
const client = new Discord.Client();
var userData = require('./userData.json')
const modeOfUser = require('../configs/blubbadoo.json')
var botData = require('./botData.json')
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	var commandName = command.name
	if (!botData[commandName]) {
		botData[commandName] = {
			uses: 0,
			lastUsed: 0
		}
	}
	fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error(err) : null)
}

client.once("ready", function () {
	console.log("Bot logged in!")
	if (modeOfUser.testMode) client.user.setActivity({name: "In test mode", type: "CUSTOM_STATUS"})
})

client.on('message', message => {
	if (message.author.id != "509874745567870987" && modeOfUser.testMode) return

	if (!modeOfUser.testMode) {
		botData.messagesRecieved++
		fs.writeFile("./botData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
	}
	

	if (!message.author.bot && !modeOfUser.testMode) {
		if (!userData[message.author.id]) {
			userData[message.author.id] = {
				cash: 0,
				bank: 0,
				gems: 0,
				xp: 0,
				xpUntil: 10,
				level: 0,
				inventory: {},
				username: message.author.username,
				account: {
					secured: false, 
					type: "user",
					daily: {
						streak: -1,
						previousAmt: 0,
						expires: new Date().getTime() + 1000 * 60 * 60 * (24 + 24) //2 Days
					}
				},
				pet: {}
			}
		}

		if (!userData[message.author.id].account.daily) {
			userData[message.author.id].account.daily = {
				streak: -1,
				previousAmt: 0,
				expires: new Date().getTime() + 1000 * 60 * 60 * (24 + 24) //2 Days
			}
		}

		userData[message.author.id].xp += 1
		userData[message.author.id].username = message.author.username
		
		if (userData[message.author.id].xp >= userData[message.author.id].xpUntil) {
			userData[message.author.id].xp = 0
			userData[message.author.id].level += 1
			if (userData[message.author.id].level % 2 == 0) {
				userData[message.author.id].gems += 1
			}
			userData[message.author.id].xpUntil += 10
			message.channel.send("Congratulations, " + message.author.username + ", you leveled up to level " + userData[message.author.id].level + "!")
				.then(m => m.delete({timeout: 5000}).catch(err => message.channel.send("I can't delete messages, so I cannot remove that message.")))
		}

		userData[message.author.id].cash += userData[message.author.id].level

		var netWorth = userData[message.author.id].cash + userData[message.author.id].bank
		if (!userData[message.author.id].nextGemCashGoal) {
			userData[message.author.id].nextGemCashGoal = (netWorth - (netWorth % 5000)) + 5000
		}

		if (netWorth > userData[message.author.id].nextGemCashGoal) {
			userData[message.author.id].gems += 1
			message.channel.send("Congratulations, " + message.author.username + ", you earned one gem because you just exceeded  " + userData[message.author.id].nextGemCashGoal + "!")
				.then(m => m.delete({timeout: 5000}).catch(err => message.channel.send("I can't delete messages, so I cannot remove that message.")))
				userData[message.author.id].nextGemCashGoal += 10000
		}

		if (!isEmpty(userData[message.author.id].pet)) {
			if (!userData[message.author.id].pet.food < 1) {
				userData[message.author.id].pet.food -= 1
				userData[message.author.id].pet.coins += randomNumber(5, 25)
			}
		}
		fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
	}
	

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (userData[message.author.id].account.type.toLowerCase() == "banned") {
		message.channel.send("Uh oh, you've been banned from using me. Ask a bot developer for more info.")
		return
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	var mention = message.mentions.users.first()

	const commandName = args.shift().toLowerCase();

	if (!mention) {
		try {
			mention = message.guild.members.cache.find(x => x.user.username == args.join(" ")).user
		} catch {
			try {
				mention = message.guild.members.cache.find(x => x.nickname == args.join(" ")).user
			} catch {
				mention = null
			}
		}
	}

	var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	if (!command) return;

	const now = Date.now();
	//#region - Here is the command tracking. 
	if (!modeOfUser.testMode) {
		botData[command.name].uses++
		botData[command.name].lastUsed = now
		fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error(err) : null)
	}
	//#endregion

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const embed = new Discord.MessageEmbed()
			embed.setTitle("Error")
			embed.setDescription(`You have to wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
			embed.setColor("ff0000")
			return message.channel.send(embed)
		}
	}

	try {
		var success = command.execute(message, args, mention) 
		if (success == null) success = true
		if (success) {
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);	
		}
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.on('guildCreate', function(guild) {
	guild.channels.create("Blubbadoo Welcome Channel", {
		type: 'text',
		permissionOverwrites: [
			{
				id: guild.roles.everyone.id,
				deny: ['SEND_MESSAGES'],
			},
			{
				id: client.user.id,
				allow: ['SEND_MESSAGES']
			}
		]}).then(function(channel) {
		var embed = new Discord.MessageEmbed()
		embed.setTitle("Thank you!")
		embed.setDescription("I appreciate that you added me! Thank you again. \n" + 
			"If you don't know how to use me, then please do ==help. \n" + 
			"Blubbadoo needs **ADMINISTRATOR** permissions, otherwise some commands will not be available.")
		embed.setFooter("This message and channel will self destruct in 1 minute.")
		channel.send(embed).then(() => {
			setTimeout(function() {
				channel.delete().catch()
			}, 60000)
		})
	}).catch()
})

client.login(token);