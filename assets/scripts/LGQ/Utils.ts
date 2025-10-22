import GameRoot from "../com/GameRoot";
import NetMsg, { HttpType, InnerMsg } from "../com/MsgCfg";
// import { GameNet } from "./GameNetManager";
import HttpUtils from "./HttpUtils";
import Lv_DialogView from "./Lv_DialogView";
// import { CallbackObject, IRequestProtocol } from "./NetInterface";
import ResManager from "./ResManager";

const NumType = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
    10: "十",
};

const { ccclass, property } = cc._decorator;

@ccclass
export class Utils {

    static isLogin = false;

    static loginUrl = "https://moonlake.site/";
    static payUrl = "https://moonlake.site/pay.html";
    static shareUrl = "https://moonlake.site/#";

    static curNandu = 1;
    static zhangjieId = 1;
    static levelId = 1;

    private static eventTarget: any = null;
    private static openViewArr = [];

    //打开bundle预制体页面
    static openBundleView(url: string, openData?: any) {
        let urlArr = url.split("/");
        let name = urlArr[urlArr.length - 1];
        if (this.openViewArr.indexOf(name) >= 0) {
            cc.log("当前页面已打开");
            return;
        }
        
        this.openViewArr.push(name);
        ResManager.I.loadBundlePrefab(url, (pb) => {
            if (pb) {
                let view = cc.instantiate(pb);
                GameRoot.I.openNode.addChild(view);
                let dialogView: Lv_DialogView = view.getComponent(Lv_DialogView);
                if (openData && dialogView) {
                    dialogView.openUIData(openData);
                }
            } else {
                let index = this.openViewArr.indexOf(name);
                if (index >= 0) {
                    this.openViewArr.splice(index, 1);
                }
            }
        });
    }
    //关闭页面
    static removeView(name: string) {
        for (let i = 0; i < GameRoot.I.openNode.childrenCount; i++) {
            let node = GameRoot.I.openNode.children[i];
            if (cc.isValid(node) && node.name == name) {
                node.removeFromParent();
                node.destroy();
                let index = this.openViewArr.indexOf(name);
                if (index >= 0) {
                    this.openViewArr.splice(index, 1);
                }
            }
        }
    }
    //关闭所有页面
    static removeAllView() {
        GameRoot.I.openNode.removeAllChildren();
        this.openViewArr = [];
    }

    //  事件
    static sendInnerMsg(type, data?) {
        this.initEvent();
        this.eventTarget.emit(type, data);
    }
    static addInnerMsg(type, target, func) {
        this.initEvent();
        this.eventTarget.on(type, func, target);
    }
    static removeInnerMsg(type, target?, func?) {
        this.initEvent();
        this.eventTarget.off(type, func, target);
    }
    static initEvent() {
        if (!this.eventTarget) {
            this.eventTarget = new cc.EventTarget();
        }
    }

    static sendNetMsg(urlData, data?, func?) {
        // cc.log("数据请求参数", urlData.url, data);
        if (urlData) {
            if (urlData.type == HttpType.POST) {
                HttpUtils.httpPost(urlData, data, func);
            } else {
                HttpUtils.httpGets(urlData, data, func);
            }
        }
    }

    // static sendNetSocketMsg(method: string, data: any, rspObject: CallbackObject, showTips: boolean = true, force: boolean = false) {
    //     // cc.log("数据请求参数", method, data);
    //     // data["curtime"] = GameRoot.I.getServerTime();
    //     let protocol: IRequestProtocol = {
    //         action: method,
    //         data: data,
    //         // isCompress: false
    //     }
    //     // return this.request(protocol, rspObject, showTips, force);
    //     return GameNet.game!.request(protocol, rspObject, showTips, force);
    // }

    // static addNetSocketMsg(type, target, func) {
    //     GameNet.game?.addResponeHandler(type, func, target);
    // }
    // static removeNetSocketMsg(type, target?, func?) {
    //     GameNet.game?.removeResponeHandler(type, func, target);
    // }
    

    static setConvertNum(num: number) {
        if (num >= 100) {
            return num;
        }
        let numStr = "";
        let num1 = Math.floor(num / 10);
        let num2 = Math.floor(num % 10);
        if (num1 > 0) {
            if (num1 == 1) {
                numStr += "十";
            } else {
                numStr += (NumType[num1] + "十");
            }
        }
        if (num2 > 0) {
            numStr += NumType[num2];
        }
        return numStr;
    }

    static getTimeStr(time, isHour = false) {
        var seperator1 = "-";
        var seperator2 = ":"
        let date = new Date(time);
        let year = date.getFullYear();
        let mon: any = date.getMonth() + 1;
        let day: any = date.getDate();
        let h: any = date.getHours();
        let m: any = date.getMinutes();
        let s: any = date.getSeconds();
        
        if (mon < 10 && mon > 0) {
            mon = "0" + mon;
        }
        if (day < 10 && day > 0) {
            day = "0" + day;
        }
        if (h < 10 && h >= 0) {
            h = "0" + h;
        }
        if (m < 10 && m >= 0) {
            m = "0" + m;
        }
        if (s < 10 && s >= 0) {
            s = "0" + s;
        }
        let str = year + seperator1 + mon + seperator1 + day;
        if (isHour) {
            str = str + " " + h + seperator2 + m + seperator2 + s;
        }
        return str;
    }

    private static pageTimeOut;
    static DisEnablePage(time = 0.5) {
        GameRoot.I.DisEnablePage();
        this.pageTimeOut = setTimeout(() => {
            this.EnablePage();
        }, time*1000);
    }

    static EnablePage() {
        GameRoot.I.EnablePage();
        if (this.pageTimeOut) {
            clearTimeout(this.pageTimeOut);
            this.pageTimeOut = null;
        }
    }

    static getDistance(p1, p2) {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static getUserInfo() {
        // Utils.sendNetMsg(NetMsg.getUserInfo, null, (msg) => {
        //     Utils.sendInnerMsg(InnerMsg.updatePlayerData, msg.data.user_info);
        // });
    }

}
