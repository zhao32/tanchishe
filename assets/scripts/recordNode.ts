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

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemPfb: cc.Node = null;

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, this.closeView, this);
        this.content.removeAllChildren();
        xhrSupport.getScoreList(1, 10000, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = cc.instantiate(this.itemPfb);
                    item.parent = this.content;
                    item.active = true;
                    item.getChildByName('desLabel').getComponent(cc.Label).string = res.data.list[i].memo;
                    let score = res.data.list[i].after - res.data.list[i].before;
                    item.getChildByName('scoreLabel').getComponent(cc.Label).string = score > 0 ? '+' + score : "" + score;

                    // create_time
                    let time = new Date(res.data.list[i].create_time * 1000).toLocaleString();
                    item.getChildByName('timeLabel').getComponent(cc.Label).string = time + ''
                }

            } else {
                PromptFly.Show(res.msg);
            }

        }, () => { })

    }

    // update (dt) {}
}
