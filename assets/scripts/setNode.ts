// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import AudioManager from "./LGQ/AudioManager";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    btnSound: cc.Node = null;

    @property(cc.Node)
    btnMusic: cc.Node = null;

    @property(cc.SpriteFrame)
    chatSp: cc.SpriteFrame[] = [];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, this.closeView, this);
        GButton.AddClick(this.btnSound, this.onBtnSound, this);
        GButton.AddClick(this.btnMusic, this.onBtnMusic, this);
        this.btnSound.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isEffect ? 0 : 1];
        this.btnMusic.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isMusic ? 0 : 1];
    }

    onBtnSound() {
        AudioManager.isEffect = !AudioManager.isEffect;
        this.btnSound.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isEffect ? 0 : 1];
    }

    onBtnMusic() {
        AudioManager.isMusic = !AudioManager.isMusic;
        this.btnMusic.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isMusic ? 0 : 1];
    }

    // update (dt) {}
}
