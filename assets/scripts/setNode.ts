// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { InnerMsg } from "./com/MsgCfg";
import Game from "./Game";
import AudioManager from "./LGQ/AudioManager";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import GameData from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    btnSound: cc.Node = null;

    @property(cc.Node)
    btnMusic: cc.Node = null;

    @property(cc.Node)
    btnLoginOut: cc.Node = null;

    @property(cc.Node)
    btnGameOut: cc.Node = null;



    @property(cc.SpriteFrame)
    chatSp: cc.SpriteFrame[] = [];
    // LIFE-CYCLE CALLBACKS:

    _from: string = "";

    isQuit
    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, this.onClose, this);
        GButton.AddClick(this.btnSound, this.onBtnSound, this);
        GButton.AddClick(this.btnMusic, this.onBtnMusic, this);
        GButton.AddClick(this.btnLoginOut, this.onLoginOut, this);
        GButton.AddClick(this.btnGameOut, this.onOutGame, this);

        this.btnSound.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isEffect ? 0 : 1];
        this.btnMusic.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isMusic ? 0 : 1];
        this.isQuit = false;
    }

    onBtnSound() {
        AudioManager.isEffect = !AudioManager.isEffect;
        this.btnSound.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isEffect ? 0 : 1];
    }

    onBtnMusic() {
        AudioManager.isMusic = !AudioManager.isMusic;
        this.btnMusic.getComponent(cc.Sprite).spriteFrame = this.chatSp[AudioManager.isMusic ? 0 : 1];

        if (AudioManager.isMusic) {//播放音乐
            AudioManager.resumeMusic();
        } else {//停止音乐
            AudioManager.pauseMusic();
        }
    }

    openUIData(from: string = "trun"): void {
        this._from = from;
        if (from == "trun") {
            this.btnLoginOut.active = true;
            this.btnGameOut.active = false;
        } else {
            this.btnLoginOut.active = false;
            this.btnGameOut.active = true;
            GameData.Game.doPause();
        }
    }


    onLoginOut() {
        localStorage.clear();
        Utils.removeAllView();
        cc.director.preloadScene('start');
    }

    onOutGame() {
        let call = () => {
            this.isQuit = true
            this.closeView();
            GameData.Game.quitBySet();
        }
        Utils.openBundleView('pb/commonTipNode', [10, "现在退出将损失", "是否退出？", call, "set"]);
    }

    onClose() {
        this.closeView();
        if (this._from != "trun" && !this.isQuit) {
            Utils.sendInnerMsg(InnerMsg.gameResume);
        }
    }



    // update (dt) {}
}
