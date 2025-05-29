import gc from "@sg/game-client-base";
import { Label, Node, Prefab, _decorator, instantiate, v3 } from "cc";
import Observer from "observer";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils, FunctionUtils } from "../../shared/utils";
import { MultiplierCard } from "./multiplier-card";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
const { GameBaccaratX, Rounds, FormatUtils } = gc;

@ccclass
export class MultiplierCards extends ObserverComponent {
    @property(Prefab)
    prfMultiplierCard: Prefab = null;

    @property(Node)
    content: Node = null;

    @property(Label)
    lblRangeBetLimit: Label = null;

    @property(Label)
    lblExtraFee: Label = null;

    private minBet = 0;
    private maxBet = 0;

    private multiplierCards: MultiplierCard[] = [];

    async findMatchedCard(card: ServiceCard, testIndex = -1) {
        if (testIndex > -1) {
            return this.multiplierCards[testIndex % this.multiplierCards.length];
        }

        await FunctionUtils.waitUntil(() => this.isValidMultiplierCards(), 100, 1000);
        return this.multiplierCards.find((comp) => comp.data.rank === card.rank && comp.data.suit === card.suit);
    }

    resetLuckyCardsColor() {
        this.multiplierCards.forEach((card) => card.card.setGoldenCard(true, false));
    }

    @render(gc.MultipliersStore, (store) => store.renderMultipliers)
    async renderMultipliers(renderMultipliers: { animated: boolean; multipliers: any[] }) {
        if (!renderMultipliers) {
            this.hideCards();
            return;
        }

        const { animated, multipliers } = renderMultipliers;

        this.content.destroyAllChildren();

        const labelContainer = new Node("label-container");
        this.node.addChild(labelContainer);
        this.multiplierCards = [];

        for (let i = 0; i < multipliers.length; i++) {
            const item = multipliers[i];
            const node = instantiate(this.prfMultiplierCard);
            this.content.addChild(node);
            const comp = node.getComponent(MultiplierCard);
            comp.setData(item);
            this.cardPosition(node, i);
            if (animated) {
                this.playSound("multiplier");
                comp.playAnimCard();
                await FunctionUtils.delay(130);
            } else {
                comp.card.setGoldenCard(true, false);
            }
            this.optimizedDrawCall(comp.lblMultiplier.node, labelContainer);
            this.multiplierCards.push(comp);
        }

        ComponentUtils.moveToOtherNode(labelContainer, this.content);
    }

    private optimizedDrawCall(labelNode: Node, labelContainer: Node) {
        ComponentUtils.moveToOtherNode(labelNode, labelContainer);
    }

    hideCards() {
        this.content.destroyAllChildren();
        this.multiplierCards = [];
    }

    isValidMultiplierCards() {
        return this.multiplierCards.length > 0;
    }

    showMultiplierCards(isShow: boolean) {
        this.content.active = isShow;
    }

    @render(Rounds.RoundStore, (store) => store.minBet)
    renderMinBet(minBet: number) {
        this.minBet = minBet;
        this.renderRangeBetLimit();
    }

    @render(Rounds.RoundStore, (store) => store.maxBet)
    renderMaxBet(maxBet: number) {
        this.maxBet = maxBet;
        this.renderRangeBetLimit();
    }

    renderRangeBetLimit() {
        this.lblRangeBetLimit.string = `${FormatUtils.numberWithCommas(this.minBet, 2)} - ${FormatUtils.numberWithCommas(this.maxBet, 2)}`;
    }

    @render(GameBaccaratX.ExtraFee.ExtraFeeStore, (store) => store.extraFee)
    renderExtraFee(extraFee: any) {
        if (extraFee) {
            const fee = extraFee.fee;
            const extraFeeString = extraFee.isRatio ? `${fee * 100}%` : `${FormatUtils.numberWithCommas(fee, 2)}`;
            this.lblExtraFee.string = extraFeeString;
        }
    }

    async cardPosition(node: Node, index: number) {
        const cardWidth = 52;
        const origin = index * cardWidth;
        node.position = v3(origin, node.position.y, 0);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }
}
