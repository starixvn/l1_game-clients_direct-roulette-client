import { _decorator, Component, Node } from "cc";
import { FairnessCard } from "../../../game/poker-cards/scripts/fairness-card";
const { ccclass, property } = _decorator;

@ccclass
export class FairnessPokerCard extends Component {
    @property(Node)
    nodeHighlight: Node = null;

    @property(FairnessCard)
    cardFairness: FairnessCard = null;

    @property(Node)
    bgBurnCard: Node = null;

    showHighlight(isShow: boolean) {
        this.nodeHighlight && (this.nodeHighlight.active = isShow);
    }

    showBgBurnCard(isShow: boolean) {
        this.bgBurnCard && (this.bgBurnCard.active = isShow);
    }
}
