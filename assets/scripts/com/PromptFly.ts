import Lv_DialogView from "../LGQ/Lv_DialogView";
import ResManager from "../LGQ/ResManager";
import GameRoot from "./GameRoot";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PromptFly extends cc.Component {

    @property(cc.Label)
    desc: cc.Label = null;

    private aniTime = 0.8;
    private aniDis = 100;
    onLoad() { }

    start() {
        this.showAni();
    }

    setData(desc) {
        this.desc.string = desc;
    }

    showAni() {
        let endPos = this.node.position;
        cc.tween(this.node)
            .to(this.aniTime, { position: cc.v3(endPos.x, endPos.y + this.aniDis, endPos.z) }, { easing: 'sineOut'})
            .removeSelf()
            .start();

        // let move = cc.moveTo(this.aniTime, cc.v2(endPos.x, endPos.y + this.aniDis)).easing(cc.easeSineOut());
        // this.node.runAction(cc.sequence(move, cc.callFunc(() => {
        //     this.node.removeFromParent();
        // })));
    }

    static Show(desc) {
        ResManager.I.loadResPrefab("pb/PromptFly", (pb) => {
            let node = cc.instantiate(pb);
            GameRoot.I.promptNode.addChild(node);
            node.getComponent(PromptFly).setData(desc);
        });
    }



    // update (dt) {}
}
