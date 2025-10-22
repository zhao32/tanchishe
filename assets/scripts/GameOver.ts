
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends Lv_DialogView {

    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(cc.Node)
    btnHome: cc.Node = null;
    @property(cc.Node)
    btnStart: cc.Node = null;

    onLoad () {}

    start () {
        GButton.AddClick(this.btnHome, () => {
            this.onClose();
            cc.director.loadScene('start');
        }, this);
        GButton.AddClick(this.btnStart, () => {
            this.onClose();
            cc.director.loadScene('game');
        }, this);
    }

    openUIData(data: any): void {
        this.lblScore.string = "分数：" + data;
    }

    // update (dt) {}
}
