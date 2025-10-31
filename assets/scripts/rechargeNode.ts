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
    btnRecharge: cc.Node = null;

    @property(cc.EditBox)
    editBpx: cc.EditBox = null;

    @property(cc.Node)
    box: cc.Node = null;


    @property(cc.Node)
    item: cc.Node = null;

    selectIdx = 0;


    rechargeIdx: number = 0;

    rechargeData: any[] = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.editBpx.node.active = false;
        GButton.AddClick(this.btnClose, this.closeView, this);
        GButton.AddClick(this.btnRecharge, this.onRechargeClick, this);

        xhrSupport.getRechargeList((res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                this.rechargeData = res.data.list;
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = cc.instantiate(this.item);
                    item.parent = this.box;
                    item.active = true;
                    item.y = 0;

                    if (i == 0) {
                        item.getChildByName("checkmark").active = true;
                    } else {
                        item.getChildByName("checkmark").active = false;
                    }

                    item.getChildByName("prizeLabel").getComponent(cc.Label).string = res.data.list[i].price;
                    item.getChildByName("scoreLabel").getComponent(cc.Label).string = res.data.list[i].score;
                    // item.getComponent("rechargeItem").init(res.data.list[i]);

                    item.on(cc.Node.EventType.TOUCH_END, () => {
                        for (let j = 0; j < this.box.children.length; j++) {
                            this.box.children[j].getChildByName("checkmark").active = false;
                        }
                        item.getChildByName("checkmark").active = true;
                        this.rechargeIdx = i;
                    }, this)
                }
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })
    }



    onRechargeClick() {
        // if (!this.rechargeIdx) {
        //     PromptFly.Show("请选择充值金额");
        //     return;
        // }

        xhrSupport.doRecharge(this.rechargeData[this.rechargeIdx].id, "applepay", (res) => {

        }, () => { })

    }

    // update (dt) {}
}
