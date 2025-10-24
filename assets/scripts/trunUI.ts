// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import { Utils } from "./LGQ/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnSet: cc.Node = null;

    @property(cc.Node)
    btnRecharge: cc.Node = null;

    @property(cc.Node)
    btnSkin: cc.Node = null;

    @property(cc.Node)
    btnRecord: cc.Node = null;

    @property(cc.Node)
    btnStart: cc.Node = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;

    sceneIdx = 0
    difficultyValue = 0

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnSet, () => {
            Utils.openBundleView('pb/setNode');
        }, this)

        GButton.AddClick(this.btnRecharge, () => {
            Utils.openBundleView('pb/rechargeNode');
        }, this)

        GButton.AddClick(this.btnSkin, () => {
            Utils.openBundleView('pb/skinNode');
        }, this)

        GButton.AddClick(this.btnRecord, () => {
            Utils.openBundleView('pb/recordNode');
        }, this)

        GButton.AddClick(this.btnStart, () => {
            let call = () => {
                this.onClose();
                cc.director.loadScene('game');
            }
            Utils.openBundleView('pb/commonTipNode', [10, "进入游戏", call]);
        }, this)
    }

    onToggleScene(event, customEventData) {
        this.sceneIdx = parseInt(customEventData)
    }

    onToggleDifficulty(event, customEventData) {
        this.difficultyValue = parseInt(customEventData)
    }

    // update (dt) {}
}
