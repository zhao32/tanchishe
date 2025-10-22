
const { ccclass, property } = cc._decorator;

interface Callback {
    success?: Function | null | undefined;
    showAd?: Function | null | undefined;
    rewarded?: Function | null | undefined;
    fail?: Function | null | undefined;
}

@ccclass
export default class SdkUtils {

    static wechatSysInfo: any = null;
    private static _adVideo: any = null;
    public static asId = {
        wx: '',
        tt: ''
    };

    static init() {

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //@ts-ignore
            // wx.cloud.init();
            //@ts-ignore
            this.wechatSysInfo = wx.getSystemInfoSync();
        }
    }

    static initShareMenu() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            try {
                //@ts-ignore
                wx.showShareMenu({
                    withShareTicket: true,
                    menus: ['shareAppMessage', 'shareTimeline'],
                    success: () => { },
                    fail: () => { },
                    complete: () => { }
                });

                //@ts-ignore
                wx.onShareAppMessage(() => {
                    return {
                        // title: '来一起玩爆爽的弹珠',
                        success: () => { },
                        fail: () => { }
                    }
                });
            } catch (err) {
                console.log(`set share faild: ${err}`);
            }
        } else if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
            tt.showShareMenu({
                menus: ['shareAppMessage'],
            })

            tt.onShareAppMessage(function () {
                return {
                    // title: '来一起玩爆爽的弹珠',
                }
            })
        }

    }

    static shareGame() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            try {
                //@ts-ignore
                wx.shareAppMessage({
                    // title: '快来一起弹弹球，好玩得很！'
                });
            } catch (err) {
                cc.log(`share faild: ${err}`);
            }
        } else if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
            console.log("分享");
            try {
                //@ts-ignore
                tt.shareAppMessage({
                    // title: '快来一起弹弹球，好玩得很！'
                });
            } catch (err) {
                cc.log(`share faild: ${err}`);
            }
        }

    }

    /**
     * 
     * @param text message in string
     * @param duration seconds
     */
    static showToast(text: string, duration: number = 3) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // @ts-ignore
            wx.showToast({
                title: text,
                icon: 'success',
                duration: duration * 1000
            });
        } else if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
            tt.showToast({
                title: text,
                icon: 'success',
                duration: duration * 1000
            })
        }
    }

    static getUserInfo(func, createBtnFunc) {
        this.init();
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            const windowWidth = this.wechatSysInfo.windowWidth; //获取像素size
            const windowHeight = this.wechatSysInfo.windowHeight;
            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo'] == true) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: function (res) {
                                console.log("用户信息:", res.userInfo)
                                func && func(res.userInfo);
                            }
                        })
                    } else {
                        // 否则，先通过 wx.createUserInfoButton 接口发起授权
                        let button = wx.createUserInfoButton({
                            type: '',
                            text: '',
                            style: {
                                left: 0,
                                top: 0,
                                width: windowWidth,
                                height: windowHeight,
                            }
                        })
                        button.onTap((res) => {
                            // 用户同意授权后回调，通过回调可获取用户头像昵称信息
                            console.log("用户授权：", res)
                            button.destroy();
                            func && func(res.userInfo);
                        })

                        createBtnFunc && createBtnFunc();
                    }
                }
            })
        } else if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
            // 获取用户信息
            tt.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        tt.getUserInfo({
                            success: function (res) {
                                console.log(`getUserInfo 调用成功`, res.userInfo, res.encryptedData, res.iv, res.signature);
                                func && func(res.userInfo);
                            },
                            fail(res) {
                                console.log(`getUserInfo 调用失败`, res.errMsg);
                            },
                        })
                    } else {
                        // 否则发起授权
                        tt.authorize({
                            scope: "scope.userInfo",
                            success: function (res) {
                                if (res.data["scope.userInfo"] == 'ok') {
                                    console.log(`授权成功`, res.data);
                                    tt.getUserInfo({
                                        success: function (res) {
                                            console.log(`getUserInfo 调用成功`, res.userInfo, res.encryptedData, res.iv, res.signature);
                                            func && func(res.userInfo);
                                        },
                                        fail(res) {
                                            console.log(`getUserInfo 调用失败`, res.errMsg);
                                        },
                                    })
                                }
                            },
                            fail: function (res) {
                                console.log(`授权失败`, res.errMsg);
                            }
                        })
                    }
                }
            })
        }
    }

    static login(success) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.login({
                success(res) {
                    if (res.code) {
                        //发起网络请求
                        console.log('登录成功！' + res.code)
                        success && success(res.code);
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        } else if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
            tt.login({
                success(res) {
                    console.log("登录成功", res);
                    success && success(res.code);
                },
            });
        }

    }
    //震动
    static vibrate() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.vibrateLong({
                // type: "medium",
                success(res) {
                    console.log('震动成功！')
                }
            })
        } else if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
            tt.vibrateLong({
                success(res) {
                    console.log('震动成功！')
                },
            });
        }
    }

    private static callback: Map<string, Callback | null | undefined> = new Map();
    private static setCallback(event: string, callback: Callback) {
        this.callback.set(event, callback);
    }
    private static getCallback(event: string) {
        return this.callback.has(event) ? this.callback.get(event) : null;
    }
    static showAdVideo(data?: any) {
        let event = 'rewardedVideoAd';
        if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
            if (!SdkUtils.asId.tt) {
                if (data?.success) data.success();
            } else {
                if (this._adVideo == null) {
                    this._adVideo = tt.createRewardedVideoAd({ adUnitId: SdkUtils.asId.tt });
                    this._adVideo.onClose(this.onRewardedClose.bind(this));
                    this._adVideo.onError(this.onError.bind(this, event));
                }

                this.setCallback(event, { success: data?.success, rewarded: data?.rewarded, fail: data?.fail });

                this._adVideo.show();
            }
        } else if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!SdkUtils.asId.wx) {
                if (data?.success) data.success();
            } else {
                if (this._adVideo == null) {
                    this._adVideo = wx.createRewardedVideoAd({ adUnitId: SdkUtils.asId.wx });
                    this._adVideo.onClose(this.onRewardedClose.bind(this));
                    this._adVideo.onError(this.onError.bind(this, event));
                }

                this.setCallback(event, { success: data?.success, rewarded: data?.rewarded, fail: data?.fail });

                this._adVideo.show();
            }
        } else {
            if (data?.success) data.success();
        }
    }

    private static onRewardedClose(res: any) {
        console.log('onRewardedClose', res);
        let event = 'rewardedVideoAd';
        if (res.isEnded && this.getCallback(event)?.success)
            this.getCallback(event).success();
        else if (this.getCallback(event)?.fail)
            this.getCallback(event).fail();
    }

    private static onError(event: string, res: any) {
        console.log('onError event', event);
        console.log('onError msg', res);
        if (this.getCallback(event)?.fail) this.callback.get(event).fail();
    }
}
