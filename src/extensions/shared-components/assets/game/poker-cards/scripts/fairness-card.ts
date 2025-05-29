import { _decorator, Button, Component, Label, Node } from "cc";
import { PokerCard, ServiceCard } from "./poker-card";
const { ccclass, property } = _decorator;

export interface FairnessCardData {
    card: ServiceCard;
    index: number;
}

@ccclass
export class FairnessCard extends Component {
    @property(Node)
    nodeCard: Node = null;

    @property(Label)
    lblCardIndex: Label = null;

    @property(Button)
    btnOnCard: Button = null;

    protected _card = null;
    private _clickCallback = () => {};
    public cardIndex = 0;

    get card(): PokerCard {
        if (this._card === null) {
            this._card = this.nodeCard.getComponent(PokerCard);
        }
        return this._card;
    }

    setGoldenCard(show: boolean, animated: boolean) {
        this.card.setGoldenCard(show, animated);
    }

    setWinHighlight(show: boolean) {
        this.card.setWinHighlight(show);
    }

    setClickCallback(callback: () => void) {
        if (callback) {
            this._clickCallback = callback;
        }
    }

    setData(data: FairnessCardData) {
        const { card, index } = data;
        this.card.setServiceCard(card);
        this.setIndexValue(index);
    }

    setCardData(card: ServiceCard) {
        this.card.setServiceCard(card);
    }

    openCard(animated = true, duration?: number) {
        return this.card.openCard(animated, duration);
    }

    closeCard(duration = 0) {
        if (duration === 0) {
            this.card.faceDown();
            return;
        }
        return this.card.closeCard(duration);
    }

    setIndexValue(index: number) {
        const cardIndex = index + 1;
        this.lblCardIndex.string = `${cardIndex}`;
        this.cardIndex = cardIndex;
    }

    onClickCard() {
        this._clickCallback();
    }
}
