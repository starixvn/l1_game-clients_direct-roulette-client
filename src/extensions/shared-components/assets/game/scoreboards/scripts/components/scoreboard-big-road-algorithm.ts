import type { BigRoadScoreboard } from "sc-scoreboards";

import { _decorator } from "cc";
import SCScoreboard from "sc-scoreboards";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { addEmptyPoints, getColumns } from "../helpers/scoreboard-big-road-helper";
import { DEFAULT_PATTERNS } from "./baccarat/big-road/baccarat-big-road-good-road-patterns";
import { ScoreboardAlgorithm } from "./scoreboard-algorithm";
import { ScoreboardDataConverter } from "./scoreboard-converter";

const { ccclass, property, requireComponent } = _decorator;
const { Converter, BigRoadScoreboard: BigRoad, GoodRoadColumnLengthDetectorDetector } = SCScoreboard;

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

@ccclass
@requireComponent(ScoreboardDataConverter)
export class ScoreboardBigRoadAlgorithm extends ScoreboardAlgorithm {
    @property(ScoreboardDataConverter)
    protected converter: ScoreboardDataConverter = null;

    @property(GridLayout)
    protected grid: GridLayout = null;

    private _bigRoad: BigRoadScoreboard<unknown>;

    defaultPatterns: SCScoreboard.ColumnLengthPattern[] = DEFAULT_PATTERNS;

    private columnLengthDetectorDetector = new GoodRoadColumnLengthDetectorDetector({ patterns: this.defaultPatterns });

    private get bigRoad() {
        if (!this._bigRoad) {
            this.createBigRoad();
        }

        return this._bigRoad;
    }

    private createBigRoad() {
        this._bigRoad = new BigRoad({
            converter: new BigRoadConverter(this.converter),
            height: this.grid.settings.row,
            goodRoadDetectors: [this.columnLengthDetectorDetector],
        });
    }

    updatePatterns(patterns: SCScoreboard.ColumnLengthPattern[]) {
        this.columnLengthDetectorDetector.updatePatterns(patterns);
    }

    apply(data: unknown[]) {
        this.bigRoad.initialize(data);

        const points = getColumns(this.bigRoad);
        const maximumPoints = this.grid.settings.row * this.grid.settings.column;

        addEmptyPoints(points, maximumPoints);

        return points;
    }

    getGoodRoad() {
        const goodRoad = this.bigRoad.getGoodRoad();
        if (Object.keys(goodRoad).length === 0) {
            return null;
        }

        if (goodRoad?.x === -1 || goodRoad?.width === 0) {
            return null;
        }
        return goodRoad;
    }

    onFocusInEditor(): void {
        this.converter = this.node.getComponent(ScoreboardDataConverter);
        this.grid = this.node.getComponent(GridLayout);
    }
}
