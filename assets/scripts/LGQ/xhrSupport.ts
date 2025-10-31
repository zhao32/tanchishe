import httpUtil from "./httpUtil";

var xhrSupport = {
  httpUrl: "https://baozoutanchishe.test.xinzhiyukeji.cn/",
  // httpUrl: "http://192.168.0.90:10002/",

  loginHtml(account, password, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Login/loginSn?server=1&account=${account}&password=${password}&type=emailLogin`,
      {
        isNeedToken: false
      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  register(account, password, code, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Login/register?server=1&account=${account}&captcha=${code}&password=${password}&type=email`,
      {
        isNeedToken: false
      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  changePwd(account, password, captcha, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Login/resetpwd?server=1&account=${account}&password=${password}&captcha=${captcha}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getEmailCode(email, event, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Ems/send?email=${email}&event=${event}&server=1`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getProtrol(type, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/agreement?server=1&type=${type}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getUserInfo(successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Login/refresh_user?server=1`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  /**获取积分记录列表 */
  getScoreList(page, pagesize, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/score_list?server=1&page=${page}&pagesize=${pagesize}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getSceneList(page, pagesize, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/scene_list?server=1&page=${page}&pagesize=${pagesize}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  enterGameByScore(sceneId, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/pay_tickets?server=1&sceneId=${sceneId}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getSkinList(page, pagesize, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/skin_list?server=1&page=${page}&pagesize=${pagesize}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  buySkin(skinId, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/buyskin?server=1&skinId=${skinId}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      }, (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  useSkin(skinId, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/choiceskin?server=1&skinId=${skinId}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      }, (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getUseingSkin(successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Login/usingskin?server=1`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getToolList(page, pagesize, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/tools_list?server=1&page=${page}&pagesize=${pagesize}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  buyTool(toolsId, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/buytools?server=1&toolsId=${toolsId}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      }, (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  endGame(id, game_score, is_normalover, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/gameover?server=1&id=${id}&game_score=${game_score}&is_normalover=${is_normalover}`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      }, (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  getRechargeList(successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/coinlist?server=1&page=1&pagesize=999`,
      {
        isNeedToken: true

      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  },

  doRecharge(id, paytype, successCb: Function, failCb: Function) {
    httpUtil.post(
      `${this.httpUrl}api/Index/recharge?server=1&product_id=${id}&pay_type=${paytype}`,
      {
        isNeedToken: true
      },
      (success) => {
        successCb && successCb(success), (successCb = null);
      },
      (fail) => {
        failCb && failCb(fail), (failCb = null);
      })
  }



};
export default xhrSupport;
