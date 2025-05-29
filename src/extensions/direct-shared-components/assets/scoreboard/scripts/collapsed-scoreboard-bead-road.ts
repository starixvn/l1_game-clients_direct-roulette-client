import { _decorator, CCInteger } from "cc";
import { ScoreboardBeadRoad } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-bead-road";

const { ccclass, property } = _decorator;

@ccclass
export class CollapsedScoreboardBeadRoad extends ScoreboardBeadRoad {
    render(rounds: any[]) {
        const data = this.getRounds(rounds);
        super.render(data);
    }

    protected getRounds(rounds: any[]) {
        const isRenderedColumn = Math.round(rounds.length / this.grid.settings.row);
        return isRenderedColumn - this.grid.settings.column > 0
            ? rounds.slice((isRenderedColumn - this.grid.settings.column) * this.grid.settings.row)
            : rounds;
    }
}
