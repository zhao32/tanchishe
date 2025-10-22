
/**
 * HTTP  网络工具 基于Creator
 */

import NetMsg from "../com/MsgCfg";
import HttpUtils from "./HttpUtils";

export default class HttpManager {
    /**登录 */
    static login(email, pwd, callBack) {
        let data = {
            email: email,
            pwd: pwd,
            type: 1
        };

        HttpUtils.httpPost(NetMsg.login, data, callBack);
    }

    /**获取用户数据 */
    static getUserInfo(callBack) {
        HttpUtils.httpGets(NetMsg.getUserInfo, null, callBack);
    }

    /**设置用户数据 */
    static setUserInfo(music = null, voice = null, avatar = null, name = null, callBack) {
        let data: any = {};
        if (music != null) {
            data.music = music;
        }
        if (voice != null) {
            data.voice = voice;
        }
        if (avatar != null) {
            data.avatar = avatar;
        }
        if (name != null) {
            data.name = name;
        }
        HttpUtils.httpPost(NetMsg.setUserInfo, data, callBack);
    }

    /**获取单元 pid： 0：单元，其他：单元下关卡 */
    static getClassList(pid, callBack) {
        let data = {
            pid: pid,
        };

        HttpUtils.httpPost(NetMsg.getClassList, data, callBack);
    }

    /**获取游戏数据 type: 1：切水果，2：填词 */
    static getTitleList(id, type, callBack) {
        let data = {
            id: id,
            type: type,
        };

        HttpUtils.httpPost(NetMsg.getTitleList, data, callBack);
    }

    /**提交得分 */
    static setTitle(id, type, grade, difficulty, callBack) {
        let data = {
            id: id,
            type: type,
            grade: grade,
            difficulty: difficulty,
        };

        HttpUtils.httpPost(NetMsg.setTitle, data, callBack);
    }

    /**获取配置 */
    static getConfig(callBack) {
        HttpUtils.httpPost(NetMsg.getConfig, null, callBack);
    }
}
