import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, sp } from "cc";
import Observer from "observer";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils, ComponentUtils } from "../../shared/utils";
import { BaccaratXCardsUI } from "./baccarat-x-cards-ui";
import { MultiplierCards } from "./multiplier-cards";
const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass
export class LuckyCardEffect extends ObserverComponent {
    @property(Node)
    nodeMultiplierCards: Node = null;

    @property(Node)
    nodeSpineEffect: Node = null;

    cardsUI: BaccaratXCardsUI = null;
    multiplierCards: MultiplierCards = null;
    onLoad() {
        super.onLoad();
        this.multiplierCards = this.nodeMultiplierCards.getComponent(MultiplierCards);
    }

    resetLuckyCardsColor() {
        this.multiplierCards?.resetLuckyCardsColor();
    }

    async createEffectNode(golden: boolean, target: Node) {
        const node = instantiate(this.nodeSpineEffect);
        this.node.addChild(node);
        node.active = true;

        node.position = ComponentUtils.convertPosition(this.node, target);
        node.worldRotation = target.worldRotation;

        const spine = node.getComponent(sp.Skeleton);
        const duration = golden ? 1 : 0.5;
        await AnimationUtils.playSpine(spine, golden ? "golden" : "white", true, duration);
        node.destroy();
    }

    async checkLuckyCard(openCard: { card: FairnessCard; data: ServiceCard; animated: boolean }) {
        const { card, data, animated } = openCard;
        const matchedMultiplierCard = await this.multiplierCards.findMatchedCard(data);
        if (matchedMultiplierCard) {
            animated && this.playSound("lightning");
            animated && (await this.createEffectNode(false, matchedMultiplierCard.card.node));
            matchedMultiplierCard.card.setGoldenCard(false, animated);

            if (animated) {
                await this.createEffectNode(true, card.node);
                card.setGoldenCard(true, animated);
            } else {
                card.setGoldenCard(true, animated);
            }
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }
}
