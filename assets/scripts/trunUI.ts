// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PromptFly from "./com/PromptFly";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import GameData from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";
import xhrSupport from "./LGQ/xhrSupport";

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
    scoreLabel: cc.Label = null;


    sceneDataList = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnSet, () => {
            Utils.openBundleView('pb/setNode', "trun");
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
                xhrSupport.enterGameByScore(this.sceneDataList[GameData.sceneIdx].id, (res) => {
                    res = JSON.parse(res);
                    if (res.code == 1) {
                        Utils.removeAllView();
                        cc.director.loadScene('game');
                        GameData.userInfo.score -= 10
                        GameData.sceneId = res.data.id
                        GameData.sceneTypeId = this.sceneDataList[GameData.sceneIdx].id
                    } else {
                        PromptFly.Show(res.msg);
                    }
                }, () => { })
            }
            Utils.openBundleView('pb/commonTipNode', [10, "是否消耗", "并进入游戏", call]);
        }, this)

        this.scoreLabel.string = GameData.userInfo.score.toString()

        xhrSupport.getSceneList(1, 100, (res) => {
            res = JSON.parse(res)
            if (res.code == 1) {
                this.sceneDataList = res.data.list
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })
    }

    onToggleScene(event, customEventData) {
        GameData.sceneIdx = parseInt(customEventData)
    }

    onToggleDifficulty(event, customEventData) {
        GameData.difficultyValue = parseInt(customEventData)
    }

    // update (dt) {}
}
