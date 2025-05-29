import { _decorator } from "cc";
import { FairnessCard } from "./fairness-card";
import { PokerCard3D } from "./poker-card-3D";
const { ccclass } = _decorator;

@ccclass
export class FairnessCard3D extends FairnessCard {
    get card(): PokerCard3D {
        if (this._card === null) {
            this._card = this.nodeCard.getComponent(PokerCard3D);
        }

        return this._card;
    }
}
