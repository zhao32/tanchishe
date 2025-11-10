// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PromptFly from "./com/PromptFly";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import xhrSupport from "./LGQ/xhrSupport";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.RichText)
    text: cc.RichText = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Node)
    btnClose: cc.Node = null;
    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, this.onClose, this);

    }

    openUIData(data: any): void {
        this.titleLabel.string = data == "user" ? "用户协议" : "隐私协议"

        xhrSupport.getProtrol(data, (res: any) => {
            res = JSON.parse(res)
            if (res.code == 1) {
                this.text.string = `<color=#000000>${res.data.editor}</c>`
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })
    }



    // update (dt) {}
}
