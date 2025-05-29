import { _decorator, Layout, Node, ScrollView, Sprite, SpriteFrame, UITransform } from 'cc';
import { ObserverComponent } from 'db://shared-components/shared/common-components/observer-component/scripts/observer-component';

const { ccclass, property } = _decorator;


@ccclass('SevenUpDownGameScoreBoard')
export class SevenUpDownGameScoreBoard extends ObserverComponent {
    @property(Node)
    nodeMaskRoundHistory: Node = null;

    @property(Node)
    nodeMaskBigRoad: Node = null;

    @property(Node)
    nodeWrapper: Node = null;

    @property(SpriteFrame)
    spriteFrameIconCollapse: SpriteFrame = null;

    @property(SpriteFrame)
    spriteFrameIconExpand: SpriteFrame = null;

    @property(ScrollView)
    scrollBigRoad: ScrollView = null;

    @property(ScrollView)
    scrollRoundHistory: ScrollView = null;

    @property(Sprite)
    sprChangeModeHistory: Sprite = null;
    
    private isExpandHistory = false;

    private readonly WIDTH_COLLAPSE_HISTORY = 150;
    private readonly WIDTH_SPACING = 28;
    private readonly WIDTH_GAME = 828;

    private updateNodeWidths(expandedNode: Node, collapsedNode: Node) {
        const widthNodeRemain = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_HISTORY;
        expandedNode.getComponent(UITransform).width = widthNodeRemain;
        collapsedNode.getComponent(UITransform).width = this.WIDTH_COLLAPSE_HISTORY;
    }

    onClickExpandMode() {
        this.isExpandHistory = !this.isExpandHistory;

        // Update node widths based on expanded state
        if (this.isExpandHistory) {
            this.updateNodeWidths(this.nodeMaskRoundHistory, this.nodeMaskBigRoad);
            this.sprChangeModeHistory.spriteFrame = this.spriteFrameIconCollapse;
        } else {
            this.updateNodeWidths(this.nodeMaskBigRoad, this.nodeMaskRoundHistory);
            this.sprChangeModeHistory.spriteFrame = this.spriteFrameIconExpand;
        }

        // Reset and update scrollviews
        [this.scrollBigRoad, this.scrollRoundHistory].forEach((scroll) => {
            scroll.stopAutoScroll();
            scroll.scrollToRight();
        });

        // Update layout
        this.nodeWrapper.getComponent(Layout).updateLayout();

        this.scheduleOnce(() => {
            this.scrollRoundHistory.scrollToRight();
        }, 0.1);
    }
}


