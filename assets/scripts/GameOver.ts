
import PromptFly from "./com/PromptFly";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import GameData from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";
import xhrSupport from "./LGQ/xhrSupport";
import AudioManager from "./LGQ/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOver extends Lv_DialogView {

    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(cc.Node)
    btnHome: cc.Node = null;
    @property(cc.Node)
    btnStart: cc.Node = null;

    onLoad() { }

    start() {
        GButton.AddClick(this.btnHome, () => {
            this.onClose();
            // cc.director.loadScene('start');
            Utils.openBundleView('pb/trunUI')
        }, this);
        // GButton.AddClick(this.btnStart, () => {
        //     this.onClose();
        //     cc.director.loadScene('game');
        // }, this);

        GButton.AddClick(this.btnStart, this.restartGame.bind(this), this);
    }

    openUIData(data: any): void {
        this.lblScore.string = data + "m";
        GameData.Game.doPause();
        AudioManager.playEffect("sound_lose");

    }

    restartGame() {
        let call = () => {
            this.onClose();
            Utils.removeAllView();
            xhrSupport.enterGameByScore(GameData.sceneTypeId, (res) => {
                res = JSON.parse(res);
                if (res.code == 1) {
                    this.onClose();
                    cc.director.loadScene('game');
                    GameData.userInfo.score -= 10
                    GameData.sceneId = res.data.id
                } else {
                    PromptFly.Show(res.msg);
                }
            }, () => { })
        }
        Utils.openBundleView('pb/commonTipNode', [10, "是否消耗", "重玩游戏", call]);
    }

    // update (dt) {}
}
