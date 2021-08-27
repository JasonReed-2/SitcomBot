import * as Discord from 'discord.js'
import { token } from './token.json'
import { SitComLogic } from './sitcom_logic'

const prefix = '?'

const client = new Discord.Client()
const ap = new SitComLogic()

client.on('ready', () => {
    console.log('Ready to go!')
})

client.on('guildMemberSpeaking', (member, speaking) => {
    if (member.user.bot) return
    ap.register_change(member.id, speaking.bitfield)
})

client.on('voiceStateUpdate', (oldState,newState) => {
    if (newState.member.user.bot) return
    if (newState.channel !== null) ap.register_entry()
    else ap.register_change(newState.member.id, 0)
})

client.on('message', async message => {
    if (message.author.bot || message.content[0] != prefix) return
    await ap.register_vc(message.member.voice.channel)
})

client.login(token)