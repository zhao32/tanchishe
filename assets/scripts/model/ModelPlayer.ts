
import { InnerMsg } from "../com/MsgCfg";
import { Utils } from "../LGQ/Utils";

export default class ModelPlayer {

    private static _I: ModelPlayer = null;
    static get I() {
        if (!this._I) {
            this._I = new ModelPlayer();
            this._I.init();
        }
        return this._I;
    }

    isTeam = false;

    id = '';
    openid;
    unionid;
    mobile;
    isNewPlayer;
    token = '';
    addr = '';
    at = "";

    name = '';
    avatar = '';
    Diamond = 0;
    Gold = 0;
    XNGold = 0;

    battleData: any = {};

    notice = [];
    friends = [];
    dogSite = [];

    userData: any;
    home_level = 1;
    home_name = '';
    gameClose = 2;

    init() {
        Utils.addInnerMsg(InnerMsg.updatePlayerData, this, this.updatePlayerData);
    }

    updatePlayerData(data) {
        if (!data) {
            return;
        }

        //用户是否为新用户
        if (data.new || data.new <= 0) {
            this.isNewPlayer = data.new <= 0;
        }
        //用户token
        if (data.token) {
            this.token = data.token;
        }

        //用户手机号
        if (data.mobile) {
            this.mobile = data.mobile;
        }
        //用户openid
        if (data.openid) {
            this.openid = data.openid;
        }

        //用户ID
        if (data.id) {
            this.id = data.id;
        }
        //用户名字
        if (data.name) {
            this.name = data.name;
            Utils.sendInnerMsg(InnerMsg.updatePlayerInfo);
        }
        //用户头像
        if (data.avatar) {
            this.avatar = data.avatar;
            Utils.sendInnerMsg(InnerMsg.updatePlayerInfo);
        }
        //用户金币
        if (data.mp_commission >= 0) {
            this.Gold = data.mp_commission;
            Utils.sendInnerMsg(InnerMsg.updateCurrent);
        }
        //用户钻石
        if (data.account >= 0) {
            this.Diamond = data.account;
            Utils.sendInnerMsg(InnerMsg.updateCurrent);
        }
        //用户虚拟币
        if (data.XNGold >= 0) {
            this.XNGold = data.XNGold;
            Utils.sendInnerMsg(InnerMsg.updateCurrent);
        }

        //好友列表
        if (data.haoyou) {
            this.friends = [];
            for (let i = 0; i < data.haoyou.length; i++) {
                let d = data.haoyou[i];
                this.friends.push(d);
            }
        }

        //狗场列表
        if (data.dogSite) {
            this.dogSite = [];
            for (let i = 0; i < data.dogSite.length; i++) {
                let d = data.dogSite[i];
                this.dogSite.push(d);
            }
        }

        //公会
        if (data.group_id) {
            this.userData.group_id = data.group_id;
        }

        //狗舍名字
        if (data.home_name) {
            this.home_name = data.home_name;
        }
        //狗舍等级
        if (data.home_level) {
            this.home_level = data.home_level;
            Utils.sendInnerMsg(InnerMsg.upgradeHome);
        }

        // cc.log("数据更新", data, this.fighting_capacity);
    }

    updatePlayerNotice(data) {
        this.notice.push(data);
    }

    private timer = null;
    startHeartbeat() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                Utils.getUserInfo();
            }, 3000);
        }
    }
    closeHeartbeat() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

}
