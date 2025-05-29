import { Component, Layout, ScrollView, UITransform, _decorator } from "cc";
import { ChipScrollView } from "db://shared-components/shared/common-components/scroll-view/scripts/components/chip-scroll-view";

const { ccclass, property } = _decorator;

@ccclass
export class VerticalSnapScrollView extends Component {
    @property
    itemSize = 84;

    @property
    enableHalfSpacing = false;

    @property
    paddingTop = 10;

    @property
    paddingBottom = 10;

    @property
    verticalSpacing = 15;

    private _calculatedPercent: number[] = [];
    private _minDisplay = 0;
    private _scrollView: ChipScrollView;

    get scrollView() {
        if (!this._scrollView) {
            this._scrollView = this.getComponent(ChipScrollView);
        }
        return this._scrollView;
    }

    onLoad() {
        this.applyLayoutSettings();
    }

    // Apply layout settings to the content node
    private applyLayoutSettings() {
        if (!this.scrollView?.content) return;

        const layout = this.scrollView.content.getComponent(Layout);
        if (layout) {
            layout.paddingTop = this.paddingTop;
            layout.paddingBottom = this.paddingBottom;
            layout.spacingY = this.verticalSpacing;
        }
    }

    public initCalculatedPercent() {
        this._calculatedPercent = [];
        const count = this.contentItemCount();
        const contentHeight = this.scrollContentHeight();
        const maxOffset = Math.max(0, contentHeight - (this.scrollView?.node?.getComponent(UITransform)?.height || 0));
        const haftSpacing = this.verticalSpacing / 2;
        
        for (let i = 0; i < count; i++) {
            let offset = (this.itemSize + this.verticalSpacing) * i + (this.enableHalfSpacing ? haftSpacing : 0);
            if (offset > maxOffset) {
                offset = maxOffset;
            }

            const percent = maxOffset > 0 ? offset / maxOffset : 0;
            this._calculatedPercent.push(percent);
        }
    }

    private contentItemCount() {
        return this.scrollView?.content?.children?.length || 0;
    }

    private scrollContentHeight() {
        const count = this.contentItemCount();
        return count * this.itemSize + (count - 1) * this.verticalSpacing + this.paddingTop + this.paddingBottom;
    }

    public onScrollView(scrollView: ScrollView, eventType: number) {
        if (eventType === 9) { // scroll-ended
            this.onScrollEnd();
        }
    }

    onScrollEnd() {
        const percent = this.getPercent();
        this.calculateMinDisplay(percent);
        this.actionScrollEnded();
    }

    private getPercent(): number {
        const offset = -this.scrollView?.getScrollOffset()?.y;
        if (offset < 0) {
            return 0;
        }
        const maxOffset = this.scrollView?.getMaxScrollOffset()?.y;
        if (maxOffset <= 0) {
            return 0;
        }
        const percent = offset / maxOffset;
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
        if (this._calculatedPercent[index] !== undefined) {
            this.scrollView?.scrollToPercentVertical(this._calculatedPercent[index], 0.3, true);
        }
    }

    public actionScrollEnded = () => {};

    public getMinDisplay(): number {
        return this._minDisplay;
    }

    // Method to update layout settings at runtime
    public updateLayoutSettings() {
        this.applyLayoutSettings();
        if (this.scrollView?.content) {
            const layout = this.scrollView.content.getComponent(Layout);
            if (layout) {
                layout.updateLayout();
            }
        }
        this.initCalculatedPercent();
    }

    // Setters to update properties and apply changes
    public setPaddingTop(value: number) {
        this.paddingTop = value;
        this.updateLayoutSettings();
    }

    public setPaddingBottom(value: number) {
        this.paddingBottom = value;
        this.updateLayoutSettings();
    }



    public setVerticalSpacing(value: number) {
        this.verticalSpacing = value;
        this.updateLayoutSettings();
    }
} 