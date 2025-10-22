import AudioManager from "./AudioManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GButton extends cc.Component {

    static AddClick (node: cc.Node, endFunc: Function, target, startFunc?: Function, moveFunc?: Function, cancelFunc?: Function, type = 1, isScale = true) {
        if (!cc.isValid(node)) {
            return;
        }
        let scale = node.scale;
        node.on(cc.Node.EventType.TOUCH_START, (e) => {
            if (!cc.isValid(node)) {
                return;
            }
            if (isScale) {
                node.scale = scale * 1.05;
            }
            if (type == 1) {
                //播放点击按钮音效
                AudioManager.playEffect("click");
            }
            startFunc && startFunc.call(target, e); 
        }, target);
        node.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if (!cc.isValid(node)) {
                return;
            }
            moveFunc && moveFunc.call(target, e); 
        }, target)
        node.on(cc.Node.EventType.TOUCH_END, (e) => {
            if (!cc.isValid(node)) {
                return;
            }
            if (isScale) {
                node.scale = scale;
            }
            endFunc && endFunc.call(target, e);
        }, target)
        node.on(cc.Node.EventType.TOUCH_CANCEL, (e) => {
            if (!cc.isValid(node)) {
                return;
            }
            if (isScale) {
                node.scale = scale;
            }
            cancelFunc && cancelFunc.call(target, e);
        }, target)
    }

    static RemoveAndAddClick (node: cc.Node, endFunc, target, startFunc?, moveFunc?, cancelFunc?, type = 1, isScale = true) {
        if (!cc.isValid(node)) {
            return;
        }

        this.removeClick(node);
        this.AddClick(node, endFunc, target, startFunc, moveFunc, cancelFunc, type, isScale);
    }

    static removeClick (node: cc.Node) {
        if (!cc.isValid(node)) {
            return;
        }
        node.off(cc.Node.EventType.TOUCH_START);
        node.off(cc.Node.EventType.TOUCH_MOVE);
        node.off(cc.Node.EventType.TOUCH_END);
        node.off(cc.Node.EventType.TOUCH_CANCEL);
    }
}
