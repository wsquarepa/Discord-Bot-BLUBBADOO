const Discord = require('discord.js')
const fs = require('fs');
const { prefix, token } = require('./config.json');
const cooldowns = new Discord.Collection();
const client = new Discord.Client();
var userData = require('./userData.json')
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
	client.commands.set(command.name, command);
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.once("ready", function () {
	console.log("Bot logged in!")
})

client.on('message', message => {

	if (!message.author.bot) {
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
					type: "user"
				},
				pet: {}
			}
		}

		userData[message.author.id].xp += 1
		
		if (userData[message.author.id].xp >= userData[message.author.id].xpUntil) {
			userData[message.author.id].xp = 0
			userData[message.author.id].level += 1
			userData[message.author.id].gems += 1
			userData[message.author.id].xpUntil = userData[message.author.id].xpUntil * 2
			message.channel.send("Congratulations, " + message.author.username + ", you leveled up to level " + userData[message.author.id].level + "!")
		}

		userData[message.author.id].cash += userData[message.author.id].level

		if (!isEmpty(userData[message.author.id].pet)) {
			if (!userData[message.author.id].pet.food < 1) {
				userData[message.author.id].pet.food -= 1
				userData[message.author.id].pet.coins += randomNumber(5, 25)
			}
		}

		fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
	}
	

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
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
		command.execute(message, args);
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);	
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);