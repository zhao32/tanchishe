
import NetMsg, { InnerMsg } from "./com/MsgCfg";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import { Utils } from "./LGQ/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseNode extends Lv_DialogView {

    @property(cc.Node)
    btnHome: cc.Node = null;
    @property(cc.Node)
    btnjixu: cc.Node = null;

    onLoad () {}

    start () {
        GButton.AddClick(this.btnHome, () => {
            this.onClose();
            cc.director.loadScene('start');
        }, this);
        GButton.AddClick(this.btnjixu, () => {
            this.onClose();
            Utils.sendInnerMsg(InnerMsg.gameResume);
        }, this);
    }

    // update (dt) {}
}
