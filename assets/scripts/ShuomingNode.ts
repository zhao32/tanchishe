
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import ResManager from "./LGQ/ResManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShuomingNode extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;
    @property(cc.Node)
    ndBG: cc.Node = null;

    
    onLoad () {
        // ResManager.I.changePic(this.ndBG, "https://tanchishedw.xinzhiyukeji.cn/uploads/activity_desc.png");
    }

    start () {
        GButton.AddClick(this.btnClose, () => {
            this.onClose();
        }, this);
    }

    // update (dt) {}
}
