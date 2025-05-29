import { _decorator } from "cc";
import type { BigRoadScoreboard, DerivedScoreboardPoint, DerivedScoreboards } from "sc-scoreboards";
import SCScoreboard from "sc-scoreboards";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { rowToColumns } from "../helpers/scoreboard-big-road-helper";
import { ScoreboardAlgorithm } from "./scoreboard-algorithm";
import { ScoreboardDataConverter } from "./scoreboard-converter";

const { ccclass, property, requireComponent } = _decorator;
const { Converter, BigRoadScoreboard: BigRoad, DerivedScoreboards: DerivedSB } = SCScoreboard;

type ConverterOptions = {
    keyOfA: string;
    tieKey: string;
};

export class BigRoadConverter extends Converter<unknown> {
    constructor(protected readonly options: ConverterOptions) {
        super();
    }

    protected positiveKey() {
        return this.options.keyOfA;
    }

    protected specialKey(): string {
        return this.options.tieKey;
    }
}

export type DerivedScoreboardKey = "bigEyeBoy" | "smallRoad" | "cockroachPig";

@ccclass
@requireComponent(ScoreboardDataConverter)
export class ScoreboardDerivedAlgorithm extends ScoreboardAlgorithm {
    @property(ScoreboardDataConverter)
    protected converter: ScoreboardDataConverter = null;

    @property(GridLayout)
    protected grid: GridLayout = null;

    private _derivedSB: DerivedScoreboards<unknown>;
    private _bigRoad: BigRoadScoreboard<unknown>;

    private get derivedSB() {
        if (!this._derivedSB) {
            this._derivedSB = new DerivedSB<unknown>({
                height: this.grid.settings.row,
            });
        }

        return this._derivedSB;
    }

    private get bigRoad() {
        if (!this._bigRoad) {
            this._bigRoad = new BigRoad({
                converter: new BigRoadConverter(this.converter),
                height: this.grid.settings.row,
            });
        }

        return this._bigRoad;
    }

    getDerivedData(key: DerivedScoreboardKey) {
        const sbData = this.derivedSB.getScoreboardData(key);

        const maximumPoints = this.grid.settings.row * this.grid.settings.column;
        const data = rowToColumns(sbData);
        this.addEmptyPoints(data, maximumPoints);
        return data;
    }

    addEmptyPoints(points: DerivedScoreboardPoint[], maximum: number) {
        const additionPoints = maximum - points.length;

        for (let index = 0; index < additionPoints; index++) {
            points.push({
                row: -1,
                column: -1,
                status: undefined,
            });
        }
        return points;
    }

    getPrediction() {
        return this.derivedSB.getPrediction(true);
    }

    apply(data: any[][], hasBlinkNode = false) {
        this.bigRoad.initialize(data, hasBlinkNode);
        const bigRoadData = this.bigRoad.rows();
        this.derivedSB.update(bigRoadData, hasBlinkNode);

        return data;
    }

    onFocusInEditor(): void {
        this.converter = this.node.getComponent(ScoreboardDataConverter);
        this.grid = this.node.getComponentInChildren(GridLayout);
    }
}
