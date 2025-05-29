import { _decorator, Component, Constructor, instantiate, Layout, Node, ScrollView, v2 } from "cc";
import { GridItemSettings } from "../settings/grid-item-settings";
import { GridLayoutSettings } from "../settings/grid-layout-settings";
import { GridItem } from "./grid-item";

const { ccclass, property } = _decorator;

@ccclass
export class GridLayout extends Component {
    @property(ScrollView)
    public scrollView: ScrollView = null;

    @property(Layout)
    public layout: Layout = null;

    @property(GridItemSettings)
    public itemSettings: GridItemSettings = null;

    @property(GridLayoutSettings)
    public settings: GridLayoutSettings = null;

    get content(): Node {
        return this.layout.node;
    }

    public render<D, T extends GridItem<D>>(classConstructor: Constructor<T>, items: D[]): void {
        this.removeUnusedNodes(items.length);

        items.forEach((item, index) => {
            const node = this.content.children[index];

            if (!node) {
                const newNode = instantiate(this.itemSettings.prefab);
                const component = this.getItemComponent(newNode, classConstructor);

                component.render(this.itemSettings, item, this.node, index);

                this.content.addChild(newNode);
            } else {
                const component = this.getItemComponent(node, classConstructor);

                component.render(this.itemSettings, item, this.node, index);
            }
        });

        this.updateLayout();
        this.scrollToEnd();
    }

    protected removeUnusedNodes(contentLength: number) {
        if (this.content.children.length > contentLength) {
            for (let index = contentLength; index < this.content.children.length; index++) {
                const node = this.content.children[index];

                node?.destroy();
            }
        }
    }

    protected getItemComponent<T extends Component>(node: Node, classConstructor: Constructor<T>): T {
        return node.getComponent(classConstructor) ?? node.getComponentInChildren(classConstructor);
    }

    onEnable() {
        this.updateLayout();
        this.scrollToEnd();
    }

    protected updateLayout() {
        if (!this.layout) {
            return;
        }
        this.layout.enabled = true;
        this.layout.updateLayout();
        this.layout.enabled = false;
    }

    public scrollToEnd() {
        if (!this.scrollView) {
            return;
        }
        const maxOffset = this.scrollView.getMaxScrollOffset();
        const currentOffset = this.scrollView.getScrollOffset();
        const zero = v2(0, 0);
        const canScroll = this.settings.scrollable && this.settings.scrollToEnd;
        const scrollableOffset = !maxOffset.equals(currentOffset) && !maxOffset.equals(zero);

        canScroll && scrollableOffset && this.scrollView.scrollToOffset(maxOffset, 0.5, true);
    }
}
