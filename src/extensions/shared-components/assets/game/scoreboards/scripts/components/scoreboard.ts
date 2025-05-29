import { _decorator, Component } from "cc";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { ScoreboardAlgorithm } from "./scoreboard-algorithm";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardGridItem } from "./scoreboard-grid-item";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([GridLayout, ScoreboardDataConverter, ScoreboardAlgorithm])
export class Scoreboard extends Component {
    @property(GridLayout)
    protected grid: GridLayout = null;

    @property(ScoreboardDataConverter)
    converter: ScoreboardDataConverter = null;

    @property(ScoreboardAlgorithm)
    algorithm: ScoreboardAlgorithm = null;

    onFocusInEditor(): void {
        this.grid = this.node.getComponent(GridLayout);
        this.converter = this.node.getComponent(ScoreboardDataConverter);
        this.algorithm = this.node.getComponent(ScoreboardAlgorithm);
    }

    public render<T>(rounds: T[]) {
        const converted = this.converter.convert(rounds);
        const data = this.algorithm.apply(converted);

        this.grid.render(ScoreboardGridItem, data);
    }
}
