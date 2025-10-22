
const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {

    @property(cc.Node)
    ndBG: cc.Node = null;
    @property(cc.Node)
    ndCanvas: cc.Node = null;

    private isMove = true;
    public target: cc.Node = null;
    public offsetX = 0;
    private smoothSpeed = 1;

    onLoad() { }

    start() {
        // cc.log("数据111111111", this.ndCanvas.width, this.ndCanvas.height);
    }

    resetMove() {
        this.target = null;
        this.isMove = false;
        this.node.setPosition(cc.v2(0, 0));
    }

    startMove() {
        this.isMove = true;
    }

    update(dt) {
        // if (!this.target) return;
        // if (!this.isMove) return;

        // // 计算目标位置
        // const targetPosition = this.target.position; //.add(cc.v3(this.offsetX, 0));
        // if (targetPosition.x + this.ndCanvas.width / 2 > this.ndBG.height / 2) {
        //     targetPosition.x = this.ndBG.height / 2 - this.ndCanvas.width / 2;
        // }
        // if (targetPosition.x - this.ndCanvas.width / 2 < -this.ndBG.height / 2) {
        //     targetPosition.x = -(this.ndBG.height / 2 - this.ndCanvas.width / 2);
        // }
        // if (targetPosition.y + this.ndCanvas.height / 2 > this.ndBG.width / 2) {
        //     targetPosition.y = this.ndBG.width / 2 - this.ndCanvas.height / 2;
        // }
        // if (targetPosition.y - this.ndCanvas.height / 2 < -this.ndBG.width / 2) {
        //     targetPosition.y = -(this.ndBG.width / 2 - this.ndCanvas.height / 2);
        // }
        // // 平滑移动摄像机
        // // let newPosition = this.node.position.lerp(targetPosition, this.smoothSpeed);
        // // newPosition.y = 0;
        // this.node.position = targetPosition;


        // let nX = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        // let endX = this.endMap.convertToWorldSpaceAR(cc.v2(0, 0));
        // if (Math.floor(nX.x) >= Math.floor(endX.x)) {
        //     let pos = this.node.parent.convertToNodeSpaceAR(endX)
        //     this.node.setPosition(pos);
        //     this.isMove = false;
        //     // GameNode.I.gameOver();
        // }
    }

    protected lateUpdate(dt: number): void {
        if (!this.target) return;
        if (!this.isMove) return;

        // 计算目标位置
        const targetPosition = this.target.position; //.add(cc.v3(this.offsetX, 0));
        if (targetPosition.x + this.ndCanvas.width / 2 > this.ndBG.height / 2) {
            targetPosition.x = this.ndBG.height / 2 - this.ndCanvas.width / 2;
        }
        if (targetPosition.x - this.ndCanvas.width / 2 < -this.ndBG.height / 2) {
            targetPosition.x = -(this.ndBG.height / 2 - this.ndCanvas.width / 2);
        }
        if (targetPosition.y + this.ndCanvas.height / 2 > this.ndBG.width / 2) {
            targetPosition.y = this.ndBG.width / 2 - this.ndCanvas.height / 2;
        }
        if (targetPosition.y - this.ndCanvas.height / 2 < -this.ndBG.width / 2) {
            targetPosition.y = -(this.ndBG.width / 2 - this.ndCanvas.height / 2);
        }
        // 平滑移动摄像机
        // let newPosition = this.node.position.lerp(targetPosition, this.smoothSpeed);
        // newPosition.y = 0;
        this.node.position = targetPosition;
    }
}
