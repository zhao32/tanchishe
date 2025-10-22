
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRoot extends cc.Component {
    public static I: GameRoot = null;

    @property(cc.Node)
    openNode: cc.Node = null;
    @property(cc.Node)
    promptNode: cc.Node = null;
    @property(cc.Node)
    netTips: cc.Node = null;
    @property(cc.Label)
    lblTip: cc.Label = null;
    @property(cc.Node)
    touchNode: cc.Node = null;

    /** 服务器时间与本地时间同步 */
    private serverTime: number = 0;
    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }

    start() {
        GameRoot.I = this;
        this.schedule(()=>{
            if(this.serverTime){
                this.serverTime += 1;
            }
        }, 1);
    }

    DisEnablePage() {
        this.touchNode.active = true;
    }
    EnablePage() {
        this.touchNode.active = false;
    }

    showNetTip(str) {
        this.netTips.active = true;
        this.lblTip.string = str;
    }

    closeNetTip() {
        this.netTips.active = false;
    }

    // update (dt) {}
}
