// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;


    @property(cc.Node)
    btnRecharge: cc.Node = null;

    @property(cc.EditBox)
    editBpx: cc.EditBox = null;


    rechargeIdxx: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.editBpx.node.active = false;
        GButton.AddClick(this.btnClose, this.closeView, this);
        GButton.AddClick(this.btnRecharge, this.onRechargeClick, this);
    }

    onToggleClick(event, customEventData) {
        this.rechargeIdxx = parseInt(customEventData);
        if (this.rechargeIdxx == 3) {
            this.editBpx.node.active = true;
        } else {
            this.editBpx.node.active = false;
        }
    }

    onRechargeClick() {

    }

    // update (dt) {}
}
