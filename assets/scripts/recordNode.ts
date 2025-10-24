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
    content: cc.Node = null;

    @property(cc.Node)
    itemPfb: cc.Node = null;

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, this.closeView, this);
        for (let i = 0; i < 10; i++) {
            let item = cc.instantiate(this.itemPfb);
            item.parent = this.content;
            item.active = true;
        }

    }

    // update (dt) {}
}
