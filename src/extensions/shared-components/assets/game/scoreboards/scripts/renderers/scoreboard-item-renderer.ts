import { _decorator, Component } from "cc";
import { ScoreboardItemImage } from "../models/scoreboard-item-image";
import { ScoreboardItemState, ScoreboardItemStateCriteria } from "../models/scoreboard-item-state";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardItemRenderer extends Component {
    @property(ScoreboardItemStateCriteria)
    forState: ScoreboardItemStateCriteria = new ScoreboardItemStateCriteria();

    render(state?: ScoreboardItemState, images?: ScoreboardItemImage[], item?: any) {
        this.node.active = true;
    }

    reset(): void {
        this.node.active = false;
    }
}
