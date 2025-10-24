// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PromptFly from "./com/PromptFly";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    btnRegister: cc.Node = null;

    @property(cc.Node)
    btnGetCode: cc.Node = null;

    @property(cc.EditBox)
    accountEidt: cc.EditBox = null;

    @property(cc.EditBox)
    codeEidt: cc.EditBox = null;

    @property(cc.EditBox)
    pwdEidt: cc.EditBox = null;

    @property(cc.Toggle)
    pwdToggle: cc.Toggle = null;


    // onLoad () {}

    start() {
        GButton.AddClick(this.btnClose, this.onClose, this);
        GButton.AddClick(this.btnRegister, this.onRegister, this);
        GButton.AddClick(this.btnGetCode, this.onGetCode, this);

    }


    onClose(): void {
        this.closeView();
    }

    onGetCode(): void {
        if (this.accountEidt.string == '') {
            PromptFly.Show('请输入邮箱');
            return;
        }
    }

    onRegister() {
        if (this.accountEidt.string == '') {
            PromptFly.Show('请输入邮箱');
            return;
        }

        if (this.codeEidt.string == '') {
            PromptFly.Show('请输入验证码');
            return;
        }

        if (this.pwdEidt.string == '') {
            PromptFly.Show('请输入密码');
            return;
        }
    }

    onTogglePwd() {
        this.pwdEidt.inputFlag = this.pwdToggle.isChecked ? cc.EditBox.InputFlag.PASSWORD : cc.EditBox.InputFlag.DEFAULT;
    }


    // update (dt) {}
}
