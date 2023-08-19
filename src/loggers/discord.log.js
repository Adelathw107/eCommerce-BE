'use strict'

const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logger is as ${client.user.tag}!`);
})

const token = 'MTE0MjE0NDY5MjI0MzQxOTE3Ng.G2v5Xx.5Ymx1HGyHJk7QmOz8a_sfLRP7wGF1eM37-Vg4I';

client.login(token)

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === 'hello') {
        msg.reply(`Hello! How can i assits you today !`)
    }
})