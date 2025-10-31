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
    btnSure: cc.Node = null;

    @property(cc.Label)
    numLabel: cc.Label = null;


    @property(cc.Label)
    desLabel1: cc.Label = null;

    @property(cc.Label)
    desLabel2: cc.Label = null;


    call: Function = null;
    // onLoad () {}

    start() {
        GButton.AddClick(this.btnSure, this.onSure, this);
        GButton.AddClick(this.btnClose, this.onClose, this);
    }

    onClose(): void {
        this.closeView();
    }

    openUIData(data): void {
        this.numLabel.string = data[0];
        this.desLabel1.string = data[1];
        this.desLabel2.string = data[2];
        this.call = data[3];
    }

    onSure(): void {
        if (this.call) {
            this.call();
        }
        this.closeView();
    }



    // update (dt) {}
}
