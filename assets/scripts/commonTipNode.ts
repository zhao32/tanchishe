// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { InnerMsg } from "./com/MsgCfg";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import { Utils } from "./LGQ/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    btnSure: cc.Node = null;

    @property(cc.Label)
    numLabel: cc.Label = null;


    @property(cc.Label)
    desLabel1: cc.Label = null;

    @property(cc.Label)
    desLabel2: cc.Label = null;

    from
    call: Function = null;
    // onLoad () {}

    start() {
        GButton.AddClick(this.btnSure, this.onSure, this);
        GButton.AddClick(this.btnClose, this.onClose, this);
    }

    onClose(): void {
        this.closeView();
        if (this.from != "set") Utils.sendInnerMsg(InnerMsg.gameResume);

    }

    openUIData(data): void {
        this.numLabel.string = data[0];
        this.desLabel1.string = data[1];
        this.desLabel2.string = data[2];
        this.call = data[3];
        this.from = data[4];
    }

    onSure(): void {
        if (this.call) {
            this.call();
        }
        this.closeView();
        if (this.from != "set" && this.from != "over") Utils.sendInnerMsg(InnerMsg.gameResume);
    }



    // update (dt) {}
}
