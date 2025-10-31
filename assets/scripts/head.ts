import Game from "./Game";
import ResManager from "./LGQ/ResManager";
import GameData from "./LGQ/UserInfo";
import { Utils } from "./LGQ/Utils";
import monster from "./monster";

const { ccclass, property } = cc._decorator;

@ccclass
export default class head extends cc.Component {

    @property(cc.Node)
    ndWei: cc.Node = null;
    @property(cc.Node)
    ndFood: cc.Node = null;
    @property(cc.Node)
    ndBG: cc.Node = null;

    @property(cc.Prefab)
    bodyPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    headSp: cc.Sprite = null;

    @property(cc.SpriteFrame)
    headSpFrames: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    bodySpFrames: cc.SpriteFrame[] = [];

    // @property([cc.Prefab])
    // foodPrefabS: Array<cc.Prefab> = new Array<cc.Prefab>();



    // @property
    // text: string = 'hello';

    private bodyNum = 2;

    private foodNum = 30;
    private monsterNum = 5;

    // the length of each section(section between body prefabs)
    private sectionLen = 25;
    private weiLen = 40;
    private headLen = 40;

    private snakeArray = [];

    private pointsArray = [];
    private weiPossArray = [];

    private time = 9;

    private speed = 4;
    private disSpeed = 0.2;

    public dir = null;

    private headPointsNum = 0;
    private foodType = 20;

    private isFirst = false;
    private isYuanbao = false;

    private monsterArray = [];

    private score = 0;
    private isGameOVer = false;
    private isStartColl = false;

    onLoad() {
        // set head's color
        this.isFirst = true;
        this.headPointsNum = 0;

        this.pointsArray = [];

        this.snakeArray = [];
        this.snakeArray.push(this.node);
        this.snakeArray.push(this.ndWei);
        this.snakeArray[this.snakeArray.length - 1].curIndex = 0;
        this.headSp.spriteFrame = this.headSpFrames[GameData.userInfo.skinId - 1]
        // this.speed = this.sectionLen / this.time;

        for (let i = 1; i <= this.bodyNum; i++) {
            this.getNewBody();
        }


        // this.node.setPosition(this.randomPos());
        // this.rotateHead(this.node.position);

        // produce new food
        for (let i = 0; i < this.foodNum; i++) {
            this.getNewFood();
        }
        let monsterNumList = [10, 20, 30]
        for (let i = 0; i < monsterNumList[GameData.difficultyValue]; i++) {
            this.getNewMonster();
        }
    }

    onDestroy() {
        // touch event
    }

    randomColor() {
        // get random color
        let red = Math.round(Math.random() * 255);
        let green = Math.round(Math.random() * 255);
        let blue = Math.round(Math.random() * 255);
        return new cc.Color(red, green, blue);
    }

    randomPos() {
        // get random position
        let width = this.node.parent.width;
        let height = this.node.parent.height;
        let x = Math.round(Math.random() * width) - width / 2;
        let y = Math.round(Math.random() * height) - height / 2;
        return cc.v2(x, y);
    }

    addSpeed() {
        this.speed += 1;
        this.recordPointsAll();
    }
    resumeSpeed() {
        this.speed -= 1;
        this.recordPointsAll();
    }

    getNewFood() {
        let rand = Math.random() * 100;
        let type = 0;
        // if (rand < 50) {
        //     if (Math.random() * 100 < 50) {
        //         type = 1
        //     }
        // } else {
        //     type = Math.floor(Math.random() * (this.foodType - 2)) + 2;
        // }

        ResManager.I.loadBundlePrefab("pb/item/food" + type, (pb) => {
            let newFood = cc.instantiate(pb);
            this.ndFood.addChild(newFood);
        });
    }

    getNewMonster() {
        // let type = Math.floor(Math.random() * 2);
        // type = 1;
        let type = "";

        ResManager.I.loadBundlePrefab("pb/item/monster" + type, (pb) => {
            let newMonster = cc.instantiate(pb);
            this.ndFood.addChild(newMonster);
            this.monsterArray.push(newMonster);
        });
    }


    getNewBody() {
        // initialize body or get longer after eating food
        // let newBody = cc.instantiate(this.bodyPrefab);
        // let item = newBody.getComponent("body");
        // item.curIndex = 0;

        let newBody: any = cc.instantiate(this.bodyPrefab);
        newBody.getComponent(cc.Sprite).spriteFrame = this.bodySpFrames[GameData.userInfo.skinId - 1]
        if (this.snakeArray.length > this.bodyNum) {
            newBody.curIndex = this.snakeArray[this.snakeArray.length - 1].curIndex;
        } else {
            newBody.curIndex = 0;
        }

        // set new body's position
        if (this.snakeArray.length == 2) {
            let dir = this.node.position.normalize();

            dir = this.node.position.sub(this.ndWei.position).normalize();
            newBody.setPosition(this.node.position.sub(dir.mul(this.sectionLen)));
            newBody.angle = this.node.angle;

            this.ndWei.setPosition(newBody.position.sub(dir.mul(this.sectionLen)));
        }
        else {
            let lastBody = this.snakeArray[this.snakeArray.length - 2];
            let lastBOBody = this.snakeArray[this.snakeArray.length - 3];
            let dir = lastBOBody.position.sub(lastBody.position).normalize();
            newBody.setPosition(lastBody.position.sub(dir.mul(this.sectionLen)));
            newBody.angle = lastBody.angle;

            // this.ndWei.setPosition(this.ndWei.position.sub(dir.mul(this.sectionLen)));
            this.ndWei.setPosition(newBody.position.sub(dir.mul(this.sectionLen)));
        }

        // // new body's color should be same as that of head
        // newBody.color = this.node.color;

        // add to canvas and snakeArray
        this.node.parent.addChild(newBody);
        this.snakeArray.splice(this.snakeArray.length - 1, 0, newBody)
        // this.snakeArray.push(newBody);
        this.recordPoints();

        this.changeZIndex();

    }

    rotateHead(headPos) {
        // change head's direction
        let angle = cc.v2(1, 0).signAngle(headPos) * 180 / Math.PI;
        // this.node.angle = angle-90;
        this.node.angle = angle;
    }

    // moveSnake() {
    //     // move snake
    //     let dis = this.dir.mul(this.speed);
    //     this.node.setPosition(this.node.position.add(dis));
    //     this.pointsArray.push(this.node.position);
    // }

    moveSnake() {
        // move snake
        let dis = this.dir.mul(this.speed);
        this.node.setPosition(this.node.position.add(dis));
        this.pointsArray.push(this.node.position);
        this.weiPossArray.push(this.node.position);

        // plus one every time when head moves
        this.headPointsNum += 1;

        // console.log(this.snakeArray.length);
        for (let i = 1; i < this.snakeArray.length; i++) {
            let num = Math.floor((this.pointsArray.length - this.headPointsNum) / (this.snakeArray.length - 1) * (this.snakeArray.length - 1 - i));
            // console.log(num);
            // console.log(this.snakeArray[i].curIndex);
            if (i == this.snakeArray.length - 1) {
                let pos = this.weiPossArray[num + this.snakeArray[i].curIndex].sub(this.snakeArray[i].position);
                if (pos != cc.Vec2.ZERO) {
                    let angle = cc.v2(1, 0).signAngle(pos) * 180 / Math.PI;
                    this.snakeArray[i].angle = angle;
                }

                this.snakeArray[i].setPosition(this.weiPossArray[num + this.snakeArray[i].curIndex]);
                this.snakeArray[i].curIndex += 1;
            } else {
                let pos = this.pointsArray[num + this.snakeArray[i].curIndex].sub(this.snakeArray[i].position);
                if (pos != cc.Vec2.ZERO) {
                    let angle = cc.v2(1, 0).signAngle(pos) * 180 / Math.PI;
                    this.snakeArray[i].angle = angle;
                }

                this.snakeArray[i].setPosition(this.pointsArray[num + this.snakeArray[i].curIndex]);
                this.snakeArray[i].curIndex += 1;
            }

        }
    }

    recordPointsAll() {
        this.pointsArray = [];
        this.headPointsNum = 0;
        for (let i = 1; i < this.snakeArray.length - 1; i++) {
            this.snakeArray[i].curIndex = 0;
            let len = 0;
            let index = 0;
            let maxLen = this.sectionLen;
            while (len < maxLen) {
                len += this.speed;

                let lastBody = this.snakeArray[i];
                let lastBOBody = this.snakeArray[i - 1];
                let dir = lastBOBody.position.sub(lastBody.position).normalize();

                let pos = lastBody.position.add(dir.mul(len));
                this.pointsArray.splice(index, 0, pos);

                index += 1;
            };
        }
        this.recordPointsWei();
    }

    recordPoints() {
        // record points between bodies (head is a special body)
        let len = 0;
        let index = 0;
        let maxLen = this.sectionLen;

        while (len < maxLen) {
            len += this.speed;

            let lastBody = this.snakeArray[this.snakeArray.length - 2];
            let lastBOBody = this.snakeArray[this.snakeArray.length - 3];
            let dir = lastBOBody.position.sub(lastBody.position).normalize();

            let pos = lastBody.position.add(dir.mul(len));
            this.pointsArray.splice(index, 0, pos);

            index += 1;
        };

        this.recordPointsWei();

    }

    recordPointsWei() {
        // record points between bodies (head is a special body)
        this.weiPossArray = [];
        let len = 0;
        let index = 0;
        let maxLen = 0; //this.sectionLen/4;
        for (let i = 0; i < this.pointsArray.length; i++) {
            let pos = this.pointsArray[i];
            this.weiPossArray.push(pos);
        }
        this.snakeArray[this.snakeArray.length - 1].curIndex = 0;
        while (len < maxLen) {
            len += this.speed;

            let lastBody = this.snakeArray[this.snakeArray.length - 1];
            let lastBOBody = this.snakeArray[this.snakeArray.length - 2];
            let dir = lastBOBody.position.sub(lastBody.position).normalize();

            let pos = lastBody.position.add(dir.mul(len));
            this.weiPossArray.splice(index, 0, pos);
            index += 1;
        };
    }

    changeZIndex() {
        for (let i = 0; i < this.snakeArray.length; i++) {
            this.snakeArray[i].zIndex = cc.macro.MAX_ZINDEX - i;
        }
    }

    onCollisionEnter(other, self) {
        // remove current food
        if (Game.I.isPause) {
            return;
        }
        let group = other.node.group;
        switch (group) {
            case "food":
                this.isStartColl = true;
                other.node.removeFromParent();

                // produce new food
                this.getNewFood();

                // generate new body
                this.getNewBody();
                this.score += 10;
                // if (this.score % 20 == 0) {
                //     this.getNewMonster();
                // }
                Game.I.addScore(10);

                this.speed += this.disSpeed;
                this.recordPointsAll();
                break;
            case "food1":
                this.isStartColl = true;
                this.isYuanbao = false;
                other.node.removeFromParent();

                // produce new food
                this.getNewFood();

                // generate new body
                this.getNewBody();
                this.score += 20;
                // if (this.score % 20 == 0) {
                //     this.getNewMonster();
                // }
                Game.I.addScore(20);
                this.speed = this.speed + this.disSpeed * 2;
                this.recordPointsAll();
                break;
            case "body":
                if (this.isStartColl && GameData.invincible == false) {
                    Game.I.isPause = true;
                    this.gamePause();
                    console.log("gameover 碰撞身体");
                    Game.I.setGameOver();
                }
                break;
            case "wall":
                if (GameData.invincible == false) {
                    Game.I.isPause = true;
                    this.gamePause();
                    console.log("gameover 碰撞沙滩");
                    Game.I.setGameOver();
                }
                break;
            case "monster":
                if (GameData.invincible == false) {
                    Game.I.isPause = true;
                    this.gamePause();
                    console.log("gameover 碰撞金鱼");
                }
                Game.I.setGameOver();
                break;

            default:
                break;
        }

    }

    update(dt) {
        if (Game.I.isPause) {
            return;
        }
        if (this.dir) {
            // change head's direction
            this.rotateHead(this.dir);

            // move snake
            this.moveSnake();
        }
    }

    gamePause() {
        for (let i = 0; i < this.monsterArray.length; i++) {
            let node = this.monsterArray[i];
            if (cc.isValid(node)) {
                node.getComponent(monster).gamePause();
            }
        }
    }

    gameResume() {
        for (let i = 0; i < this.monsterArray.length; i++) {
            let node = this.monsterArray[i];
            if (cc.isValid(node)) {
                node.getComponent(monster).gameResume();
            }
        }
    }

}
