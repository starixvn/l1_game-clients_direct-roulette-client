import { _decorator, CCString, Component, Enum, Node, SpriteAtlas, SpriteFrame, Tween, tween, UIOpacity } from "cc";
import { HistoryResultIcon } from "./history-result-icon";
const { ccclass, property } = _decorator;

export enum HighlightType {
    Grid = 0,
    ICons = 1,
    Outline = 2,
    None = 3,
}

@ccclass("HistoryResultItem")
export class HistoryResultItem extends Component {
    @property([HistoryResultIcon])
    icons: HistoryResultIcon[] = [];

    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(CCString)
    defaultPrefix = "";

    @property({ type: Enum(HighlightType) })
    highlightType: HighlightType = 0;

    @property({
        type: Node,
        visible: function () {
            return this.highlightType === HighlightType.Grid;
        },
    })
    nodeHighlightGrid: Node = null;

    @property({
        visible: function () {
            return this.highlightType === HighlightType.ICons;
        },
    })
    defaultHighlightIconPrefix = "";

    @property({
        visible: function () {
            return this.highlightType === HighlightType.Outline;
        },
    })
    highlightOutlinePrefix = "";

    @property(Node)
    nodeEndGrid: Node = null;

    @property({
        type: Node,
        visible: function () {
            return this.nodeEndGrid !== null;
        },
    })
    nodeGrid: Node = null;

    public round: any = null;
    private iconSpriteNames = [];
    private highlightAnimation: Tween<any> = null;

    public setData(round: any): void {
        if (round) {
            this.round = round;
            this.iconSpriteNames = this.icons.map((icon) => this.getIconSpriteName(icon.resultKey));
            this.setIconSpriteFrame(this.defaultPrefix);
        }
    }

    public highlight() {
        switch (this.highlightType) {
            case HighlightType.Grid:
                this.highlightGrid();
                break;
            case HighlightType.ICons:
                this.highlightIcons();
                break;
            case HighlightType.Outline:
                this.highlightOutline();
                break;
            default:
                return;
        }
    }

    private highlightGrid() {
        if (this.nodeHighlightGrid) {
            this.nodeHighlightGrid.active = true;
            if (this.nodeHighlightGrid.getComponent(UIOpacity)) {
                this.highlightAnimation = tween(this.nodeHighlightGrid.getComponent(UIOpacity))
                    .sequence(tween().to(0.7, { opacity: 100 }), tween().to(0.7, { opacity: 255 }))
                    .repeatForever()
                    .start();
            }
        }
    }

    private highlightIcons() {
        this.setIconSpriteFrame(this.defaultHighlightIconPrefix, true);
        this.runIconAnimation();
    }

    private highlightOutline() {
        const spriteFrame = this.atlas?.getSpriteFrame(this.highlightOutlinePrefix);
        spriteFrame && this.icons.forEach((icon) => icon.setOutline(spriteFrame));
        this.runIconAnimation();
    }

    private runIconAnimation() {
        const iconsTween = this.icons.flatMap((icon) => [tween().call(() => icon.runAnimation()), tween().delay(1.1)]);
        this.highlightAnimation = tween(this.node)
            .sequence(...iconsTween)
            .repeatForever()
            .start();
    }

    public removeHighlight() {
        this.removeHighlightAnimation();
        switch (this.highlightType) {
            case HighlightType.Grid:
                this.removeHighlightGrid();
                break;
            case HighlightType.ICons:
                this.removeHighlightIcons();
                break;
            case HighlightType.Outline:
                this.removeHighlightOutline();
                break;
            default:
                return;
        }
    }

    private removeHighlightGrid() {
        this.nodeHighlightGrid && (this.nodeHighlightGrid.active = false);
    }

    private removeHighlightIcons() {
        this.setIconSpriteFrame(this.defaultPrefix);
    }

    private removeHighlightOutline() {
        this.icons.forEach((icon) => icon.removeOutline());
    }

    private removeHighlightAnimation() {
        this.highlightAnimation?.stop();
    }

    private getIconSpriteName(key: string): string {
        try {
            return key
                .split(".")
                .reduce((result, k) => result[k], { ...this.round })
                .toString();
        } catch (e) {
            return "";
        }
    }

    private setIconSpriteFrame(defaultPrefix: string, isHighlight = false) {
        this.iconSpriteNames.forEach((name, index) => {
            const icon = this.icons?.[index];
            const iconSpritePrefix = isHighlight ? icon?.highlightPrefix : icon?.spritePrefix;
            const prefix = iconSpritePrefix || defaultPrefix;
            const spriteFrame = this.getSpriteFrame(prefix, name);
            icon?.spriteFrame && spriteFrame && (this.icons[index].spriteFrame.spriteFrame = spriteFrame);
        });
    }

    private getSpriteFrame(prefix: string, name: string): SpriteFrame {
        return name ? this.atlas?.getSpriteFrame(`${prefix}${name}`) : null;
    }

    setEndGrid() {
        this.nodeGrid && (this.nodeGrid.active = false);
        this.nodeEndGrid && (this.nodeEndGrid.active = true);
    }
}
