import NetMsg from "./com/MsgCfg";
import PromptFly from "./com/PromptFly";
import AudioManager from "./LGQ/AudioManager";
import GButton from "./LGQ/GButton";
import ResManager from "./LGQ/ResManager";
import SdkUtils from "./LGQ/SdkUtils";
import UserInfo, { UserCfg } from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";
import ModelPlayer from "./model/ModelPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    btnLogin: cc.Node = null;
    @property(cc.Node)
    ndLogin: cc.Node = null;
    @property(cc.Node)
    ndMain: cc.Node = null;

    @property(cc.Node)
    loginBG: cc.Node = null;

    @property(cc.Node)
    ndGH: cc.Node = null;
    @property(cc.EditBox)
    editBox: cc.EditBox = null;
    @property(cc.Node)
    btnGH: cc.Node = null;

    @property(cc.Node)
    btnMusic: cc.Node = null;
    @property(cc.Node)
    ndKai: cc.Node = null;
    @property(cc.Node)
    ndGuan: cc.Node = null;


    private isStart = false;
    private bgUrl = "https://tanchishedw.xinzhiyukeji.cn/uploads/home_background.png"
    onLoad() {
        // ResManager.I.changePic(this.loginBG, this.bgUrl);
    }

    start() {
        this.ndLogin.active = false;
        this.ndMain.active = false;
        let isCodeBtn = false;
        let isWxLogin = false;
        let data: any = {};
        if (!Utils.isLogin) {
            this.ndLogin.active = true;
            this.loadBundle();
            cc.director.preloadScene('game');

            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                SdkUtils.login((code) => {
                    SdkUtils.getUserInfo((res) => {
                        isWxLogin = true;
                        let name = res.nickName;
                        let avatarUrl = res.avatarUrl;
    
                        // console.log("数据11111111", code, res);
                        //登录接口
                        data = {
                            code: code,
                            avatarUrl: avatarUrl,
                            nickName: name
                        }
                        if (isCodeBtn) {
                            Utils.sendNetMsg(NetMsg.login, data, (res) => {
                                if (res && res.code == 1) {
                                    let _data = res.data;
    
                                    ModelPlayer.I.token = _data.token;
                                    let nData = _data.user;
                                    ModelPlayer.I.avatar = nData.avatarUrl;
                                    ModelPlayer.I.name = nData.nickName;
                                    ModelPlayer.I.openid = nData.openid;
                                    ModelPlayer.I.unionid = nData.unionid;
                                    ModelPlayer.I.id = nData.id;
                                    ModelPlayer.I.gameClose = nData.game_close;
    
                                    if (_data.isBindWork == 1) {    //1,需要绑定;0,不需要绑定
                                        this.btnLogin.active = false;
                                        this.ndGH.active = true;
                                    } else {
                                        Utils.isLogin = true;
                                        this.showMain();
                                    }
                                }
    
                            });
                        }
                    }, () => {
                        isCodeBtn = true;
                    });
                });

                GButton.AddClick(this.btnLogin, () => {
                    if (!isCodeBtn && isWxLogin) {
                        Utils.sendNetMsg(NetMsg.login, data, (res) => {
                            if (res && res.code == 1) {
                                let _data = res.data;
    
                                ModelPlayer.I.token = _data.token;
                                let nData = _data.user;
                                ModelPlayer.I.avatar = nData.avatarUrl;
                                ModelPlayer.I.name = nData.nickName;
                                ModelPlayer.I.openid = nData.openid;
                                ModelPlayer.I.unionid = nData.unionid;
                                ModelPlayer.I.id = nData.id;
                                ModelPlayer.I.gameClose = nData.game_close;
    
                                if (_data.isBindWork == 1) {    //1,需要绑定;0,不需要绑定
                                    this.btnLogin.active = false;
                                    this.ndGH.active = true;
                                } else {
                                    Utils.isLogin = true;
                                    this.showMain();
                                }
                            }
    
                        });
                    }
    
                }, this);
            } else {
                isCodeBtn = false;
                isWxLogin = true;
                this.btnLogin.active = false;
                this.ndGH.active = true;
                
                // let userData = UserInfo.getItem(UserCfg.Token, false);
                // // console.log("数据11111111111", userData);
                // if (!userData || !userData.gonghao || userData.gonghao == '') {
                //     this.ndGH.active = true;
                // } else {
                //     Utils.isLogin = true;
                //     this.ndGH.active = false;
                //     // ModelPlayer.I.token = userData.token;
                //     // ModelPlayer.I.id = userData.id;
                //     let data = {
                //         work_number: userData.gonghao,
                //     };
                //     Utils.sendNetMsg(NetMsg.authWorkLogin, data, (res) => {
                //         if (res && res.code == 1) {
        
                //             let _data = res.data;
        
                //             ModelPlayer.I.token = _data.token;
                            
                //             let nData = _data.user;
                //             ModelPlayer.I.avatar = nData.avatar;
                //             ModelPlayer.I.name = nData.name;
                //             ModelPlayer.I.id = nData.id;
        
                //             let da = {
                //                 token: _data.token,
                //                 id: nData.id,
                //                 gonghao: userData.gonghao,
                //             }
                //             UserInfo.setItem(UserCfg.Token, da, false)
                //             Utils.isLogin = true;
                //             this.showMain();
                //         }
                //     })
                //     this.showMain();
                // }
                
            }
        } else {
            this.showMain();
        }

        GButton.AddClick(this.btnGH, () => {
            //验证工号
            // cc.log("数据111111111111");
            let str = this.editBox.string;
            if (!str || str == '') {
                PromptFly.Show("请输入工号");
                return;
            }

            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                let data = {
                    work_number: str,
                    openid: ModelPlayer.I.openid,
                    unionid: ModelPlayer.I.unionid,
                    avatarUrl: ModelPlayer.I.avatar,
                    nickName: ModelPlayer.I.name,
                };
                Utils.sendNetMsg(NetMsg.bindWorkLogin, data, (res) => {
                    if (res && res.code == 1) {
    
                        let _data = res.data;
    
                        ModelPlayer.I.token = _data.token;
                        let nData = _data.user;
                        ModelPlayer.I.avatar = nData.avatar;
                        ModelPlayer.I.name = nData.name;
                        ModelPlayer.I.id = nData.id;
    
                        Utils.isLogin = true;
                        this.showMain();
                    }
                })
            } else {
                let data = {
                    work_number: str,
                };
                Utils.sendNetMsg(NetMsg.authWorkLogin, data, (res) => {
                    if (res && res.code == 1) {
    
                        let _data = res.data;
    
                        ModelPlayer.I.token = _data.token;
                        
                        let nData = _data.user;
                        ModelPlayer.I.avatar = nData.avatar;
                        ModelPlayer.I.name = nData.name;
                        ModelPlayer.I.id = nData.id;
    
                        let da = {
                            token: _data.token,
                            id: nData.id,
                            gonghao: str,
                        }
                        UserInfo.setItem(UserCfg.Token, da, false)
                        Utils.isLogin = true;
                        this.showMain();
                    }
                })
            }
            
        }, this);

        GButton.AddClick(this.btnMusic, this.onClickMusic, this);

    }

    showMain() {
        let musicData = UserInfo.getItem(UserCfg.MusicData, false);
        if (!musicData) {
            let data = {
                isMusic: true,
                isEffect: true
            }
            musicData = data;

            UserInfo.setItem(UserCfg.MusicData, musicData, false);
        }
        AudioManager.updateMusic(musicData);
        this.ndKai.active = musicData.isMusic;
        this.ndGuan.active = !musicData.isMusic;

        AudioManager.playMusic("gameBGM");
        this.ndLogin.active = false;
        this.ndMain.active = true;
    }


    loadBundle() {
        let self = this;
        cc.assetManager.loadBundle("bundles", () => {

        }, () => {
            cc.log("分包加载成功");
            let bundle = cc.assetManager.getBundle("bundles");
            if (bundle) {
                bundle.preloadDir("pb", (completedCount, totalCount) => {
                    // var pro = (completedCount / totalCount) * 0.5;
                    // pro = pro <= 0.5 ? pro : 0.5;
                    // self.setProBar(pro);
                }, () => {
                    cc.log("分包预加载资源成功");
                    this.isStart = true;
                    // cc.director.preloadScene("gameScene", (completedCount, totalCount, item) => {
                    //     var pro = (completedCount / totalCount) * 0.5;
                    //     pro = pro <= 0.5 ? pro : 0.5;
                    //     self.setProBar(pro + 0.5);
                    // }, () => {
                    //     cc.director.loadScene("gameScene");
                    // })
                });
            }
        });
    }

    onClickMusic() {
        let musicData = UserInfo.getItem(UserCfg.MusicData, false);
        if (!musicData) {
            let data = {
                isMusic: true,
                isEffect: true
            }
            musicData = data;

            UserInfo.setItem(UserCfg.MusicData, musicData, false);
        }

        musicData.isMusic = !musicData.isMusic;
        musicData.isEffect = !musicData.isEffect;
        if (musicData.isMusic) {//播放音乐
            AudioManager.resumeMusic();
        }
        else {//停止音乐
            AudioManager.pauseMusic();
        }

        AudioManager.updateMusic(musicData);

        this.ndKai.active = musicData.isMusic;
        this.ndGuan.active = !musicData.isMusic;
        UserInfo.setItem(UserCfg.MusicData, musicData, false);
    }

    // update (dt) {}
}
