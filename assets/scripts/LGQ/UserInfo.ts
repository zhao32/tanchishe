import Game from "../Game";
import ModelPlayer from "../model/ModelPlayer";

export default class GameData {

    // private static gameName = "DWTCSNEW";
    // static setItem(key, value, isUserId = true) {
    //     let keys = "" + key;
    //     if (isUserId) {
    //         keys += ModelPlayer.I.id;
    //     }
    //     keys += this.gameName;
    //     let d = JSON.stringify(value);
    //     cc.sys.localStorage.setItem(keys, d)
    // }

    // static getItem(key ,isUserId = true) {
    //     let keys = "" + key;
    //     if (isUserId) {
    //         keys += ModelPlayer.I.id;
    //     }
    //     keys += this.gameName;
    //     let data = cc.sys.localStorage.getItem(keys);
    //     // console.log("数据2222222", keys, data);
    //     if (data == null || data == undefined || data == '') {
    //         return null;
    //     }
    //     let d = JSON.parse(data);
    //     return d;
    // }

    static userInfo: userInfo
    /**场景类型id */
    static sceneTypeId: number = 0
    /**进入场景时的id 有唯一性 */
    static sceneId: number = 0

    static sceneIdx: number = 0

    static difficultyValue: number = 0

    static Game: Game

    /**免伤状态 */
    static invincible: boolean = false
}

interface userInfo {
    score: number,//积分
    game_acoustics: number,//音效
    game_music: number,//音乐
    skin,
    skinId: number,//当前皮肤

}

export enum UserCfg {
    Yinsi = 1,    //隐私勾选状态
    Mobile,       //登录手机号
    MusicData,    //音乐数据
    Yuyan,        //语言
    IsGuide,      //引导
    GodId,        //首页狗狗ID
    Token,        //token
}
