
export enum InnerMsg {
    closeGame = 1,   //结束游戏回到首页
    restartGame,     //重新开始
    showGame,        //开始游戏

    gameResume,  //游戏继续

    headPause,   //暂停

    updatePlayerData,
    updatePlayerInfo,
    updateCurrent,
    upgradeHome,
}

export enum HttpType {
    POST,   //post
    GET,        //get
}

export default class NetMsg {

    /**登录 */
    static login = { url: "api/Login/authLogin", type: HttpType.POST, isToken: false };
    /**绑定工号 */
    static bindWorkLogin = { url: "api/Login/bindWorkLogin", type: HttpType.POST, isToken: false };
    /**用户信息 */
    static getUserInfo = { url: "api/User/getUserInfo", type: HttpType.GET, isToken: true };
    /**修改用户信息 */
    static setUserInfo = { url: "api/User/edit", type: HttpType.POST, isToken: true };
    /**提交得分 */
    static addScore = { url: "api/user/addScore", type: HttpType.POST, isToken: true };

    /**排行榜 */
    static getRank = { url: "api/user/scoreList", type: HttpType.GET, isToken: true };

    /**员工登录 */
    static authWorkLogin = { url: "api/Login/authWorkLogin", type: HttpType.POST, isToken: false };

}
