import { _decorator } from "cc";
import SCScoreboard from "sc-scoreboards";
import { GridLayout } from "../../../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { Scoreboard } from "../../scoreboard";
import { ScoreboardBigRoadAlgorithm } from "../../scoreboard-big-road-algorithm";
import { ScoreboardGoodRoad } from "../../scoreboard-good-road";
import { ScoreboardGridItem } from "../../scoreboard-grid-item";
import { ScoreboardKeepDetailConverter } from "../../scoreboard-keep-detail-converter";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([GridLayout, ScoreboardKeepDetailConverter, ScoreboardBigRoadAlgorithm])
export class BaccaratBigRoad extends Scoreboard {
    @property(ScoreboardGoodRoad)
    goodRoad: ScoreboardGoodRoad = null;

    @property
    noRender = false;

    currentGoodRoad: SCScoreboard.GoodRoad = null;

    private cached = null;
    updateGoodRoadPatterns(patterns: SCScoreboard.ColumnLengthPattern[]) {
        (this.algorithm as ScoreboardBigRoadAlgorithm).updatePatterns(patterns);

        if (this.cached) {
            this.render(this.cached);
        }
    }

    public render<T>(rounds: T[]) {
        this.cached = rounds;

        const converted = this.converter.convert(rounds);
        const data = this.algorithm.apply(converted);

        let goodRoad = null;
        if (this.goodRoad) {
            goodRoad = (this.algorithm as ScoreboardBigRoadAlgorithm).getGoodRoad();
        }
        this.currentGoodRoad = goodRoad;

        if (this.noRender) {
            return;
        }

        this.grid.render(ScoreboardGridItem, data);
        this.goodRoad?.render(goodRoad);
    }
}
