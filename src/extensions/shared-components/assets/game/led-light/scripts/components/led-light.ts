import gc from "@sg/game-client-base";
import { _decorator, CCInteger, instantiate, Node, Prefab, UIOpacity, UITransform, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { LedLightItem } from "./led-light-item";
import { LedLightTooltip, TipAlignment } from "./led-light-tooltip";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("LedLight")
export class LedLight extends ObserverComponent {
    @property(Node)
    containerItem: Node = null;

    @property(Node)
    containerTooltip: Node = null;

    @property(Prefab)
    ledLightItem: Prefab = null;

    @property(Prefab)
    tooltipPrefab: Prefab = null;

    @property(Node)
    nodeNext: Node = null;

    @property
    maxItems = 33;

    @property
    needAlignment = false;

    @property({
        type: CCInteger,
        visible: function (this: LedLight) {
            return this.needAlignment;
        },
    })
    offsetBorderCount = 2;

    protected ledLightItems: LedLightItem[] = [];
    protected selectedLedLight: Node = null;
    protected rounds: gc.RoundHistories.RoundHistory[] = [];
    protected isShowDotNext = false;
    protected toolTipCompt: LedLightTooltip = null;

    onLoad() {
        this.createLedLightItems();
        this.createToolTip();
        super.onLoad();
    }

    protected createLedLightItems() {
        this.containerItem.destroyAllChildren();
        for (let index = 0; index < this.maxItems; index++) {
            const ledLightNode = instantiate(this.ledLightItem);
            const ledLightCompt = ledLightNode.getComponent(LedLightItem);
            ledLightCompt.listener = this.ledLightItemListener;
            this.containerItem.addChild(ledLightNode);
            this.ledLightItems.push(ledLightCompt);
            ledLightNode.active = false;
        }
    }

    protected createToolTip() {
        this.containerTooltip.destroyAllChildren();
        const toolTipNode = instantiate(this.tooltipPrefab);
        this.containerTooltip.addChild(toolTipNode);
        this.toolTipCompt = toolTipNode.getComponent(LedLightTooltip);
        this.hideTooltip();
    }

    protected readonly ledLightItemListener = {
        onEnter: (node: Node) => {
            this.selectedLedLight = node;
            const ledLightInfo = node.getComponent(LedLightItem).ledLightItemInfo;
            if (this.toolTipCompt && ledLightInfo) {
                const pos = this.toolTipCompt.node.parent
                    .getComponent(UITransform)
                    .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
                this.toolTipCompt.node.position = v3(pos.x, this.toolTipCompt.node.position.y, 0);
                this.toolTipCompt.setTooltipInfo(ledLightInfo);
                this.toolTipCompt.showTooltip();

                if (this.needAlignment) {
                    this.alignTooltip(node);
                }
            }
        },
        onLeave: () => {
            this.selectedLedLight = null;
            this.toolTipCompt?.showTooltip(false);
        },
    };

    private alignTooltip(node: Node) {
        const childIndex = node.parent.children.findIndex((child) => child === node);
        let tipAlignment = TipAlignment.Cennter;
        if (childIndex <= this.offsetBorderCount) {
            tipAlignment = TipAlignment.Left;
        }
        if (childIndex >= node.parent.children.length - 1 - this.offsetBorderCount) {
            tipAlignment = TipAlignment.Right;
        }
        this.toolTipCompt.setAlignment(tipAlignment);
    }

    protected onUpdateTooltipInfo(node: Node) {
        const itemInfo = node?.getComponent(LedLightItem).ledLightItemInfo;
        if (this.toolTipCompt?.node?.active && itemInfo) {
            this.toolTipCompt.setTooltipInfo(itemInfo);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isLocking)
    public handleBlinkNextDot(isLocking: boolean) {
        if (isLocking) {
            this.isShowDotNext = isLocking;
            this.hideTooltip();
            this.updateLedLightItemInfo(this.rounds, this.stepStart);
        }
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    public setLedLightInfo(rounds: gc.RoundHistories.RoundHistory[]) {
        this.rounds = [...rounds];
        this.updateLedLightItemInfo(this.rounds, this.stepStart);
    }

    get stepStart() {
        return this.isShowDotNext ? 1 : 0;
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    public hideBlinkNode(isFinishedShowResult: boolean) {
        if (isFinishedShowResult) {
            this.isShowDotNext = false;
        }
    }

    protected updateLedLightItemInfo(rounds: gc.RoundHistories.RoundHistory[], stepStart: number) {
        if (this.rounds.length === 0 || this.ledLightItems.length === 0) {
            return;
        }

        this.hideAllDots(stepStart);
        this.updateFirstLedLightItem();
        this.updateNextNode();

        rounds.forEach((round, index) => {
            const calculatedIndex = stepStart + index;
            if (calculatedIndex >= this.ledLightItems.length) {
                return;
            }
            const ledLightItem = this.ledLightItems[calculatedIndex];
            ledLightItem.setLedLightItemInfo(round);
            ledLightItem.node.active = true;
        });

        this.updateSelectedLedLightTooltip();
    }

    protected hideAllDots(stepStart: number) {
        this.ledLightItems.forEach((item, index) => {
            if (index >= stepStart) {
                item.setStatusNode(false);
            }
        });
    }

    protected updateFirstLedLightItem() {
        const firstLedLightItem = this.ledLightItems[0];
        if (firstLedLightItem) {
            firstLedLightItem.getComponent(UIOpacity).opacity = this.isShowDotNext ? 1 : 255;
            firstLedLightItem.highlight.active = !this.isShowDotNext;
        }
    }

    protected updateNextNode() {
        this.nodeNext && (this.nodeNext.active = this.isShowDotNext);
    }

    protected updateSelectedLedLightTooltip() {
        this.selectedLedLight && this.onUpdateTooltipInfo(this.selectedLedLight);
    }

    protected hideTooltip() {
        this?.toolTipCompt.showTooltip(false);
    }
}
