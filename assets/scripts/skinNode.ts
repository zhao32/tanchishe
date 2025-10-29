// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PromptFly from "./com/PromptFly";
import EventManager from "./LGQ/EventManager";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import GameData from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";
import xhrSupport from "./LGQ/xhrSupport";
import skinItem from "./skinItem";

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

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    dataList
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, () => { this.closeView() }, this);
        GButton.AddClick(this.btnLeft, this.onLeftHandler, this);
        GButton.AddClick(this.btnRight, this.onRightHandler, this);


        GButton.AddClick(this.btnRecharge, () => {
            Utils.openBundleView('pb/rechargeNode');
        }, this)

        this.scoreLabel.string = GameData.userInfo.score + '';

        xhrSupport.getSkinList(1, 100, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                this.dataList = res.data.list;
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = cc.instantiate(this.itemPfb);
                    item.active = true;
                    item.y = 30;
                    this.content.addChild(item);
                    item.getComponent(skinItem).init(res.data.list[i]);
                }
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })


    }

    protected onEnable(): void {
        EventManager.getInstance().registerListener(EventManager.CHANGE_SKIN, this, this.updateSkin.bind(this));

    }

    updateSkin(id) {
        // for (let i = 0; i < this.content.children.length; i++) {
        //     if (this.content.children[i].getComponent(skinItem)._data.id == id) {
        //         this.content.children[i].getComponent(skinItem).onSelct();
        //     } else {
        //         this.content.children[i].getComponent(skinItem).unSelect();

        //     }
        // }
        xhrSupport.getSkinList(1, 100, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                this.dataList = res.data.list;
                for (let i = 0; i < this.content.children.length; i++) {
                    let item = this.content.children[i]
                    item.getComponent(skinItem).init(res.data.list[i]);
                }
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })


    }

    protected onDisable(): void {

    }

    onLeftHandler() {
        this.scrollView.scrollToLeft(0.5);
    }

    onRightHandler() {
        this.scrollView.scrollToRight(0.5);
    }



    // update (dt) {}
}
