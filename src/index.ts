// import { readline } from 'readline';
import { appendFile} from 'fs';
import { Client, MessageEmbed } from 'discord.js';
import config from './config';
import helpCommand from './commands';
import keepAlive from './server'

const { intents, prefix, token } = config;

const client = new Client({
  intents,
  presence: {
    status: 'online'
  }
});



client.on('ready', () => {
  console.log(`Logged in as: ${client.user?.tag}`);
  client.user.setActivity(`${prefix}h | ${client.guilds.cache.size} servers`, {
    type: "LISTENING"
  });
  console.log(`${client.user?.tag} is in ${client.guilds.cache.size} servers`)
  const Guilds = client.guilds.cache.map(guild => [guild.id, guild.name, guild.owner]);
  console.log(Guilds);
});

client.on('debug', console.log);

//joined a server
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    appendFile('log.txt', `Joined new guild: ${guild.name}\n`, (err) => {
      if (err) throw err;
    console.log('The data was appended to file!');
    });
    client.user.setActivity(`${prefix}h | ${client.guilds.cache.size} servers`, {
      type: "LISTENING"
    });
});

//removed from a server
client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    appendFile('log.txt', `Left a guild: ${guild.name}\n`, (err) => {
      if (err) throw err;
    console.log('The data was appended to file!');
    });
    client.user.setActivity(`${prefix}h | ${client.guilds.cache.size} servers`, {
      type: "LISTENING"
    });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.mentions.has(client.user)) {
    if (message.mentions.has('<@904658397268414485>')) {return;}
    else
      message.reply('I\'m Pengu! Your friendly bot! Try ` -help `')
  }
  
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift();

    switch(command) {
      case 'uptime':
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;
  
        const footerText = message.author.tag;
        const footerIcon = message.author.displayAvatarURL();
        const exampleEmbed = new MessageEmbed()
	      .setColor('#0099ff')
	      .setTitle(`**Uptime**\n${days}d ${hours}h ${minutes}m ${seconds}s`)
	      // .addField('**Uptime**', `${days}d ${hours}h ${minutes}m ${seconds}s`, true)
	      .setTimestamp()
	      .setFooter({ text: footerText, iconURL: footerIcon });
        //exampleEmbed.setThumbnail(client.user!.displayAvatarURL());
        await message.channel.send({ embeds: [exampleEmbed] });
        break;
      
      case 'ping':
        const msg = await message.reply('Pinging...');
        await msg.edit(`Pong! The round trip took ${Date.now() - msg.createdTimestamp}ms.`);
        break;

      case 'say':
      case 'repeat':
        if (args.includes('@everyone')) {return;}
          if (args.includes('@here')) {return;}
            if (args.length > 0) {
              const footerText = message.author.tag;
              const footerIcon = message.author.displayAvatarURL();
              const sayEmbed = new MessageEmbed()
	            .setColor('#0099ff')
	            .setTitle(args.join(' '))
	            .setTimestamp()
	            .setFooter({ text: footerText, iconURL: footerIcon });
              //sayEmbed.setThumbnail(client.user!.displayAvatarURL());
              await message.channel.send({ embeds: [sayEmbed] });
            }
            else await message.reply('You did not send a message to repeat, cancelling command.');
        break;

      case 'setup':
      case 'start':
      case 'ready':
      case 'pengu':
        if (message.author.id === '710738214000001075') {
          message.channel.send('Owner of bot Verified!');
          message.guild.me.setNickname('(-) Pengu!');
        } else {
          message.channel.send('Running setup...');
          message.channel.send('The bot is ready!!');
          message.guild.me.setNickname('(-) Pengu!');
        }
        break;
        
      case 'h':
      case 'help':
        const embed = helpCommand(message);
        embed.setThumbnail(client.user!.displayAvatarURL());
        await message.channel.send({ embeds: [embed] });
        break;
    }
  }
});
keepAlive()
client.login(token);
