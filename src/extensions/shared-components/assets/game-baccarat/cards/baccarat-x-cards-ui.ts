import gc from "@sg/game-client-base";
import { Label, Node, Prefab, UITransform, Vec3, _decorator, director, instantiate, sp, tween, v3 } from "cc";
import Observer from "observer";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { bundleManager } from "../../shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../shared/utils";
import { AnimationUtils } from "../../shared/utils/utils";
import { MultiplierPayoutEvent } from "../multiplier-payout";
import { getTimePointBurnCards, getTimePointCutCards } from "../time-point";
import { BaccaratXCards } from "./baccarat-x-cards";
import { LuckyCardEffect } from "./lucky-card-effect";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Rounds, GameBaccaratX } = gc;

type ServiceCardHand = {
    card1: ServiceCard;
    card2: ServiceCard;
    card3?: ServiceCard;
    score: number;
};

type BaccaratResult = {
    [choice: string]: ServiceCardHand;
};

type PoolItem = {
    location: number;
    card: FairnessCard;
};

enum CardLocation {
    Box = 0,
    Player1 = 1,
    Banker1 = 2,
    Player2 = 3,
    Banker2 = 4,
    Waiting1 = 5,
    Waiting2 = 6,
    Player3,
    Banker3,
    Trash = 9,
    Center,
}

export enum CardEvent {
    OPENED_CARD = "OPENED_CARD",
}

@ccclass
export class BaccaratXCardsUI extends ObserverComponent {
    @property(Prefab)
    prfCard: Prefab = null;

    @property(Node)
    nodeCardContainer: Node = null;

    @property(Node)
    nodeWaitingCard: Node = null;

    @property(Node)
    nodeBoxCard: Node = null;

    @property(Node)
    nodeTrash: Node = null;

    @property(Node)
    nodeBgNewShoe: Node = null;

    @property(Node)
    nodeBurnCards: Node = null;

    @property(Node)
    nodeCutCards: Node = null;

    @property(Node)
    nodeStackCards: Node = null;

    @property(Node)
    nodeLuckyCardsEffect: Node = null;

    @property
    spineCutCardPath = "";

    @property
    modeSpeed = false;

    private _cardHands: BaccaratXCards[] = [];
    private get movingCardDuration() {
        return this.modeSpeed ? 0.4 : 0.5;
    }

    private get openCardDuration() {
        return this.modeSpeed ? 0.5 : 0.8;
    }
    private maximizeStackCards = 6;
    private isNewShoe = false;

    currentCardIndex = -1;
    cutCardIndex = 0;

    cards: FairnessCard[] = [];

    cardPool: PoolItem[] = [];

    spineCutCard: sp.Skeleton = null;

    private cardsStates: gc.GameBaccaratX.CardsState = {};
    private burnCardsNodes: Node[] = [];
    private durations: gc.GameConfigs.DurationSetting;
    luckyCardEffect: LuckyCardEffect;
    private timePointCutCards = 0;
    private timePointBurnCards = 0;

    async onLoad() {
        this.luckyCardEffect = this.nodeLuckyCardsEffect.getComponent(LuckyCardEffect);
        this.nodeBgNewShoe.active = false;
        this.initCards();
        super.onLoad();
    }

    @render(gc.GameBaccaratX.Multiplier.BaccaratMultipliersStore, (store) => store.scores)
    updateScore(scores: { [hand: string]: number }) {
        if (!scores || Object.keys(scores).length === 0) {
            return;
        }

        this.cardHands.forEach((cardHand) => {
            const hand = cardHand.node.name;
            if (scores[hand] !== undefined) {
                cardHand.setScore(scores[hand]);
            }
        });
    }

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.durations)
    storeSettingDurations(durations: gc.GameConfigs.DurationSetting) {
        this.durations = durations;

        this.timePointCutCards = getTimePointCutCards(durations);
        this.timePointBurnCards = getTimePointBurnCards(durations);
    }

    async initSpineCutCard() {
        if (!this.spineCutCard) {
            const data = await bundleManager.loadAssetsFromBundle<sp.SkeletonData>(
                "resources",
                this.spineCutCardPath,
                sp.SkeletonData,
                null
            );
            const node = new Node();
            this.nodeCutCards.addChild(node);
            this.spineCutCard = node.addComponent(sp.Skeleton);
            this.spineCutCard.skeletonData = data;
        }
    }

    initCards() {
        if (this.cardPool.length > 0) {
            return;
        }
        for (let i = 0; i < 6; i++) {
            const node = this.createNewCardNode();
            this.nodeCardContainer.addChild(node);
            node.active = false;
            const card = node.getComponent(FairnessCard);
            this.cardPool.push({
                location: CardLocation.Box,
                card,
            });
            this.transformCardNode(node, CardLocation.Box, false);
        }
        this.cards = this.cardPool.map((item) => item.card);
    }

    private createNewCardNode() {
        const node = instantiate(this.prfCard);
        node.setScale(v3(0.34, 0.34));
        return node;
    }

    get cardHands() {
        if (this._cardHands.length === 0) {
            this._cardHands = this.getComponentsInChildren(BaccaratXCards);
        }
        return this._cardHands;
    }

    hasWaitingCards(): boolean {
        return !!this.cardPool.find((card) => card.location === CardLocation.Waiting1 || card.location === CardLocation.Waiting2);
    }

    getItemAtLocation(location: number): PoolItem {
        return this.cardPool.find((card) => card.location === location);
    }

    updateLocation(item: PoolItem, location: number) {
        item.location = location;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    async closeCards(isStartRound) {
        this.clearScores();
        if (isStartRound) {
            if (this.currentCardIndex === -1) {
                return;
            }
            if (this.hasWaitingCards()) {
                const waitingCards = this.cardPool.filter(
                    (card) => card.location === CardLocation.Waiting1 || card.location === CardLocation.Waiting2
                );
                const others = this.cardPool.filter(
                    (card) => card.location !== CardLocation.Waiting1 && card.location !== CardLocation.Waiting2
                );

                await this.dropCards(others, true);
                this.resetCardsToBox(others);

                const pool = [...waitingCards, ...others];
                this.cards = pool.map((item) => item.card);
                this.currentCardIndex += others.length;
                await this.drawingCards(pool, true);
            } else {
                const onTableCards = this.cardPool.filter(
                    (card) => card.location !== CardLocation.Box && card.location !== CardLocation.Trash
                );
                if (onTableCards.length > 0) {
                    this.currentCardIndex += this.cardPool.length;
                }
                await this.draw6Cards(true);
            }

            this.updateStacksCardBox(this.currentCardIndex, this.cutCardIndex);
        }
    }

    async draw6Cards(animated = true) {
        if (animated) {
            await this.dropCards(this.cardPool, animated);
        } else {
            this.dropCards(this.cardPool, animated);
        }
        this.resetCardsToBox(this.cardPool);
        this.cards = this.cardPool.map((item) => item.card);
        if (animated) {
            await this.drawingCards(this.cardPool, animated);
        } else {
            this.drawingCards(this.cardPool, animated);
        }
    }

    async dropCards(cards: PoolItem[], animated = true) {
        if (!animated) {
            cards.map(async (item) => {
                item.card.closeCard(animated ? this.movingCardDuration / 2 : 0);
                this.moveCard(item.card, CardLocation.Trash, animated);
                item.card.node.active = false;
                this.updateLocation(item, CardLocation.Trash);
            });
            return;
        }
        await Promise.all(
            cards.map(async (item) => {
                item.card.closeCard(animated ? this.movingCardDuration / 2 : 0);
                await this.moveCard(item.card, CardLocation.Trash, animated);
                item.card.node.active = false;
                this.updateLocation(item, CardLocation.Trash);
            })
        );
    }

    resetCardsToBox(pool: PoolItem[]) {
        pool.forEach((item) => {
            item.card.card.faceDown();
            item.location = CardLocation.Box;
            this.moveCard(item.card, CardLocation.Box, false);
            item.card.node.active = false;
        });
    }

    async drawingCards(cards: PoolItem[], animated = true) {
        for (let i = 0; i < cards.length; i++) {
            const item = cards[i];
            const nextLocation = i + 1;
            item.card.node.active = true;
            item.card.setIndexValue(this.currentCardIndex + i);
            if (animated) {
                this.playSoundDrawCard();
                await this.moveCard(item.card, nextLocation, animated);
            } else {
                this.moveCard(item.card, nextLocation, animated);
            }
            this.updateLocation(item, nextLocation);
        }
    }

    getPosition(location: number) {
        let node: Node;
        switch (location) {
            case CardLocation.Player1:
            case CardLocation.Player2:
            case CardLocation.Player3:
                node = this.cardHands[0].getCardLocation(Math.floor(location / 3));
                break;
            case CardLocation.Banker1:
            case CardLocation.Banker2:
            case CardLocation.Banker3:
                node = this.cardHands[1].getCardLocation(Math.floor(location / 3));
                break;

            case CardLocation.Waiting1:
            case CardLocation.Waiting2:
                node = this.nodeWaitingCard.children[location - CardLocation.Waiting1];
                break;

            case CardLocation.Box:
                node = this.nodeBoxCard;
                break;
            case CardLocation.Trash:
                node = this.nodeTrash;
                break;
            default:
                break;
        }
        return node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
    }

    async moveCard(card: FairnessCard, nextLocation: number, animated: boolean) {
        const cardNode = card?.node;
        if (cardNode) {
            cardNode.setSiblingIndex(card?.cardIndex);
            const nextPosition = this.nodeCardContainer.getComponent(UITransform).convertToNodeSpaceAR(this.getPosition(nextLocation));
            this.transformCardNode(cardNode, nextLocation, animated);
            if (animated) {
                await this.moveCardAnimation(cardNode, nextPosition, animated);
            } else {
                this.moveCardAnimation(cardNode, nextPosition, animated);
            }
        }
    }

    moveCardAnimation(node: Node, position: Vec3, animated) {
        if (!animated) {
            node.position = position;
            return;
        }

        return new Promise((resolve) => {
            const duration = this.movingCardDuration;
            tween(node)
                .to(duration, {
                    position,
                })
                .call(resolve)
                .start();
        });
    }

    @handle(GameBaccaratX.Multiplier.BaccaratMultipliersHandler, (handler, cardsStates: gc.GameBaccaratX.CardsState) =>
        handler.openCards(cardsStates)
    )
    updateCardStates(card: ServiceCard, index: number) {
        const hand = index % 2 === 0 ? gc.GameBaccaratX.BetChoice.Player : gc.GameBaccaratX.BetChoice.Banker;
        this.cardsStates[hand] = this.cardsStates[hand] ?? [];
        this.cardsStates[hand].push(card);
        return this.cardsStates;
    }

    clearCardStates() {
        this.cardsStates = {};
    }

    async openCards(result: BaccaratResult, settlemenResult: gc.GameServiceMessage.TSettlementResult, animated = true) {
        this.draw6Cards(false);

        const dataCards: ServiceCard[] = [];
        for (let i = 0; i < 3; i++) {
            [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team) => {
                const handData = result[team];
                dataCards.push(handData[`card${i + 1}`]);
            });
        }

        let index = 0;
        this.beforeOpenCards();
        for (const [dataIndex, data] of dataCards.entries()) {
            if (data) {
                const card = this.cards[index];
                card.node.active = true;
                card.setCardData(data);
                if (index > 3) {
                    this.playSoundDrawCard();
                    const newLocation = dataIndex === 4 ? CardLocation.Player3 : CardLocation.Banker3;
                    if (animated) {
                        await this.moveCard(card, newLocation, animated);
                    } else {
                        this.moveCard(card, newLocation, animated);
                    }

                    // update remove from waiting cards
                    const item = this.cardPool.find((item) => item.card === card);
                    item.location = newLocation;
                }
                if (animated) {
                    this.playSoundOpeningCard();
                    await card.openCard(animated, this.openCardDuration);
                } else {
                    card.openCard(animated);
                }
                this.luckyCardEffect.checkLuckyCard({ card, data, animated });
                this.updateCardStates(data, dataIndex);
                index++;
            }
        }
        this.updateFinalPayout(settlemenResult);
        if (!settlemenResult[gc.GameBaccaratX.BetChoice.Tie]) {
            this.highlightWinHandCards(settlemenResult[gc.GameBaccaratX.BetChoice.Player]);
        }
        [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team, index) => {
            const handData = result[team];
            const comp = this.cardHands[index];
            comp.setScore(handData.score);
        });
    }

    private beforeOpenCards() {
        this.clearScores();
        this.clearCardStates();
        this.luckyCardEffect.resetLuckyCardsColor();
        const scene = director.getScene();
        scene?.emit(MultiplierPayoutEvent.Clear);
    }

    highlightWinHandCards(isPlayerWin: boolean) {
        const locations = isPlayerWin
            ? [CardLocation.Player1, CardLocation.Player2, CardLocation.Player3]
            : [CardLocation.Banker1, CardLocation.Banker2, CardLocation.Banker3];
        const cards = this.cardPool.filter((item) => locations.includes(item.location));
        cards.forEach((item) => item.card.setWinHighlight(true));
    }

    @handle(GameBaccaratX.Multiplier.BaccaratMultipliersHandler, (handler, settlementResult: gc.GameServiceMessage.TSettlementResult) =>
        handler.updateFinalPayout(settlementResult)
    )
    updateFinalPayout(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        return settlementResult;
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoePhase, { fireImmediately: false })
    receivedNewShoe(newShoePhase: boolean) {
        if (newShoePhase) {
            this.isNewShoe = true;
            this.dropCards(this.cardPool, false);
            this.updateStacksCardBox(0, 1);
            this.clearScores();
        }
    }

    private clearScores() {
        this.cardHands.forEach((comp) => {
            comp.showScore(false);
        });
    }

    test() {
        const shoe = {
            roundTime: 48,
            cutCardIndex: 200,
            burnedCards: 7,
            firstCard: {
                rank: 5,
                suit: 3,
            },
            currentIndex: 6,
            animated: true,
        };

        this.startNewShoe(shoe);
    }

    testOpenCards() {
        const cards1 = {
            player: {
                card1: { rank: 2, suit: 0 },
                card2: { rank: 2, suit: 1 },
                card3: { rank: 2, suit: 2 },
                score: 9,
            },
            banker: {
                card1: { rank: 4, suit: 0 },
                card2: { rank: 2, suit: 1 },
                card3: { rank: 4, suit: 2 },
                score: 3,
            },
        };

        const cards2 = {
            player: {
                card1: { rank: 7, suit: 0 },
                card2: { rank: 0, suit: 1 },
                card3: null,
                score: 9,
            },
            banker: {
                card1: { rank: 6, suit: 0 },
                card2: { rank: 0, suit: 1 },
                card3: null,
                score: 8,
            },
        };

        this.openCards(cards1, {}, false);
        this.scheduleOnce(() => {
            this.openCards(cards2, {}, true);
        }, 0.1);
    }

    @render(gc.GameConfigs.GameSetting, (store) => store.durations)
    storeCutCardsTimePoint(duration: gc.GameConfigs.DurationSetting) {}

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeInfo)
    async startNewShoe(shoeInfo: gc.GameServiceMessage.ShoeInfo) {
        if (!shoeInfo || !shoeInfo.animated) {
            return;
        }
        const { firstCard, burnedCards, roundTime, cutCardIndex } = shoeInfo;
        this.cutCardIndex = cutCardIndex;

        this.nodeBgNewShoe.active = true;
        if (roundTime >= this.timePointCutCards) {
            await this.playAnimationCutCard(cutCardIndex);
        }

        if (roundTime > this.beforeStartRound) {
            await this.playAnimationBurnCards(firstCard, burnedCards, roundTime >= this.timePointBurnCards);
        }

        this.currentCardIndex = burnedCards;
    }

    async playAnimationCutCard(cutCardIndex: number) {
        await this.initSpineCutCard();
        const label = this.nodeCutCards.getComponentInChildren(Label);
        if (label) {
            label.string = gc.Translator.gameTranslate("show_cut_card_index", {
                cut_card_index: cutCardIndex,
            });
        }
        this.nodeCutCards.active = true;
        await AnimationUtils.playSpine(this.spineCutCard, "cut-card", false);
        await AnimationUtils.delayTime(0.5);
        this.nodeCutCards.active = false;
    }

    async playAnimationBurnCards(firstCard: ServiceCard, burnedCards: number, animated: boolean) {
        for (let i = 0; i < burnedCards; i++) {
            const node = this.createNewCardNode();
            const cardComp = node.getComponent(FairnessCard);
            cardComp.setIndexValue(i);
            this.nodeBurnCards.addChild(node);
            node.position = ComponentUtils.convertPosition(this.nodeBurnCards, this.nodeBoxCard);
            this.transformCardNode(node, CardLocation.Box, false);

            node.active = false;

            if (i === 0) {
                cardComp.setCardData(firstCard);
            }

            this.burnCardsNodes.push(node);
        }

        const firstCardNode = this.burnCardsNodes[0];
        firstCardNode.active = true;
        this.playSoundDrawCard();
        const firstCardComp = firstCardNode.getComponent(FairnessCard);
        animated && this.playSoundOpeningCard();
        firstCardComp.openCard(animated);
        this.transformCardNode(firstCardNode, CardLocation.Center, animated);
        await this.moveCardAnimation(firstCardNode, v3(0, 0, 0), animated);

        animated && (await AnimationUtils.delayTime(2));

        const spacingFirstCard = 25;
        const spacingBurnedCards = 10;
        const cardWidth = 60;

        const totalWidth = cardWidth * burnedCards + (burnedCards - 2) * spacingBurnedCards + spacingFirstCard;
        const firstCardsX = -totalWidth / 2 + cardWidth / 2;
        await this.moveCardAnimation(firstCardNode, v3(firstCardsX, 0, 0), animated);

        const startX = firstCardsX + spacingFirstCard + cardWidth;
        for (let i = 1; i < this.burnCardsNodes.length; i++) {
            this.playSoundDrawCard();
            const node = this.burnCardsNodes[i];
            node.active = true;

            this.transformCardNode(node, CardLocation.Center, animated);
            this.moveCardAnimation(node, v3(startX + (i - 1) * (cardWidth + spacingBurnedCards), 0, 0), animated);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    renderClearBurnCards(roundTime: number) {
        if (roundTime <= this.beforeStartRound && roundTime > this.durations.placingBet) {
            this.clearBurnCards();
        }
    }

    private get beforeStartRound() {
        return this.durations.placingBet + this.durations.startRound + 1;
    }

    async clearBurnCards() {
        try {
            const dropPosition = ComponentUtils.convertPosition(this.nodeBurnCards, this.nodeTrash);
            for (let i = 0; i < this.burnCardsNodes.length; i++) {
                i > 0 && (await AnimationUtils.delayTime(0.1));
                const node = this.burnCardsNodes[i];
                this.transformCardNode(node, CardLocation.Trash);
                this.moveCardAnimation(node, dropPosition, true).then(() => {
                    node.destroy();
                });
            }
            this.burnCardsNodes = [];
            if (this.isNewShoe) {
                this.updateStacksCardBox(this.currentCardIndex, this.cutCardIndex);
            }

            this.nodeBgNewShoe.active = false;
            this.isNewShoe = false;
        } catch (e) {}
    }

    transformCardNode(node: Node, location: CardLocation, animated = true) {
        let scale: Vec3;
        let eulerAngles: Vec3;
        switch (location) {
            case CardLocation.Trash:
                eulerAngles = this.nodeTrash.eulerAngles;
                scale = this.nodeTrash.scale;
                break;
            case CardLocation.Box:
                eulerAngles = this.nodeBoxCard.eulerAngles;
                scale = this.nodeBoxCard.scale;
                break;

            case CardLocation.Player3:
                eulerAngles = v3(0, 0, -90);
                scale = v3(1, 1, 1).multiplyScalar(0.34);
                break;
            case CardLocation.Banker3:
                eulerAngles = v3(0, 0, 90);
                scale = v3(1, 1, 1).multiplyScalar(0.34);
                break;

            default:
                eulerAngles = v3(0);
                scale = v3(1, 1, 1).multiplyScalar(0.34);
                break;
        }
        if (animated) {
            tween(node).to(0.5, { scale, eulerAngles }).start();
        } else {
            node.scale = scale;
            node.eulerAngles = eulerAngles;
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundDrawCard() {
        return "draw-single-card";
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundOpeningCard() {
        return "opening-card";
    }

    updateStacksCardBox(currentIndex: number, cutCardIndex: number) {
        if (this?.nodeStackCards) {
            const percent = Math.ceil((currentIndex / cutCardIndex) * this.maximizeStackCards);
            if (percent > 0) {
                this.nodeStackCards.active = true;
                this.nodeStackCards?.children?.forEach((child, index) => {
                    child && (child.active = percent - 1 >= index);
                });
            } else {
                this.nodeStackCards.active = false;
            }
        }
    }
}
