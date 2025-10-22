import Game from "./Game";
import { Utils } from "./LGQ/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class monster extends cc.Component {
    @property(sp.Skeleton)
    ndAni: sp.Skeleton = null;
    @property()
    type = 0;

    private isMove = false;
    onLoad() {
        let pos = this.randomPos();
        this.node.setPosition(pos);
    }

    start() {
        this.ndAni.timeScale = 0;
        // this.ndAni.clearTrack(0);
        if (!Game.I.isPause) {
            this.isMove = true;
            // this.ndAni.setAnimation(0, 'newAnimation', true);
            this.ndAni.timeScale = 1;
            this.setMove();
        }
    }

    randomPos() {
        let width = this.node.parent.width;
        let height = this.node.parent.height;
        let x = Math.round(Math.random() * width) - width / 2;
        let y = Math.round(Math.random() * height) - height / 2;
        if (x <= - (width / 2 + this.node.width * 2)) {
            x = - (width / 2 + this.node.width * 2);
        }
        if (y <= - (height / 2 + this.node.height * 2)) {
            y = - (height / 2 + this.node.height * 2);
        }
        if (x >= (width / 2 - this.node.width * 2)) {
            x = width / 2 - this.node.width * 2;
        }
        if (y > (height / 2 - this.node.height * 2)) {
            y = height / 2 - this.node.height * 2;
        }

        let pos = cc.v2(x, y);
        if (Utils.getDistance(Game.I.player.getPosition(), pos) <= 200) {
            pos = this.randomPos();
        }
        return cc.v2(x, y);
    }

    setMove() {
        let width = this.node.parent.width;
        let height = this.node.parent.height;
        let x = Math.round(Math.random() * width) - width / 2;
        let y = Math.round(Math.random() * height) - height / 2;
        let pos = cc.v2(x, y);

        let _p = pos.sub(cc.v2(this.node.position.x, this.node.position.y));
        let angle = cc.v2(1, 0).signAngle(_p.normalize()) * 180 / Math.PI;
        // this.node.angle = angle-90;
        if (this.type == 1) {
            this.node.angle = angle
        } else {
            this.node.angle = angle - 90;
        }
        

        let speed = Math.random() * 1 + 2;
        let time = Utils.getDistance(this.node.position, pos) / speed / 60;
        cc.tween(this.node)
            .to(time, { position: new cc.Vec3(pos.x, pos.y) })
            .call(() => {
                this.setMove()
            })
            .start();
    }

    gamePause() {
        this.ndAni.timeScale = 0;
        cc.Tween.stopAllByTarget(this.node);
        // cc.tween(this.node).stop().start();
    }
    gameResume() {
        this.ndAni.timeScale = 1;
        this.setMove();
    }

    update (dt) {
        if (!Game.I.isPause && !this.isMove) {
            this.isMove = true;
            this.ndAni.timeScale = 1;
            this.setMove();
        }
    }
}
