import { _decorator, Component, UITransform, v3 } from "cc";
import SCScoreboard from "sc-scoreboards";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
const {} = SCScoreboard;

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass
@executeInEditMode
export class ScoreboardGoodRoad extends Component {
    @property(GridLayout)
    protected grid: GridLayout = null;

    render(goodRoad: SCScoreboard.GoodRoad) {
        if (!goodRoad) {
            this.setVisible(false);
            return;
        }

        this.setVisible(true);
        const { x, width } = goodRoad;
        const positionX = this.grid.itemSettings.size * x;
        const calculateWidth = this.grid.itemSettings.size * width;

        this.node.position = v3(positionX, 0);
        const transform = this.getComponent(UITransform);
        transform.width = calculateWidth;
    }

    setVisible(visible: boolean) {
        this.node.active = visible;
    }
}
