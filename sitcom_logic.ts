import * as Discord from 'discord.js'
import * as as from './audio_structure.json'

interface audio_category {
    AudioOptions: Array<string>
    CanInterupt: boolean
}

function select_random<T>(input: Array<T>): T {
    return input[Math.floor(Math.random()*input.length)]
}

function percent_chance(percent: number): boolean {
    return Math.random() < percent ? true : false
}

export class SitComLogic {
    private speakingMembers = new Set()
    private playing = false
    private connection: Discord.VoiceConnection
    private dispatcher: Discord.StreamDispatcher

    async register_vc(vc: Discord.VoiceChannel) {
        return new Promise((resolve, err) => {
            vc.join().then(connection => {
                this.connection = connection
                resolve('')
            })
        })
    }

    register_change(id: string, speaking:number) {
        if (speaking===1) this.speakingMembers.add(id)
        else this.speakingMembers.delete(id)
        if (percent_chance(.25) && this.speakingMembers.size == 0) {this.play_audio(as.category['laugh'])}
    }

    register_entry() {
        this.play_audio(as.category['entry'])
    }

    play_audio(input: audio_category) {
        if (!this.connection) {console.log('No Voice Channel Connection!'); return}
        if (this.playing && !input.CanInterupt) return
        
        const audio_src = select_random(input.AudioOptions)
        this.dispatcher = this.connection.play(audio_src, {volume: 0.75})

        this.playing = true
        this.dispatcher.on('finish', () => this.playing = false)
    }
}