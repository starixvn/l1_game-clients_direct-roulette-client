import { Animation, Color, Component, Node, Sprite, SpriteAtlas, _decorator } from "cc";
import { AnimationUtils } from "../../../shared/utils/utils";
const { ccclass, property } = _decorator;

export const convertRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A",
    };
    return dict[num] || num.toString();
};

export interface CardModel {
    rank: string;
    suit: number;
}

export interface ServiceCard {
    rank: number;
    suit: number;
}

export interface ServiceOldCard {
    card: number;
    type: number;
}

enum AnimationName {
    Open_Card = "open-card",
    Close_Card = "close-card",
    Drop_Card = "drop-card",
    Close_After_Drop = "close-after-drop",
    Draw_Card = "draw-card",
    Pull_Card = "pull-card",
}

export const convertOldCardToServiceCard = (oldCard: ServiceOldCard): ServiceCard => {
    return {
        rank: oldCard.card,
        suit: oldCard.type
    };
};

@ccclass
export class PokerCard extends Component {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(Node)
    bgBackCard: Node = null;

    @property(Node)
    bgWhiteCard: Node = null;

    @property(Sprite)
    rank: Sprite = null;

    @property(Sprite)
    smallSuit: Sprite = null;

    @property(Sprite)
    largeSuit: Sprite = null;

    @property(Node)
    bgGolden: Node = null;

    @property(Node)
    nodeWinHighlight: Node = null;

    public card: CardModel = { rank: "A", suit: 3 };

    protected readonly suits = ["heart", "diamond", "club", "spade"];
    protected readonly picture = {
        j: "j_picture",
        q: "q_picture",
        k: "k_picture",
    };
    protected _animation: Animation;

    get animation() {
        if (!this._animation) {
            this._animation = this.getComponent(Animation);
        }
        return this._animation;
    }

    protected onLoad(): void {
        this.setGoldenCard(false, false);
    }

    setGoldenCard(show: boolean, animated: boolean): void {
        if (!this.bgGolden) {
            return;
        }

        if (animated) {
            if (show) {
                AnimationUtils.fadeIn(this.bgGolden, 0.3);
            } else {
                AnimationUtils.fadeOutAndDeactivate(this.bgGolden, 0);
            }
        } else {
            AnimationUtils.setOpacityNode(this.bgGolden, show ? 255 : 1);
            this.bgGolden.active = show;
        }
    }

    setServiceCard(card: ServiceCard): void {
        this.setCard({ rank: convertRank(+card.rank), suit: card.suit });
    }

    setCard(card: CardModel) {
        this.card = card;
    }

    pullCard(duration: number) {
        return AnimationUtils.playAnimation(this.animation, AnimationName.Pull_Card, duration);
    }

    drawCard(duration: number) {
        return AnimationUtils.playAnimation(this.animation, AnimationName.Draw_Card, duration);
    }

    dropCard(duration: number) {
        return AnimationUtils.playAnimation(this.animation, AnimationName.Drop_Card, duration);
    }

    async openCard(animated = true, duration?: number) {
        if (this.animation && animated) {
            await AnimationUtils.playAnimation(this.animation, AnimationName.Open_Card, duration);
        } else {
            this.faceUp();
        }
    }

    async closeCard(duration: number) {
        await AnimationUtils.playAnimation(this.animation, AnimationName.Close_Card, duration);
    }

    async closeAfterDrop(duration: number) {
        await AnimationUtils.playAnimation(this.animation, AnimationName.Close_After_Drop, duration);
    }

    faceUp() {
        this.changeCardFace(true);
    }

    faceDown() {
        this.setWinHighlight(false);
        this.changeCardFace(false);
    }

    setWinHighlight(show: boolean) {
        this.nodeWinHighlight && (this.nodeWinHighlight.active = show);
    }

    protected changeCardFace(faceUp: boolean) {
        if (faceUp) {
            if (this.card) {
                const lowerCaseRank = this.card.rank.toLowerCase();
                const frame = this.atlas.getSpriteFrame(lowerCaseRank);
                this.rank.spriteFrame = frame;
                this.rank.color = this.card.suit > 1 ? Color.BLACK : new Color("#960000");
                this.smallSuit.spriteFrame = this.atlas.getSpriteFrame(`${this.suits[this.card.suit]}_small`);

                this.setLargeSuiteImage(lowerCaseRank);
                this.setDetailVisibility(true);
            } else {
                console.warn("Call setFaceUp when this.card null");
                this.showCardBack();
            }
        } else {
            this.showCardBack();
        }
    }

    protected setLargeSuiteImage(lowerCaseRank: string) {
        if (+this.card.rank || this.card.rank === "A") {
            this.largeSuit.spriteFrame = this.atlas.getSpriteFrame(this.suits[this.card.suit]);
        } else {
            this.largeSuit.spriteFrame = this.atlas.getSpriteFrame(this.picture[lowerCaseRank]);
        }
    }

    protected setDetailVisibility(active: boolean) {
        this.largeSuit.node.parent.active = active;

        this.bgWhiteCard.active = active;
        this.bgBackCard.active = !active;
    }

    protected showCardBack() {
        this.setDetailVisibility(false);
        this.setGoldenCard(false, false);
    }
}
