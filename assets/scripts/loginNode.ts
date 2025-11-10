// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PromptFly from "./com/PromptFly";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import GameData from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";
import xhrSupport from "./LGQ/xhrSupport";

const { ccclass, property } = cc._decorator;

@ccclass
export default class loginNode extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.EditBox)
    accountEidt: cc.EditBox = null;

    @property(cc.EditBox)
    codeEidt: cc.EditBox = null;

    @property(cc.Toggle)
    checkToggle: cc.Toggle = null;

    @property(cc.Node)
    btnRegister: cc.Node = null;

    @property(cc.Node)
    btnRestPwd: cc.Node = null;

    @property(cc.Node)
    btnLogin: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, this.onClose, this);
        GButton.AddClick(this.btnRegister, this.onRegister, this);
        GButton.AddClick(this.btnRestPwd, this.onResetPwd, this);
        GButton.AddClick(this.btnLogin, this.onLoginHandler, this);
        GButton.AddClick(this.btnClose, this.onClose, this);

    }



    onResetPwd() {
        Utils.openBundleView("pb/getPwdNode", "找回");
    }

    onRegister() {
        Utils.openBundleView('pb/registerNode');
    }

    onProtocol(target, data) {
        Utils.openBundleView('pb/protrolNode', data);
    }

    onClose(): void {
        this.closeView();
    }

    onLoginHandler(): void {
        if (this.accountEidt.string == '' || this.codeEidt.string == '') {
            PromptFly.Show('请输入邮箱和密码');
            return;
        }

        if (!this.checkToggle.isChecked) {
            PromptFly.Show('请阅读并同意《用户协议》，《隐私政策》');
            return;
        }
        // Utils.openBundleView('pb/trunUI');

        xhrSupport.loginHtml(this.accountEidt.string, this.codeEidt.string, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                Utils.openBundleView('pb/trunUI');
                this.closeView();
                GameData.userInfo = res.data.userInfo
                cc.sys.localStorage.setItem("tcsToken", res.data.userInfo.token);
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })
    }


    // update (dt) {}
}
