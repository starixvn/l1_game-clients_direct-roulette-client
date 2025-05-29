import { Button, Color, Component, Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import { NumberUtils } from "./../../../../shared/utils";

const { ccclass, property } = _decorator;

export enum ChipDisplayType {
    Normal = 0,
    VIP,
}

@ccclass
export default class Chip extends Component {
    @property(Node)
    background: Node = null;

    @property(Sprite)
    center: Sprite = null;

    @property(Sprite)
    border: Sprite = null;

    @property(SpriteFrame)
    centerFrames: SpriteFrame[] = [];

    @property(SpriteFrame)
    borderFrames: SpriteFrame[] = [];

    @property(Node)
    typeNodes: Node[] = [];

    @property(Label)
    lblValue: Label = null;

    private _color = Color.WHITE;
    private _type = ChipDisplayType.Normal;

    setColor(color: Color) {
        this._color = color;
        this.background.getComponent(Sprite).color = color;
        this.updateChip();
    }

    setType(type: ChipDisplayType) {
        this._type = type;
        this.center.spriteFrame = this.centerFrames[type];
        this.border.spriteFrame = this.borderFrames[type];

        this.typeNodes.forEach((node, index) => {
            node.active = index === type;
        });
        this.updateChip();
    }

    private updateChip() {
        this.center.color = this._type === ChipDisplayType.VIP ? this._color : Color.WHITE;
        this.lblValue.color = this._type === ChipDisplayType.VIP ? Color.YELLOW : Color.WHITE;
    }

    setValue(value: number) {
        this.lblValue.string = NumberUtils.getChipFormatter(value, 0);
        this.node.name = value.toString();
    }

    handleSmallChip(isSmall = false) {
        this.lblValue.node.active = isSmall;

        const button = this.getComponent(Button);
        button && (button.enabled = false);
        this.hideSomeSprites();
    }

    hideSomeSprites() {
        ["bg-overlay", "bg-circle"].forEach((name) => {
            const node = this.typeNodes[ChipDisplayType.Normal].getChildByName(name);
            node && (node.active = false);
        });
    }
}
