// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { InnerMsg } from "./com/MsgCfg";
import PromptFly from "./com/PromptFly";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import { Utils } from "./LGQ/Utils";
import xhrSupport from "./LGQ/xhrSupport";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    btnSure: cc.Node = null;


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

    }

    onSure(): void {
        xhrSupport.delectAccount((res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                this.closeView();
                localStorage.clear();
                Utils.removeAllView();
                cc.director.loadScene("start")
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })

    }



    // update (dt) {}
}
