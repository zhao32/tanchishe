// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import { Utils } from "./LGQ/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    btnRecharge: cc.Node = null;

    @property(cc.Node)
    btnLeft: cc.Node = null;

    @property(cc.Node)
    btnRight: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemPfb: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, () => { this.closeView() }, this);
        GButton.AddClick(this.btnLeft, this.onLeftHandler, this);
        GButton.AddClick(this.btnRight, this.onRightHandler, this);


        GButton.AddClick(this.btnRecharge, () => {
            Utils.openBundleView('pb/rechargeNode');
        }, this)

        for (let i = 0; i < 6; i++) {
            let item = cc.instantiate(this.itemPfb);
            item.active = true;
            item.y = 30;
            this.content.addChild(item);
        }
    }

    onLeftHandler() {
        this.scrollView.scrollToLeft(0.5);
    }

    onRightHandler() {
        this.scrollView.scrollToRight(0.5);
    }



    // update (dt) {}
}
