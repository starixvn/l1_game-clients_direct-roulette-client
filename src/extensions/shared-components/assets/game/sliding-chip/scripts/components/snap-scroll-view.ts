import { Component, ScrollView, UITransform, _decorator } from "cc";

import { ChipScrollView } from "../../../../shared/common-components/scroll-view/scripts/components/chip-scroll-view";

const { ccclass, property } = _decorator;

export const eventMapScrollView = {
    "scroll-to-top": 0,
    "scroll-to-bottom": 1,
    "scroll-to-left": 2,
    "scroll-to-right": 3,
    scrolling: 4,
    "bounce-bottom": 6,
    "bounce-left": 7,
    "bounce-right": 8,
    "bounce-top": 5,
    "scroll-ended": 9,
    "touch-up": 10,
    "scroll-ended-with-threshold": 11,
    "scroll-began": 12,
};

@ccclass
export class SnapScrollView extends Component {
    @property
    itemSize = 84;

    @property
    spacing = 9;

    @property
    enableHalfSpacing = false;

    @property
    isHorizontalLayout = true;

    private _calculatedPercent: number[] = [];
    private _minDisplay = 0;
    private _scrollView: ChipScrollView;

    get scrollView() {
        if (!this._scrollView) {
            this._scrollView = this.getComponent(ChipScrollView);
        }
        return this._scrollView;
    }

    public initCalculatedPercent() {
        this._calculatedPercent = [];
        const count = this.contentItemCount();
        const contentWidth = this.scrollContentWidth();
        const maxOffset = contentWidth - this.scrollView?.node?.getComponent(UITransform)?.width;
        const haftSpacing = this.spacing / 2;
        for (let i = 0; i < count; i++) {
            let offset = (this.itemSize + this.spacing) * i + (this.enableHalfSpacing ? haftSpacing : 0);
            if (offset > maxOffset) {
                offset = maxOffset;
            }

            const percent = offset / maxOffset;
            this._calculatedPercent.push(percent);
        }
    }

    private contentItemCount() {
        return this.isHorizontalLayout
            ? this.scrollView?.content?.children?.length
            : Math.round(this.scrollView?.content?.getComponent(UITransform)?.width / (this.itemSize + this.spacing));
    }

    private scrollContentWidth() {
        const count = this.contentItemCount();
        return this.isHorizontalLayout
            ? count * this.itemSize + (count + 1) * this.spacing
            : this.scrollView?.content?.getComponent(UITransform)?.width;
    }

    public onScrollView(scrollView: ScrollView, eventType: number) {
        if (eventType === eventMapScrollView["scroll-ended"]) {
            this.onScrollEnd();
        }
    }

    onScrollEnd() {
        const percent = this.getPercent();
        this.calculateMinDisplay(percent);
        this.actionScrollEnded();
    }

    private getPercent(): number {
        const offset = -this.scrollView?.getScrollOffset()?.x;
        if (offset < 0) {
            return 0;
        }
        const percent = offset / this.scrollView?.getMaxScrollOffset()?.x;
        if (percent > 1) {
            return 1;
        }
        return percent;
    }

    private calculateMinDisplay(percent: number) {
        for (let i = 0; i < this._calculatedPercent.length; i++) {
            if (this._calculatedPercent[i] <= percent && percent <= this._calculatedPercent[i + 1]) {
                const delta1 = percent - this._calculatedPercent[i];
                const delta2 = this._calculatedPercent[i + 1] - percent;
                if (delta1 + delta2 > 0) {
                    this._minDisplay = delta1 < delta2 ? i : i + 1;
                }
                break;
            }

            if (percent <= this._calculatedPercent[i]) {
                this._minDisplay = i;
                break;
            }
            if (this._calculatedPercent[i] >= 1) {
                break;
            }
        }
    }

    public scrollTo(index: number) {
        this._minDisplay = index;
        this.scrollView?.scrollToPercentHorizontal(this._calculatedPercent[index], 0.3, true);
    }

    public actionScrollEnded = () => {};

    public getMinDisplay(): number {
        return this._minDisplay;
    }
}
