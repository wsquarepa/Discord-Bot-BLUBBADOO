const Discord = require('discord.js')
const fs = require('fs');
const {
	prefix,
	token,
	bannedServers,
	dblToken,
	dblPassword
} = require('./config.json');
const cooldowns = new Discord.Collection();
const client = new Discord.Client();
var userData = require('./userData.json')
const modeOfUser = require('../configs/blubbadoo.json')
const teamData = require('./teams.json')
var botData = require('./botData.json')
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const http = require('http')
const DBL = require('dblapi.js')
const dbl = new DBL(dblToken, client);

const server = http.createServer((req, res) => {
	res.writeHead(200, {
		'content-type': 'text/html;charset=utf-8',
	});
	res.write("200 OK");
	res.end();
}).listen(8080, "104.248.218.189")

const dblWebhook = new DBL(dblToken, { webhookPort: 8080, webhookAuth: dblPassword, webhookServer: server})
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('database', 'blubbadoo', 'awesomeMuppy123', {
// 	host: '104.248.218.189',
// 	dialect: 'sqlite',
// 	logging: false,
// 	// SQLite only
// 	storage: 'database.sqlite',
// });

//modeOfUser.testMode = false

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
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
	if (botData != "" || botData != null || !isEmpty(botData)) {
		fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error(err) : null)
	}
}

client.once("ready", function () {
	console.log("Bot logged in!")
	if (modeOfUser.testMode) client.user.setActivity({
			name: "In test mode",
			type: "CUSTOM_STATUS"
		})
		.catch(function (error) {
			console.error(error)
		})
		.then(function () {
			console.log("Custom status go.")
		})

	setInterval(() => {
		dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
	}, 1800000);
})

client.on('message', message => {
	if (bannedServers.includes(message.guild.id)) return;
	if ((message.author.id != "509874745567870987" && modeOfUser.testMode)) return

	if (!modeOfUser.testMode) {
		botData.messagesRecieved++
		if (botData != "" || botData != null || !isEmpty(botData)) {
			fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error(err) : null)
		}
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
					},
					title: ""
				},
				pet: {},
				team: "",
				achivements: [],
				codesUsed: []
			}
		}

		if (!userData[message.author.id].account.daily) {
			userData[message.author.id].account.daily = {
				streak: -1,
				previousAmt: 0,
				expires: new Date().getTime() + 1000 * 60 * 60 * (24 + 24) //2 Days
			}
		}

		if (!userData[message.author.id].team) {
			userData[message.author.id].team = ""
		}

		if (userData[message.author.id].achivements == null) {
			userData[message.author.id].achivements = []
		}

		if (userData[message.author.id].account.title == null || userData[message.author.id].account.title == "") {
			userData[message.author.id].account.title = "none"
		}

		if (userData[message.author.id].codesUsed == null) {
			userData[message.author.id].codesUsed = []
		}

		userData[message.author.id].xp += 1

		if (userData[message.author.id].xp >= userData[message.author.id].xpUntil) {
			userData[message.author.id].xp = userData[message.author.id].xpUntil - userData[message.author.id].xp
			userData[message.author.id].level += 1
			if (userData[message.author.id].level % 2 == 0) {
				userData[message.author.id].gems += 1
			}
			userData[message.author.id].xpUntil += 10
			message.channel.send("Congratulations, " + message.author.username + ", you leveled up to level " + userData[message.author.id].level + "!")
				.then(m => m.delete({
					timeout: 5000
				}).catch()).catch()
		}

		//#region - chat money

		userData[message.author.id].cash += userData[message.author.id].level

		//#endregion

		var netWorth = userData[message.author.id].cash + userData[message.author.id].bank
		if (!userData[message.author.id].nextGemCashGoal) {
			userData[message.author.id].nextGemCashGoal = (netWorth - (netWorth % 5000)) + 5000
		}

		if (netWorth > userData[message.author.id].nextGemCashGoal) {
			userData[message.author.id].gems += 1
			message.channel.send("Congratulations, " + message.author.username + ", you earned one gem because you just exceeded  " + userData[message.author.id].nextGemCashGoal + "!")
				.then(m => m.delete({
					timeout: 5000
				}).catch()).catch()
			userData[message.author.id].nextGemCashGoal = netWorth + 10000
		}

		if (!isEmpty(userData[message.author.id].pet)) {
			if (!userData[message.author.id].pet.food < 1) {
				userData[message.author.id].pet.food -= 1
				userData[message.author.id].pet.coins += randomNumber(5, 25)
			}
		}

		if (teamData[userData[message.author.id].team]) {
			userData[message.author.id].username = "[" + teamData[userData[message.author.id].team].tag + "] " + message.author.username
		} else {
			userData[message.author.id].username = message.author.username
		}

		var achivements = require('./jsHelpers/achivements')
		for (var i in achivements) {

			if (achivements[i].toGet.command == "") {
				var requirements = {
					cash: achivements[i].toGet.cash,
					bank: achivements[i].toGet.bank,
					total: achivements[i].toGet.total,
					gems: achivements[i].toGet.gems
				}

				var currently = {
					cash: userData[message.author.id].cash,
					bank: userData[message.author.id].bank,
					total: userData[message.author.id].cash + userData[message.author.id].bank,
					gems: userData[message.author.id].gems
				}

				if (
					currently.cash >= requirements.cash &&
					currently.bank >= requirements.bank &&
					currently.total >= requirements.total &&
					currently.gems >= requirements.gems &&
					!userData[message.author.id].achivements.includes(i)
				) {
					userData[message.author.id].achivements.push(i)

					var stuffEarn = achivements[i].reward
					userData[message.author.id].bank += stuffEarn.money
					userData[message.author.id].gems += stuffEarn.gems
					if (stuffEarn.item != "") {
						if (userData[message.author.id].inventory[stuffEarn.item]) {
							userData[message.author.id].inventory[stuffEarn.item].amount += 1
						} else {
							userData[message.author.id].inventory[stuffEarn.item] = {
								amount: 1,
								uses: 1
							}
						}
					}

					if (stuffEarn.title != "") {
						userData[message.author.id].account.title = stuffEarn.title
					}

					message.channel.send("**ACHIEVEMENT EARNED!** \n `" + i + "`!")
						.then(m => m.delete({
							timeout: 5000
						}).catch()).catch()
				}


			}
		}

		fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
	}


	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (userData[message.author.id].account.type.toLowerCase() == "banned") {
		message.channel.send("Uh oh, you've been banned from using me. Ask a bot developer for more info.").catch()
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

	if (!modeOfUser.testMode) {
		for (var i in achivements) {
			var requirementStuff = {
				command: achivements[i].toGet.command
			}

			if (
				commandName == requirementStuff.command &&
				requirementStuff.command != "" &&
				!userData[message.author.id].achivements.includes(i)
			) {
				userData[message.author.id].achivements.push(i)

				var stuffEarn = achivements[i].reward
				userData[message.author.id].bank += stuffEarn.money
				userData[message.author.id].gems += stuffEarn.gems
				if (stuffEarn.item != "") {
					if (userData[message.author.id].inventory[stuffEarn.item]) {
						userData[message.author.id].inventory[stuffEarn.item].amount += 1
					} else {
						userData[message.author.id].inventory[stuffEarn.item] = {
							amount: 1,
							uses: 1
						}
					}
				}
				message.channel.send("**ACHIEVEMENT EARNED!** \n `" + i + "`!")
					.then(m => m.delete({
						timeout: 5000
					}).catch()).catch()
			}
		}
	}


	const now = Date.now();
	//#region - Here is the command tracking. 
	botData[command.name].uses++
	botData[command.name].lastUsed = now
	if (botData != "" || botData != null || !isEmpty(botData)) {
		fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error(err) : null)
	}
	//#endregion

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`).catch()
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!').catch()
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const levelRequirement = (command.levelRequirement || 0)
	if (userData[message.author.id].level < levelRequirement) {
		message.reply("that command requires level " + levelRequirement + ". You are currently at level " + userData[message.author.id].level + "!").catch()
		return
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
			return message.channel.send(embed).catch()
		}
	}

	try {
		var success = command.execute(message, args, mention)
		console.log(success)
		if (success == null) success = true
		if (success) {
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}
	} catch (error) {
		if (modeOfUser.testMode && message.guild.id != "264445053596991498") {
			console.error(error);
		}
		message.reply('There was an error trying to execute that command!').catch()
	}
});

dblWebhook.webhook.on('ready', hook => {
	console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

dblWebhook.webhook.on('vote', vote => {
	userData[vote.user].gems++
	fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
});

client.on('guildCreate', function (guild) {
	guild.channels.create("Blubbadoo Welcome Channel", {
		type: 'text',
		permissionOverwrites: [{
				id: guild.roles.everyone.id,
				deny: ['SEND_MESSAGES'],
			},
			{
				id: client.user.id,
				allow: ['SEND_MESSAGES', 'MANAGE_CHANNELS']
			}
		]
	}).then(function (channel) {
		var embed = new Discord.MessageEmbed()
		embed.setTitle("Thank you!")
		embed.setDescription("I appreciate that you added me! Thank you again. \n" +
			"If you don't know how to use me, then please do ==help. \n" +
			"I need **ADMINISTRATOR** permissions, otherwise some commands will not be available.")
		embed.setFooter("This message and channel will self destruct in 1 minute.")
		channel.send(embed).then(() => {
			setTimeout(function () {
				channel.delete().catch()
			}, 60000)
		})
	}).catch()
})

client.login(token);