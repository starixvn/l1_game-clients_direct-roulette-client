import { _decorator, Component, Layers, Layout, Mask, Node, ScrollView, Size, UITransform, Widget } from "cc";
import { GridItemSettings } from "../settings/grid-item-settings";
import { GridLayoutSettings } from "../settings/grid-layout-settings";
import { GridLayout } from "./grid-layout";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([UITransform, GridLayout])
export class GridLayoutBuilder extends Component {
    @property(GridLayout)
    protected grid: GridLayout = null;

    @property({ type: GridLayoutSettings, displayName: "INPUT SETTINGS TO BUILD" })
    protected settings: GridLayoutSettings = null;

    onFocusInEditor(): void {
        if (!this.isValidProperties()) {
            this.grid = this.node.getComponent(GridLayout);
        } else {
            this.createNodesIfNotExists();
            this.applySettings();
        }
    }

    onLostFocusInEditor(): void {
        this.onFocusInEditor();
    }

    protected applySettings() {
        const { scrollable } = this.settings;
        const layoutTransform = this.grid.layout.getComponent(UITransform);

        const size = this.getContentSize();

        if (this.settings.direction === Layout.AxisDirection.HORIZONTAL) {
            this.grid.scrollView.horizontal = scrollable;
            this.grid.scrollView.vertical = false;

            this.grid.layout.startAxis = Layout.AxisDirection.VERTICAL;

            layoutTransform.setContentSize(0, size.height);
        }

        if (this.settings.direction === Layout.AxisDirection.VERTICAL) {
            this.grid.scrollView.horizontal = false;
            this.grid.scrollView.vertical = scrollable;

            this.grid.layout.startAxis = Layout.AxisDirection.HORIZONTAL;

            layoutTransform.setContentSize(size.width, 0);
        }

        this.updateContentSize();
        this.updateItemSettings();

        this.grid.settings = this.settings;
    }

    protected updateItemSettings() {
        if (!this.grid.itemSettings) {
            this.grid.itemSettings = new GridItemSettings();
        }

        this.grid.itemSettings.size = this.settings.itemSize;
        this.grid.itemSettings.prefab = this.settings.itemPrefab;
    }

    protected updateContentSize() {
        const transform = this.node.getComponent(UITransform);
        const size = this.getContentSize();

        transform?.setContentSize(size);
    }

    protected getContentSize() {
        const { column, row } = this.settings;

        return new Size(column * this.settings.itemSize, row * this.settings.itemSize);
    }

    protected createNodesIfNotExists() {
        this.createBackgroundNode();
        this.createContainerNode();

        this.grid.scrollView = this.node.getComponentInChildren(ScrollView);
        this.grid.layout = this.node.getComponentInChildren(Layout);
    }

    protected createContainerNode() {
        const containerName = "container";

        if (!this.node.getChildByName(containerName)) {
            const container = new Node(containerName);
            container.layer = Layers.Enum.UI_2D;
            const content = new Node("content");
            content.layer = Layers.Enum.UI_2D;

            container.addChild(content);

            container.addComponent(ScrollView);
            container.addComponent(Mask);

            content.addComponent(Layout);

            const scrollView = container.getComponent(ScrollView);
            const layout = content.getComponent(Layout);

            scrollView.content = content;

            layout.type = Layout.Type.GRID;
            layout.resizeMode = Layout.ResizeMode.CONTAINER;
            layout.enabled = false;

            this.addWidget(container);

            this.node.addChild(container);
        }
    }

    protected createBackgroundNode() {
        const backgroundName = "background";

        if (!this.node.getChildByName(backgroundName)) {
            const node = new Node(backgroundName);
            node.layer = Layers.Enum.UI_2D;

            this.addWidget(node);

            this.node.insertChild(node, 0);
        }
    }

    protected addWidget(node: Node) {
        node.addComponent(Widget);

        const widget = node.getComponent(Widget);

        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;
        widget.isAlignTop = true;
        widget.top = 0;
        widget.isAlignBottom = true;
        widget.bottom = 0;
    }

    protected isValidProperties(): boolean {
        return !!this.grid && !!this.settings;
    }
}
