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

    @property(cc.SpriteFrame)
    coinFrames: cc.SpriteFrame[] = [];

    selectIdx = 0;


    rechargeIdx: number = 0;

    rechargeData: any[] = []

    // LIFE-CYCLE CALLBACKS:

    onLoad() {// 暴露方法到 window 全局，供 iOS 调用
        window["gameCallFromiOS"] = this.gameCallFromiOS.bind(this);
        window["gameCallWithParams"] = this.gameCallWithParams.bind(this);

        if (cc.sys.platform == cc.sys.IPHONE) {
            // 初始化 iOS 内购
            jsb.reflection.callStaticMethod("IAPBridge", "initIAP", null);
            console.log("[IAP] iOS 内购已初始化");
        }

        // this.gameCallWithParams("123", "456")
    }

    /**
     * iOS 调用的无参方法
     */
    gameCallFromiOS() {
        console.log("iOS 调用了 Cocos 的无参方法");
        // 业务逻辑：如显示弹窗、播放音效等
    }

    /**
     * iOS 调用的带参数方法（支持多参数、复杂对象）
     */
    gameCallWithParams(receipt_data: string, order_sn: string) {
        console.log("iOS 传参：", receipt_data, order_sn);
        // 业务逻辑：如更新UI、处理数据等
        // receipt_data = "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"
        // order_sn = "2025120357555610"
        xhrSupport.RechargeCheck(receipt_data, order_sn, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                GameData.userInfo.score += this.rechargeData[this.rechargeIdx].score
                EventManager.getInstance().sendListener(EventManager.UPDATE_SCORE)
                this.closeView();
            }
            PromptFly.Show(res.msg);

        }, () => { });
    }

    /**
     * （可选）有返回值的方法（iOS 可获取返回值）
     */
    gameCallWithReturn(): string {
        return "Cocos 返回给 iOS 的数据";
    }



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

                    let idx = i > 2 ? 2 : i;
                    item.getChildByName("coin").getComponent(cc.Sprite).spriteFrame = this.coinFrames[idx];

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


    // 点击充值按钮
    onRechargeClick() {
        let productId = this.rechargeData[this.rechargeIdx].id;
        // 映射到 Apple 的产品ID
        // let appleProductId = this.getAppleProductId(productId);
        xhrSupport.doRecharge(productId, "applepay", (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                this.payment({
                    appleProductId: this.rechargeData[this.rechargeIdx].product_tag, orderSn: res.data.data.order_sn,
                    success: (data) => {
                        // console.log('data', data);
                    }
                })
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })
    }

    /**
     * 支付
     * {
     *   provider: 'wxpay' | alipay, // app 必填
     *   data: '',
     * }
     */
    public payment(data?: any) {
        console.log('ios支付', JSON.stringify(data));
        const orderSn = data.orderSn;           // 订单号
        const appleProductId = data.appleProductId;
        console.log(`[IAP] 开始内购: 订单=${orderSn}, Apple产品=${appleProductId}`);
        if (cc.sys.platform == cc.sys.IPHONE) {
            // 获取服务器返回的数据
            const orderSn = data.orderSn;           // 订单号
            const appleProductId = data.appleProductId;
            console.log(`[IAP] 开始内购: 订单=${orderSn}, Apple产品=${appleProductId}`);
            // 调用 iOS 原生方法发起购买
            jsb.reflection.callStaticMethod(
                "IAPBridge",
                "purchaseProduct:orderSn:",
                appleProductId,    // Apple 商品 ID
                orderSn            // 订单号
            );
        }
        else if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
        } else if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        } else {
            if (data?.success) data.success();
        }
    }


    // // 3️⃣ Apple 产品 ID 映射表
    // private getAppleProductId(productId: string): string {
    //     // 将你服务器的产品ID映射到 App Store Connect 的商品ID
    //     const productMap = {
    //         '1': 'com.gameios.bztcs.app.gold01',      // 10金币
    //         '2': 'com.gameios.bztcs.app.gold02',      // 60金币
    //         '3': 'com.gameios.bztcs.app.gold03',     // 120金币
    //         '4': 'com.gameios.bztcs.app.gold04',     // 580金币
    //     };

    //     return productMap[productId] || 'com.yourcompany.yourapp.default';
    // }


    // update (dt) {}
}
