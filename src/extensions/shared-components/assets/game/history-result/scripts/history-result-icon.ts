import { _decorator, CCString, Component, Layers, Node, Sprite, SpriteFrame, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HistoryResultIcon")
export class HistoryResultIcon extends Component {
    @property(Sprite)
    spriteFrame: Sprite = null;

    @property(CCString)
    resultKey = "result.dice1";

    @property(CCString)
    spritePrefix = "";

    @property(CCString)
    highlightPrefix = "";

    outline: Node = null;

    setOutline(spriteFrame: SpriteFrame) {
        const outlineNode = new Node("outline");
        outlineNode.layer = Layers.Enum.UI_2D;
        const outline = outlineNode.addComponent(Sprite);
        outline.spriteFrame = spriteFrame;
        this.node.addChild(outlineNode);
        this.outline = outlineNode;
    }

    removeOutline() {
        this.outline?.destroy();
    }

    runAnimation() {
        const duration = 0.2;
        return tween(this.node)
            .sequence(
                tween().to(duration, { scale: new Vec3(0.85, 0.85) }),
                tween().to(duration, { scale: new Vec3(1, 1) }),
                tween().delay(0.15),
                tween().to(duration, { scale: new Vec3(0.85, 0.85) }),
                tween().to(duration, { scale: new Vec3(1, 1) })
            )
            .start();
    }
}
