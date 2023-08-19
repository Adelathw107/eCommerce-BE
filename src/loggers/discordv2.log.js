'use strict'

const { Client, GatewayIntentBits } = require("discord.js")
const {
    CHANNEL_ID_DISCORD,
    TOKEN_ID_DISCORD
} = process.env
class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })


        this.client.on('ready', () => {
            console.log(`Logger is as ${this.client.user.tag}!`);
        })

        // add channel id
        this.channelId = CHANNEL_ID_DISCORD;

        this.client.login(TOKEN_ID_DISCORD)

        this.client.on('messageCreate', msg => {
            if (msg.author.bot) return;
            if (msg.content === 'hello') {
                msg.reply(`Hello! How can i assits you today !`)
            }
        })
    }


    sendToFormatCode(logData) {
        const { code, message = 'This is some additional information about the code', title = "Code Example" } = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage)

    }
    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error(`Couldn't find the channel...`, this.channelId)
            return
        }
        channel.send(message).catch(e => console.error(e))
    }

}


module.exports = new LoggerService()