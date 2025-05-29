import { Component, Node, UITransform, _decorator } from "cc";
import { GridItemSettings } from "../settings/grid-item-settings";

const { ccclass } = _decorator;

@ccclass
export class GridItem<T> extends Component {
    updateSize(settings: GridItemSettings) {
        const transform = this.node.getComponent(UITransform);

        transform.setContentSize(settings.size, settings.size);
    }

    render(settings: GridItemSettings, data?: T, container?: Node, index?: number): void {
        this.updateSize(settings);
    }
}
