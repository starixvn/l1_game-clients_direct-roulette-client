import { Component, Label, RichText, UITransform, _decorator, v3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("SharpnessLabel")
export class SharpnessLabel extends Component {
    private readonly fontSizeWeight = 2;
    private get weightScale() {
        return 1 / this.fontSizeWeight;
    }
    label: Label = null;
    richText: RichText = null;

    protected onLoad(): void {
        this.updateLabel();
    }

    updateLabel() {
        this.label = this.node.getComponent(Label);
        this.richText = this.node.getComponent(RichText);

        [this.label, this.richText].forEach((component) => {
            if (component) {
                component.fontSize *= this.fontSizeWeight;
                component.lineHeight *= this.fontSizeWeight;
            }
        });

        if (this.label && this.label.overflow !== Label.Overflow.NONE) {
            const transform = this.label.getComponent(UITransform);
            transform.width *= this.fontSizeWeight;

            if (this.label.overflow !== Label.Overflow.RESIZE_HEIGHT) {
                transform.height *= this.fontSizeWeight;
            }
        }

        if (this.richText) {
            this.richText.maxWidth *= this.fontSizeWeight;
        }

        this.node.scale = v3(this.weightScale, this.weightScale, this.weightScale);
    }
}
