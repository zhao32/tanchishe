
import NetMsg from "./com/MsgCfg";
import GButton from "./LGQ/GButton";
import Lv_DialogView from "./LGQ/Lv_DialogView";
import ResManager from "./LGQ/ResManager";
import ScrollViewList from "./LGQ/ScrollViewList";
import { Utils } from "./LGQ/Utils";
import ModelPlayer from "./model/ModelPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankNode extends Lv_DialogView {

    @property(cc.Node)
    btnClose: cc.Node = null;
    @property(ScrollViewList)
    listView: ScrollViewList = null;
    @property(cc.Label)
    myRank: cc.Label = null;

    private rankData = [];
    onLoad() {

    }

    start() {
        this.getRankData();
        GButton.AddClick(this.btnClose, () => {
            this.onClose();
        }, this);
    }

    getRankData() {
        Utils.sendNetMsg(NetMsg.getRank, null, (res) => {
            if (res && res.code == 1) {
                // console.log("数据1111111111", res.data);
                this.rankData = res.data.list;
                this.listView.numItems = this.rankData.length;
                this.setMyRank();
            }
        })
    }

    setMyRank() {
        // console.log("数据1111111", ModelPlayer.I.id);
        let isHas = false;
        for (let i = 0; i < this.rankData.length; i++) {
            let data = this.rankData[i];
            if (data.id == ModelPlayer.I.id) {
                isHas = true;
                this.myRank.string = `我的排名：${(i + 1)}`;
                break;
            }
        }
        if (!isHas) {
            this.myRank.string = `我的排名：未上榜`;
        }
    }

    onRenderItem(node, index) {
        if (!node) {
            return;
        }
        let data = this.rankData[index];
        if (!data) {
            node.active = false;
            return;
        }

        node.active = true;

        let rankBG = node.getChildByName("rankBG");
        let rankIcon = node.getChildByName("rankIcon");
        let icon = node.getChildByName("iconNode").getChildByName("icon");
        let lbl_rank = node.getChildByName("rank");
        let lbl_name = node.getChildByName("lblName").getComponent(cc.Label);
        let lbl_score = node.getChildByName("lblScore").getComponent(cc.Label);

        rankBG.active = data.id == ModelPlayer.I.id;
        let rank = index + 1;
        rankIcon.active = false;
        lbl_rank.active = false;
        if (rank <= 3) {
            rankIcon.active = true;
            ResManager.I.changeBundlePic(rankIcon, 'res/main/rank' + rank);
        } else {
            lbl_rank.active = true;
            lbl_rank.getComponent(cc.Label).string = rank;
        }

        ResManager.I.changePic(icon, data.avatar);

        lbl_name.string = data.name;
        lbl_score.string = data.score;
    }

    // update (dt) {}
}
