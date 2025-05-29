import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

export enum CrossControlAction {
    Click = "cross-control-click",
}

@ccclass
export class CrossControlItem extends Component {
    private _canvas: Node = null;
    get canvas(): Node {
        if (!this._canvas) {
            this._canvas = director.getScene().getChildByName("Canvas");
        }

        return this._canvas;
    }

    listener: Function;
    onLoad() {
        this.node.on("click", this.onClick, this);
    }

    onDestroy() {
        this.node.off("click", this.onClick, this);
        this.listener && this.removeListener();
    }

    onClick() {
        if (this.canvas) {
            this.canvas.emit(CrossControlAction.Click, this.node.uuid);
        }
    }

    registerListenerOtherControls(callback: (nodeId: string) => void) {
        this.listener = (nodeId: string) => {
            if (this.node.uuid !== nodeId) {
                callback(nodeId);
            }
        };
        this.canvas.on(CrossControlAction.Click, this.listener);
    }

    removeListener() {
        this.canvas.off(CrossControlAction.Click, this.listener);
    }
}
