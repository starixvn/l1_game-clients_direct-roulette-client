import { _decorator } from "cc";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { ScoreboardAlgorithm } from "./scoreboard-algorithm";
import { ScoreboardDataConverter } from "./scoreboard-converter";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(ScoreboardDataConverter)
export class ScoreboardBeadRoadAlgorithm extends ScoreboardAlgorithm {
    @property(ScoreboardDataConverter)
    protected converter: ScoreboardDataConverter = null;

    @property(GridLayout)
    protected grid: GridLayout = null;

    apply(data: unknown[]) {
        const maximumPoints = this.grid.settings.row * this.grid.settings.column;

        this.addEmptyPoints(data, maximumPoints);

        return data;
    }

    addEmptyPoints(points: unknown[], maximum: number) {
        const additionPoints = maximum - points.length;

        for (let index = 0; index < additionPoints; index++) {
            const round = this.converter.createRound();

            round[this.converter.resultKey][this.converter.keyOfA] = undefined;

            points.push(round);
        }
    }

    onFocusInEditor(): void {
        this.converter = this.node.getComponent(ScoreboardDataConverter);
        this.grid = this.node.getComponent(GridLayout);
    }
}
