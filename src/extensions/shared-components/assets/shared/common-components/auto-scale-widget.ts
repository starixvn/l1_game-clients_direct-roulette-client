import { _decorator, Component, Enum, Node, UITransform } from "cc";
import { EDITOR } from "cc/env";

const { ccclass, disallowMultiple, executeInEditMode, property } = _decorator;

export enum AutoScalePolicy {
    /** Matches parent's width, dynamic height. */
    MatchWidth = 0,

    /** Matches parent's height, dynamic width. */
    MatchHeight = 1,

    /** Fits parent's size. */
    FitContent = 2,
}

/** Automatically scales to match parent's size. */
@ccclass("Auto Scale Widget")
@disallowMultiple
@executeInEditMode
export class AutoScaleWidget extends Component {
    @property({ type: Enum(AutoScalePolicy) })
    protected _policy = AutoScalePolicy.FitContent;

    @property({ type: Enum(AutoScalePolicy) })
    public get policy(): AutoScalePolicy {
        return this._policy;
    }

    public set policy(value: AutoScalePolicy) {
        this._policy = value;
        this.updateDisplay();
    }

    public onEnable(): void {
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.node.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.node.parent.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.node.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
    }

    public update(delta: number): void {
        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected updateDisplay(): void {
        const nodeParentUITransform = this.node.parent.getComponent(UITransform);
        const nodeUITransform = this.node.getComponent(UITransform);
        let scale = 1;

        if (this.policy === AutoScalePolicy.MatchHeight) {
            scale = nodeParentUITransform.height / nodeUITransform.height;
        } else if (this.policy === AutoScalePolicy.MatchWidth) {
            scale = nodeParentUITransform.width / nodeUITransform.width;
        } else {
            const scaleX = nodeParentUITransform.width / nodeUITransform.width;
            const scaleY = nodeParentUITransform.height / nodeUITransform.height;
            scale = Math.min(scaleX, scaleY);
        }
        this.node.setScale(scale, scale);
    }
}
