import { Node, _decorator } from "cc";
import { GridItem } from "../../../../shared/common-components/grid-layout/scripts/components/grid-item";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { GridItemSettings } from "../../../../shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { ScoreboardItemStatus } from "../models/scoreboard-item-enum";
import { ScoreboardItemState } from "../models/scoreboard-item-state";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardItem } from "./scoreboard-item";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(ScoreboardItem)
export class ScoreboardGridItem<T> extends GridItem<T> {
    @property(ScoreboardItem)
    protected item: ScoreboardItem = null;

    @property(Node)
    protected borderBottom: Node = null;

    @property(Node)
    protected borderLeft: Node = null;

    onFocusInEditor(): void {
        this.item = this.node.getComponent(ScoreboardItem);
    }

    render(settings: GridItemSettings, data?: T, container?: Node, index?: number): void {
        super.render(settings, data);

        const state = this.createState(settings, data, container);

        this.renderBorder(container, index);
        this.item.state = state;
    }

    createState(_: GridItemSettings, data?: T, container?: Node): ScoreboardItemState {
        const converter = container.getComponent(ScoreboardDataConverter);

        return {
            status: data[converter.keyOfA] ? ScoreboardItemStatus.A : ScoreboardItemStatus.B,
            tie: 0,
        };
    }

    renderBorder(container?: Node, index?: number) {
        const grid = container.getComponent(GridLayout);
        const isBottom = (index + 1) % grid.settings.row === 0;
        const isLeft = (index / grid.settings.row) >> 0 === 0;

        this.borderBottom && (this.borderBottom.active = isBottom);
        this.borderLeft && (this.borderLeft.active = isLeft);
    }
}
