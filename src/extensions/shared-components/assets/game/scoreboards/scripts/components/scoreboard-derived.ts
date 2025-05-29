import { _decorator } from "cc";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { ScoreboardPrediction } from "./baccarat/derived/scoreboard-prediction";
import { Scoreboard } from "./scoreboard";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { DerivedScoreboardKey, ScoreboardDerivedAlgorithm } from "./scoreboard-derived-algorithm";
import { ScoreboardGridItem } from "./scoreboard-grid-item";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([ScoreboardDataConverter, ScoreboardDerivedAlgorithm])
export class ScoreboardDerived extends Scoreboard {
    @property({ type: GridLayout, visible: false, override: true })
    protected override grid: GridLayout = null;

    @property({ type: ScoreboardDataConverter, override: true })
    override converter: ScoreboardDataConverter = null;

    @property({ type: ScoreboardDerivedAlgorithm, override: true })
    override algorithm: ScoreboardDerivedAlgorithm = null;

    @property({ type: GridLayout })
    protected grids: GridLayout[] = [];

    @property(ScoreboardPrediction)
    prediction: ScoreboardPrediction = null;

    onFocusInEditor(): void {
        this.grids = this.node.getComponentsInChildren(GridLayout);
        this.converter = this.node.getComponent(ScoreboardDataConverter);
        this.algorithm = this.node.getComponent(ScoreboardDerivedAlgorithm);
        this.prediction = this.getComponentInChildren(ScoreboardPrediction);
    }

    public render<T>(rounds: T[], hasBlinkNode = false) {
        const converted = this.converter.convert(rounds);
        this.algorithm.apply(converted, hasBlinkNode);

        this.grids.forEach((grid) => {
            const derivedData = this.algorithm.getDerivedData(grid.node.name as DerivedScoreboardKey);
            grid.render(ScoreboardGridItem, derivedData);
        });

        if (this.prediction) {
            const predictions = this.algorithm.getPrediction();
            this.prediction.setData(predictions);
        }
    }
}
