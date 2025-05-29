import { _decorator, Component } from "cc";
import { ScoreboardPredictionItem } from "./scoreboard-prediction-item";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardPrediction extends Component {
    _items: ScoreboardPredictionItem[] = [];

    get items() {
        if (this._items.length === 0) {
            this._items = this.getComponentsInChildren(ScoreboardPredictionItem);
        }
        return this._items;
    }

    setData(data: boolean[]): void {
        this.items.forEach((item, index) => {
            const invert = index > 0;
            item.setData(data, invert);
        });
    }
}
