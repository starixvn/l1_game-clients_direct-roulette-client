import { _decorator, SpriteFrame } from "cc";
import { ScoreboardItemStateCriteria } from "./scoreboard-item-state";

const { ccclass, property } = _decorator;

@ccclass("ScoreboardItemImage")
export class ScoreboardItemImage {
    @property(ScoreboardItemStateCriteria)
    forState: ScoreboardItemStateCriteria = new ScoreboardItemStateCriteria();

    @property(SpriteFrame)
    image: SpriteFrame = null;
}
