
const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    static isEffect = true;
    static isMusic = true;
    private static musicID = null;
    private static _audioRecords = {};

    static playEffect(eftName: string, volume: number = 1) {
        if (!this.isEffect) {
            return;
        }
        const cachedClip = this._audioRecords[eftName];
        if (cachedClip) {
            cc.audioEngine.play(cachedClip, false, volume);
            return;
        }
        cc.resources.load('music/' + eftName, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
            if (!err) {
                this._audioRecords[eftName] = audioClip;
                cc.audioEngine.play(audioClip, false, volume);
            }
        });
    }

    static playMusic(name: string, volume: number = 1) {
        let vol = volume;
        if (!this.isMusic) {
            vol = 0;
        }
        if (this.musicID) {
            cc.audioEngine.stop(this.musicID);
        }
        
        const cachedClip = this._audioRecords[name];
        if (cachedClip) {
            this.musicID = cc.audioEngine.play(cachedClip, true, vol);
            return;
        }
        cc.resources.load('music/' + name, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
            if (!err) {
                this._audioRecords[name] = audioClip;
                this.musicID = cc.audioEngine.play(audioClip, true, vol);
            }
        });
    }

    static stopMusic() {
        cc.audioEngine.stop(this.musicID);
    }

    static pauseMusic() {
        cc.audioEngine.setVolume(this.musicID, 0);
    }

    static resumeMusic() {
        cc.audioEngine.setVolume(this.musicID, 1);
    }

    static updateMusic(data) {
        if (data) {
            if (this.isMusic != data.isMusic) {
                if (data.isMusic) {
                    this.resumeMusic();
                } else {
                    this.pauseMusic();
                }
                this.isMusic = data.isMusic;
            }
            this.isEffect = data.isEffect;
        }
    }
}
