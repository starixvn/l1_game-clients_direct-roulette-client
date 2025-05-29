import { Component, Label, Mask, RichText, UITransform, _decorator, tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class EffectAppearanceLabel extends Component {
    @property(Label)
    label: Label = null;

    @property(RichText)
    richText: RichText = null;

    @property(Mask)
    mask: Mask = null;

    @property
    speed = 400;

    private _value: string;

    get string() {
        return this.label?.string || this.richText?.string;
    }

    set string(value: string) {
        this._value = value;
        const updated = (this.label && value !== this.label?.string) || (this.richText && value !== this.richText?.string);

        this.label && (this.label.string = value);
        this.richText && (this.richText.string = value);
        if (updated) {
            this.playAnimation();
        }
    }

    protected getContentWidth(): number {
        return this.label
            ? this.label.node.getComponent(UITransform).width
            : this.richText
            ? this.richText.node.getComponent(UITransform).width * this.richText.node.scale.x
            : 0;
    }

    protected calculateDistance(): number {
        const padding = 20;
        return !this._value.length ? 0 : this.getContentWidth() + padding;
    }

    public playAnimation() {
        this.mask.node.getComponent(UITransform).width = 0;

        const width = this.calculateDistance();
        if (!this.mask.node.activeInHierarchy) {
            this.mask.node.getComponent(UITransform).width = width;
            return;
        }
        const duration = width / this.speed;
        tween(this.mask.node.getComponent(UITransform)).to(duration, { width: width }).start();
    }
}
