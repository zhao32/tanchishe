// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PromptFly from "./com/PromptFly";
import EventManager from "./LGQ/EventManager";
import GameData from "./LGQ/UserInfo";
import xhrSupport from "./LGQ/xhrSupport";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;


    @property(cc.Label)
    stateLabel: cc.Label = null;

    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;

    @property(cc.Node)
    btnBuy: cc.Node = null;

    @property(cc.Node)
    btnUse: cc.Node = null;

    // @property(cc.Node)
    // useState: cc.Node = null;


    _data

    // onLoad () {}

    start() {

    }

    init(data) {
        this._data = data
        this.nameLabel.string = data.name

        if (data.is_have) {
            this.btnBuy.active = false
            this.priceLabel.node.parent.active = false
            if (data.use_status) {
                this.btnUse.active = false
                // this.useState.active = true
                this.stateLabel.string = "使用中"
            } else {
                this.btnUse.active = true
                // this.useState.active = false
                this.stateLabel.string = "已拥有"
            }
        } else {
            // this.useState.active = false
            this.priceLabel.node.parent.active = true
            this.btnBuy.active = true
            this.btnUse.active = false
            this.priceLabel.string = data.price
            this.stateLabel.string = ""
        }

        cc.assetManager.loadRemote(xhrSupport.httpUrl + data.cover_image, (err, texture: any) => {
            if (err) {
                cc.error(err.message || err);
                return;
            } else {
                this.iconSprite.spriteFrame = new cc.SpriteFrame(texture);
            }
        })

        // cc.assetManager.loadRemote(xhrSupport.httpUrl + data.scenc_image, (err, texture: any) => {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     } else {
        //         this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        //     }
        // })
    }

    onBuySkin() {
        xhrSupport.buySkin(this._data.id, (res) => {
            res = JSON.parse(res)
            if (res.code == 1) {
                this._data.is_have = true
                this.btnBuy.active = false
                this.btnUse.active = true
                this.priceLabel.node.parent.active = false
                GameData.userInfo.score -= this._data.price
                EventManager.getInstance().sendListener(EventManager.UPDATE_SCORE, this._data.id)
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })
    }

    onUseSkin() {
        xhrSupport.useSkin(this._data.id, (res) => {
            res = JSON.parse(res)
            if (res.code == 1) {
                GameData.userInfo.skinId = this._data.id
                // this.btnUse.active = false
                // this.useState.active = true

                EventManager.getInstance().sendListener(EventManager.CHANGE_SKIN, this._data.id)
                //更新列表
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })

    }

    // onSelct() {
    //     this.btnUse.active = true
    //     this.useState.active = false
    //     this._data.use_status = 1
    // }

    // unSelect() {
    //     this.btnUse.active = false
    //     this.useState.active = true
    //     this._data.use_status = 0
    // }

    // update (dt) {}
}
