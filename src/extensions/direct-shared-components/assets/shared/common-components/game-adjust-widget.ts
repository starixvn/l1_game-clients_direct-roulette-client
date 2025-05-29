import { _decorator, Component, Node, UITransform, Widget } from "cc";
import { EDITOR } from "cc/env";

const { ccclass, property } = _decorator;

/**
 * Manages widget positioning based on screen size and policy
 */
@ccclass("GameAdjustWidget")
export class GameAdjustWidget extends Component {
    @property
    value: number = -0.1;

    private gameWidget: Widget = null;

    public onLoad(): void {
        this.gameWidget = this.node.getComponent(Widget);
    }

    public onEnable(): void {
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.node.parent.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
    }

    public update(delta: number): void {
        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected updateDisplay(): void {
        if (!this.gameWidget) return;
        this.gameWidget.verticalCenter = this.calculateVerticalCenter();
    }

    private calculateVerticalCenter(): number {
        const parentHeight = this.node.parent.getComponent(UITransform).height;
        const scaleY = this.node.scale.y;
        const gameHeight = this.node.getComponent(UITransform).height * scaleY;
        const deltaHeight = parentHeight - gameHeight;
        const maxOffset = deltaHeight / 2;

        if (parentHeight <= gameHeight) {
            return 0;
        }

        if (Math.abs(this.value) * parentHeight >= maxOffset) {
            const normalizedOffset = maxOffset / parentHeight;
            return this.value < 0 ? -normalizedOffset : normalizedOffset;
        }

        return this.value;
    }
}
