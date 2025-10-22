
import PromptFly from "./com/PromptFly";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import ResManager from "./LGQ/ResManager";
import { Utils } from "./LGQ/Utils";
import ModelPlayer from "./model/ModelPlayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends Lv_DialogView {

    @property(cc.Node)
    btnStart: cc.Node = null;
    @property(cc.Node)
    btnRank: cc.Node = null;
    @property(cc.Node)
    btnShuoming: cc.Node = null;
    @property(cc.Node)
    ndBG: cc.Node = null;

    onLoad () {
        // ResManager.I.changePic(this.ndBG, "https://tanchishedw.xinzhiyukeji.cn/uploads/home_btn.png");
    }

    start () {
        GButton.AddClick(this.btnStart, () => {
            if (ModelPlayer.I.gameClose == 1) {
                PromptFly.Show("游戏已关闭");
                return;
            }
            cc.director.loadScene('game');
        }, this);
        GButton.AddClick(this.btnRank, () => {
            Utils.openBundleView("pb/RankNode")
        }, this);
        GButton.AddClick(this.btnShuoming, () => {
            Utils.openBundleView("pb/ShuomingNode")
        }, this);
    }

    // update (dt) {}
}
