import { _decorator, CCInteger, Enum } from "cc";
import { ScoreboardItemStatus, ScoreboardItemTieCriteria } from "./scoreboard-item-enum";

const { ccclass, property } = _decorator;

@ccclass("ScoreboardItemState")
export class ScoreboardItemState {
    @property(CCInteger)
    tie = 0;

    @property({ type: Enum(ScoreboardItemStatus) })
    status = ScoreboardItemStatus.NONE;
    data?: any = null;
}

@ccclass("ScoreboardItemStateCriteria")
export class ScoreboardItemStateCriteria {
    @property({ type: Enum(ScoreboardItemStatus) })
    status: ScoreboardItemStatus = ScoreboardItemStatus.NONE;

    @property({ type: Enum(ScoreboardItemTieCriteria) })
    tie = ScoreboardItemTieCriteria.ZERO;
}
