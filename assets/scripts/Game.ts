import CameraFollow from "./CameraFollow";
import NetMsg, { InnerMsg } from "./com/MsgCfg";
import PromptFly from "./com/PromptFly";
import head from "./head";
import AudioManager from "./LGQ/AudioManager";
import GButton from "./LGQ/GButton";
import ResManager from "./LGQ/ResManager";
import GameData from "./LGQ/UserInfo";
import UserInfo, { UserCfg } from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";
import xhrSupport from "./LGQ/xhrSupport";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    timeNode: cc.Node = null;
    @property(cc.Node)
    ndTime: cc.Node = null;

    // @property(cc.Node)
    // btnPause: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    joyStickBtn: cc.Node = null;
    @property(cc.Node)
    ndJoyStick: cc.Node = null;


    @property(cc.Node)
    ndCamera: cc.Node = null;

    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(cc.Node)
    ndEffect: cc.Node = null;

    @property(cc.Node)
    btnAddSpeed: cc.Node = null;

    @property(cc.Node)
    btnMS: cc.Node = null;

    @property(cc.Node)
    btnSet: cc.Node = null;


    // @property(cc.Node)
    // btnMusic: cc.Node = null;
    // @property(cc.Node)
    // ndKai: cc.Node = null;
    // @property(cc.Node)
    // ndGuan: cc.Node = null;

    @property(cc.Node)
    bgPlus: cc.Node = null;

    @property(cc.Sprite)
    bgSp: cc.Sprite = null;

    @property(cc.SpriteFrame)
    bgSpFrames: cc.SpriteFrame[] = [];
    // @property(cc.Node)
    // headIcon: cc.Node = null;

    static I: Game = null;

    isPause = false;
    private time = 3;

    toolsData = []
    onLoad() {
        Game.I = this;

        cc.debug.setDisplayStats(false);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;


        // touch event
        this.joyStickBtn.on('touchstart', this.onTouchStart, this);
        this.joyStickBtn.on('touchmove', this.onTouchMove, this);
        this.joyStickBtn.on('touchend', this.onTouchEnd, this);
        this.joyStickBtn.on('touchcancel', this.onTouchCancel, this);

        Utils.addInnerMsg(InnerMsg.gameResume, this, this.gameResume);

        this.bgSp.spriteFrame = this.bgSpFrames[GameData.sceneIdx];
        this.bgPlus.active = GameData.sceneIdx == 0;
        GButton.AddClick(this.btnSet, () => {
            Utils.openBundleView('pb/setNode', "game");
        }, this);

    }


    onDestroy() {
        // touch event
        this.joyStickBtn.off('touchstart', this.onTouchStart, this);
        this.joyStickBtn.off('touchmove', this.onTouchMove, this);
        this.joyStickBtn.off('touchend', this.onTouchEnd, this);
        this.joyStickBtn.off('touchcancel', this.onTouchCancel, this);

        Utils.removeInnerMsg(InnerMsg.gameResume, this, this.gameResume);
    }

    private onTouchStart(event) {
        // when touch starts, set joyStickBtn's position 
        let pos = this.ndJoyStick.convertToNodeSpaceAR(event.getLocation());
        if (Utils.getDistance(cc.v2(0, 0), pos) > 80) {
            let angle = Math.atan2(pos.y, pos.x);
            // angle = angle * 180 / Math.PI;
            pos.x = 80 * Math.cos(angle);
            pos.y = 80 * Math.sin(angle);
        }
        this.ndJoyStick.setPosition(pos);
    }

    private onTouchMove(event) {
        // constantly change joyStickBtn's position
        // let posDelta = event.getDelta();
        // this.joyStickBtn.setPosition(this.joyStickBtn.position.add(posDelta));
        // this.dir = this.joyStickBtn.position.normalize();
        let posDelta = event.getDelta();
        let pos = this.ndJoyStick.position.add(posDelta);
        if (Utils.getDistance(cc.v2(0, 0), pos) > 80) {
            let angle = Math.atan2(pos.y, pos.x);
            // angle = angle * 180 / Math.PI;
            pos.x = 80 * Math.cos(angle);
            pos.y = 80 * Math.sin(angle);
        }
        this.ndJoyStick.setPosition(pos);

        // get direction
        let dir = this.ndJoyStick.position.normalize();

        this.player.getComponent("head").dir = dir;

    }

    private onTouchEnd(event) {
        // reset
        this.ndJoyStick.setPosition(cc.v2(0, 0));
    }

    private onTouchCancel(event) {
        // reset
        this.ndJoyStick.setPosition(cc.v2(0, 0));
    }

    start() {
        // let musicData = UserInfo.getItem(UserCfg.MusicData, false);
        // if (!musicData) {
        //     let data = {
        //         isMusic: true,
        //         isEffect: true
        //     }
        //     musicData = data;

        //     UserInfo.setItem(UserCfg.MusicData, musicData, false);
        // }
        // let musicData = {
        //     isMusic: true,
        //     isEffect: true
        // }
        // AudioManager.updateMusic(musicData);
        // this.ndKai.active = musicData.isMusic;
        // this.ndGuan.active = !musicData.isMusic;
        AudioManager.playMusic("gameBGM");
        GameData.Game = this

        this.ndCamera.getComponent(CameraFollow).target = this.player;
        this.score = 0
        this.time = 3;
        this.timeNode.active = true;
        this.ndTime.active = false;
        this.isPause = true;
        this.setTime();

        // GButton.AddClick(this.btnPause, () => {
        //     this.isPause = true;
        //     this.player.getComponent(head).gamePause();
        //     Utils.openBundleView("pb/PauseNode")
        // }, this);
        GButton.AddClick(this.btnAddSpeed, () => {
            if (this.toolsData[1].use_status == 0) { //不可用
                this.doPause()
                let call = () => {
                    xhrSupport.buyTool(this.toolsData[1].id, (res) => {
                        res = JSON.parse(res)
                        if (res.code == 1) {
                            this.toolsData[1].use_status = 1
                            this.btnAddSpeed.children[0].active = false
                        } else {
                            PromptFly.Show(res.msg);
                        }
                    }, () => { })
                }
                Utils.openBundleView('pb/commonTipNode', [this.toolsData[1].price, "是否花费", "购买加速道具", call]);
            } else { //可用
                if (!GameData.accelerate) {
                    xhrSupport.useTool(this.toolsData[1].id, (res) => {
                        res = JSON.parse(res);
                        if (res.code == 1) {
                            // GameData.userInfo.score -= 10
                            this.useToolSpeed();
                        } else {
                            PromptFly.Show(res.msg);
                        }
                    }, () => { })
                } else {
                    // this.player.getComponent(head).addSpeed();
                }
            }
        }, this)

        // GButton.AddClick(this.btnAddSpeed, () => {
        //     this.player.getComponent(head).resumeSpeed();
        // }, this, () => {
        //     this.player.getComponent(head).addSpeed();
        // }, null, () => {
        //     this.player.getComponent(head).resumeSpeed();
        // });

        xhrSupport.getToolList(1, 2, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                this.toolsData = res.data.list
                this.btnMS.children[0].active = res.data.list[0].use_status == 0
                this.btnAddSpeed.children[0].active = res.data.list[1].use_status == 0
            }
        }, () => { })


        GButton.AddClick(this.btnMS, () => {
            if (this.toolsData[0].use_status == 0) { //不可用
                this.doPause()
                let call = () => {
                    this.gameResume()
                    xhrSupport.buyTool(this.toolsData[0].id, (res) => {
                        res = JSON.parse(res)
                        if (res.code == 1) {
                            this.toolsData[0].use_status = 1
                            this.btnMS.children[0].active = false
                        } else {
                            PromptFly.Show(res.msg);
                        }
                    }, () => { })
                }
                Utils.openBundleView('pb/commonTipNode', [this.toolsData[0].price, "是否花费", "购买无敌道具", call]);
            } else { //可用
                if (!GameData.invincible) {
                    xhrSupport.useTool(this.toolsData[0].id, (res) => {
                        res = JSON.parse(res);
                        if (res.code == 1) {
                            // GameData.userInfo.score -= 10
                            this.useToolMS();
                        } else {
                            PromptFly.Show(res.msg);
                        }
                    }, () => { })
                }
            }
        }, this)

        // GButton.AddClick(this.btnMusic, this.onClickMusic, this);
    }

    useToolMS() {
        GameData.invincible = true
        // this.player.opacity = 120
        this.btnMS.children[0].active = true
        this.btnMS.children[0].getComponent(cc.Sprite).fillRange = 0;
        cc.tween(this.btnMS.children[0].getComponent(cc.Sprite)).to(10, { fillRange: 1 }).start();
        this.scheduleOnce(() => {
            GameData.invincible = false
            // this.player.stopAllActions();
            // this.player.opacity = 255
            this.toolsData[0].use_status = 0
        }, 10)
    }

    useToolSpeed() {
        this.player.getComponent(head).addSpeed();

        GameData.accelerate = true
        // this.player.opacity = 120
        this.btnAddSpeed.children[0].active = true
        this.btnAddSpeed.children[0].getComponent(cc.Sprite).fillRange = 0;
        cc.tween(this.btnAddSpeed.children[0].getComponent(cc.Sprite)).to(10, { fillRange: 1 }).start();
        this.scheduleOnce(() => {
            GameData.accelerate = false
            this.player.stopAllActions();
            // this.player.opacity = 255
            // this.toolsData[1].use_status = 0
            this.player.getComponent(head).resumeSpeed();

        }, 10)
    }

    doPause() {
        this.isPause = true;
        this.player.getComponent(head).gamePause();
    }

    gameResume() {
        this.isPause = false;
        this.player.getComponent(head).gameResume();
    }

    quitBySet() {
        this.doPause();
        xhrSupport.endGame(GameData.sceneId, this.score, 1, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                Utils.openBundleView('pb/trunUI', this.score);
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })
    }

    setTime() {
        cc.tween(this.ndTime).stop();
        ResManager.I.changeBundlePic(this.ndTime, `res/game/${this.time}`, () => {
            this.ndTime.active = true;
            this.ndTime.scale = 2;
            cc.tween(this.ndTime)
                .to(0.9, { scale: 1 })
                .delay(0.1)
                .call(() => {
                    this.time--;
                    if (this.time >= 0) {
                        this.setTime();
                    } else {
                        this.timeNode.active = false;
                        this.isPause = false;

                        let dir = new cc.Vec3(1, 0, 0).normalize();
                        this.player.getComponent("head").dir = dir;
                    }
                }).start();
            // this.ndTime.runAction(cc.sequence(cc.scaleTo(0.9, 1), cc.delayTime(0.1), cc.callFunc(() => {
            //     // this.ndTime.active = false;
            //     // this.ndTime.getComponent(cc.Sprite).spriteFrame = null;
            //     this.time--;
            //     if (this.time >= 0) {
            //         this.setTime();
            //     } else {
            //         this.timeNode.active = false;
            //     }
            // })));
        });

    }

    private score = 0;
    addScore(score) {
        this.score += score;
        this.lblScore.string = this.score + '';
        if (score == 20) {
            this.setEffect();
        }
    }

    setEffect() {
        this.ndEffect.active = true;
        cc.tween(this.ndEffect)
            .to(0.5, { scale: 1.5 })
            .delay(0.3)
            .call(() => {
                this.ndEffect.active = false;
            })
            .start();

    }

    setGameOver() {

        xhrSupport.endGame(GameData.sceneId, this.score, 1, (res) => {
            res = JSON.parse(res);
            if (res.code == 1) {
                Utils.openBundleView('pb/GameOver', this.score);
            } else {
                PromptFly.Show(res.msg);
            }
        }, () => { })

        // setTimeout(() => {
        // }, 500);

    }

    // onClickMusic() {
    //     let musicData = UserInfo.getItem(UserCfg.MusicData, false);
    //     if (!musicData) {
    //         let data = {
    //             isMusic: true,
    //             isEffect: true
    //         }
    //         musicData = data;

    //         UserInfo.setItem(UserCfg.MusicData, musicData, false);
    //     }

    //     musicData.isMusic = !musicData.isMusic;
    //     musicData.isEffect = !musicData.isEffect;
    //     if (musicData.isMusic) {//播放音乐
    //         AudioManager.resumeMusic();
    //     }
    //     else {//停止音乐
    //         AudioManager.pauseMusic();
    //     }

    //     AudioManager.updateMusic(musicData);

    //     this.ndKai.active = musicData.isMusic;
    //     this.ndGuan.active = !musicData.isMusic;
    //     UserInfo.setItem(UserCfg.MusicData, musicData, false);
    // }

    // update (dt) {}
}
