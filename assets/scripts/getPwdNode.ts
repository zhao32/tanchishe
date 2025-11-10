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
    btnChangePwd: cc.Node = null;

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

    @property(cc.Sprite)
    sp: cc.Sprite = null;

    @property(cc.SpriteFrame)
    spFrames: cc.SpriteFrame[] = [];

    @property(cc.Label)
    cutDownLab: cc.Label = null;

    time = 30

    start() {
        GButton.AddClick(this.btnClose, this.onClose, this);
        GButton.AddClick(this.btnChangePwd, this.onChangePwd, this);
        GButton.AddClick(this.btnGetCode, this.onGetCode, this);
        this.time = 30;
        this.cutDownLab.node.parent.active = false;
    }

    openUIData(data: any): void {


        if (data == "找回") {
            this.sp.spriteFrame = this.spFrames[0];
        } else {
            this.sp.spriteFrame = this.spFrames[1];
        }
    }


    onClose(): void {
        this.closeView();
    }

    onGetCode(): void {
        if (this.accountEidt.string == '') {
            PromptFly.Show('请输入邮箱');
            return;
        }

        this.time = 30;
        this.cutDownLab.node.parent.active = true;
        this.cutDownLab.string = this.time + 's';
        this.schedule(this.schTime, 1);
        xhrSupport.getEmailCode(this.accountEidt.string, "user_retrieve_pwd", (res: any) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                PromptFly.Show('发送成功');

            } else {
                PromptFly.Show(res.msg);
                this.time = 30;
                this.cutDownLab.node.parent.active = false;
                this.unschedule(this.schTime);
            }
        }, () => {
            this.time = 30;
            this.cutDownLab.node.parent.active = false;
            this.unschedule(this.schTime);
        })
    }

    schTime() {
        this.time--;
        if (this.time < 0) {
            this.unschedule(this.schTime);
            this.cutDownLab.node.parent.active = false;
        } else {
            this.cutDownLab.string = this.time + 's';
        }
    }

    onChangePwd() {
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

        xhrSupport.changePwd(this.accountEidt.string, this.pwdEidt.string, this.codeEidt.string,
            (res: any) => {
                res = JSON.parse(res);
                if (res.code == 1) {
                    PromptFly.Show('修改成功');
                    this.closeView();
                } else {
                    PromptFly.Show(res.msg);
                }
            }, () => { })
    }

    onTogglePwd() {
        this.pwdEidt.inputFlag = this.pwdToggle.isChecked ? cc.EditBox.InputFlag.PASSWORD : cc.EditBox.InputFlag.DEFAULT;
    }

    // update (dt) {}
}
