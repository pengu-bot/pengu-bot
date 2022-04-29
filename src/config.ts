import { Intents } from 'discord.js';

export default {
  prefix: '-',
  token: process.env.DISCORD_TOKEN,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
}
