const {ccclass, property} = cc._decorator;

@ccclass
export default class JoyStick extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

 

    // @property
    // text: string = 'hello';

    private maxSpeed = 10;

    private joyStickBtn:cc.Node;

    start () {
        // init logic
        // this.label.string = this.text;
    }

    onLoad () {
    // hide FPS info
    cc.debug.setDisplayStats(false);

    this.joyStickBtn = this.node.children[2].children[0];
    console.log(this.joyStickBtn);

    // this.joyStickBtn = this.node.getComponent("da").getComponent("xiao"); 
 
    // touch event
    this.node.on('touchstart', this.onTouchStart, this);
    this.node.on('touchmove', this.onTouchMove, this);
    this.node.on('touchend', this.onTouchEnd, this);
    }


    onDestroy() {
        // touch event
        this.node.off('touchstart', this.onTouchStart, this);
        this.node.off('touchmove', this.onTouchMove, this);
        this.node.off('touchend', this.onTouchEnd, this);
        this.node.off('touchcancel', this.onTouchCancel, this);
    }

private onTouchStart(event) {
    // when touch starts, set joyStickBtn's position 
    let pos = this.joyStickBtn.convertToNodeSpaceAR(event.getLocation());
    this.joyStickBtn.setPosition(pos);
}
 
private onTouchMove(event) {
    // constantly change joyStickBtn's position
    // let posDelta = event.getDelta();
    // this.joyStickBtn.setPosition(this.joyStickBtn.position.add(posDelta));
    // this.dir = this.joyStickBtn.position.normalize();
    let posDelta = event.getDelta();
    this.joyStickBtn.setPosition(this.joyStickBtn.position.add(posDelta));
            
    // get direction
    let dir = this.joyStickBtn.position.normalize();
    
    this.player.getComponent("head").dir = dir;
    
}
 
private onTouchEnd(event) {
    // reset
    this.joyStickBtn.setPosition(cc.v2(0, 0));
}
 
private onTouchCancel(event) {
    // reset
    this.joyStickBtn.setPosition(cc.v2(0, 0));
}


update (dt) {
    // get ratio
    let len = this.joyStickBtn.position.mag();
    let maxLen = 200 / 2;
    let ratio = len / maxLen;
 
    // restrict joyStickBtn inside the joyStickPanel
    if (ratio > 1) {
        this.joyStickBtn.setPosition(this.joyStickBtn.position.div(ratio));
    }

    
    // let dis = this.dir.mul(this.maxSpeed * ratio);
    // this.player.setPosition(this.player.position.add(dis))

    if (this.player.x > this.player.parent.width / 2)
        this.player.x = this.player.parent.width / 2;
    else if (this.player.x < -this.player.parent.width / 2)
        this.player.x = -this.player.parent.width /2;
 
    if (this.player.y > this.player.parent.height / 2)
        this.player.y = this.player.parent.height / 2;
    else if (this.player.y < -this.player.parent.height / 2)
        this.player.y = -this.player.parent.height / 2;
}
}
