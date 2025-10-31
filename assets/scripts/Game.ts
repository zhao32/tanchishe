import CameraFollow from "./CameraFollow";
import NetMsg, { InnerMsg } from "./com/MsgCfg";
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
    btnSet: cc.Node = null;


    // @property(cc.Node)
    // btnMusic: cc.Node = null;
    // @property(cc.Node)
    // ndKai: cc.Node = null;
    // @property(cc.Node)
    // ndGuan: cc.Node = null;

    @property(cc.Sprite)
    bgSp: cc.Sprite = null;

    @property(cc.SpriteFrame)
    bgSpFrames: cc.SpriteFrame[] = [];
    // @property(cc.Node)
    // headIcon: cc.Node = null;

    static I: Game = null;

    isPause = false;
    private time = 3;
    onLoad() {

        // wx.setDeviceOrientation({
        //     value: "landscape",
        //     success: () => {
        //         console.log("转屏成功");
        //         let screenSize = cc.view.getDesignResolutionSize();
        //         console.log('屏幕设计尺寸', screenSize.height, screenSize.width);
        //         let height = screenSize.height;
        //         let width = screenSize.width;
        //         // screenSize.height = screenSize.width;
        //         // screenSize.width = height;
        //         // // cc.screen.windowSize = screenSize;
        //         cc.find("Canvas").width = 1334;
        //         cc.find("Canvas").height = 750;
        //         cc.view.setDesignResolutionSize(height, width, cc.ResolutionPolicy.FIXED_WIDTH);
        //         // let canvasSize = cc.view.getCanvasSize();
        //         // let ratio = cc.view.getDevicePixelRatio();
        //         console.log("数据界面大小", screenSize, cc.view.getDesignResolutionSize(), cc.find("Canvas"));

        //         // cc.view?.changeCanvasSize(canvasSize.height / ratio, canvasSize.width / ratio);
        //     }
        // })

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
            this.player.getComponent(head).resumeSpeed();
        }, this, () => {
            this.player.getComponent(head).addSpeed();
        }, null, () => {
            this.player.getComponent(head).resumeSpeed();
        });

        // GButton.AddClick(this.btnMusic, this.onClickMusic, this);
    }

    doPause() {
        this.isPause = true;
        this.player.getComponent(head).gamePause();
    }

    gameResume() {
        this.isPause = false;
        this.player.getComponent(head).gameResume();
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
        let data = {
            score: this.score
        };
        // Utils.sendNetMsg(NetMsg.addScore, data, () => {

        // })

        xhrSupport.endGame(GameData.sceneId, this.score, 1, (res) => {

        }, () => { })

        setTimeout(() => {
            Utils.openBundleView('pb/GameOver', this.score);
        }, 500);

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
