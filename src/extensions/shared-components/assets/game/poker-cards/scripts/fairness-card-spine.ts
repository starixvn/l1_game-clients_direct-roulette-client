import { _decorator } from "cc";
import { FairnessCard } from "./fairness-card";
import { PokerCardSpine } from "./poker-card-spine";
const { ccclass, property } = _decorator;

@ccclass
export class FairnessSpineCard extends FairnessCard {
    get card(): PokerCardSpine {
        if (this._card === null) {
            this._card = this.nodeCard.getComponent(PokerCardSpine);
        }

        return this._card;
    }
}
