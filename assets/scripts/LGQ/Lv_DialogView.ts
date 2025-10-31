// import CurrentNode from "../CurrentNode";
import GButton from "./GButton";
import ResManager from "./ResManager";
import { Utils } from "./Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Lv_DialogView extends cc.Component {

    onPrefabShow(data: { isClose: boolean } = { isClose: true }) {
        ResManager.I.loadResPrefab('pb/DialogView', (pb) => {
            if (cc.isValid(this.node)) {
                let node = cc.instantiate(pb);
                this.node.addChild(node);
                node.zIndex = -1;

                if (data.isClose) {
                    GButton.AddClick(node, this.onClose, this, null, null, null, 0, false)
                }
            }
        });
    }

    // currenBtnType: 0:全显示按钮，1：显示充值，2：显示兑换，3：不显示
    onCurrentShow(data: { hideClose?: boolean, currenBtnType?: number } = {
        hideClose: false,
        currenBtnType: 0
    }) {
        // ResManager.I.loadBundlePrefab('pb/TopNode', (pb) => {
        //     if (cc.isValid(this.node)) {
        //         let item: cc.Node = cc.instantiate(pb);
        //         this.node.addChild(item);
        //         item.zIndex = 10000;

        //         let node = item.getChildByName("panelCurrent");
        //         ResManager.I.loadBundlePrefab('pb/CurrentNode', (pb) => {
        //             if (cc.isValid(node)) {
        //                 let currentNode: cc.Node = cc.instantiate(pb);
        //                 node.addChild(currentNode);

        //                 currentNode.getComponent(CurrentNode).setData(data);
        //             }
        //         })

        //         //返回按钮
        //         let btn_close = item.getChildByName('close');
        //         btn_close.active = !data.hideClose;
        //         GButton.AddClick(btn_close, this.onClose, this);


        //     }
        // });
    }

    openUIData(data: any) {

    }

    onClose() {
        this.closeView();
    }

    closeView() {
        if (this.node) Utils.removeView(this.node.name);
    }

    // update (dt) {}
}
