import gc, { GameServiceMessage } from "@sg/game-client-base";
import { _decorator, CCFloat, CCInteger, instantiate, Label, Node, Prefab, ScrollView, UITransform } from "cc";
import Observer from "observer";
import { Dialog } from "../../../shared/common-components/dialogs/dialog";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "../../../shared/utils";
import { FairnessPokerCard } from "./fairness-poker-card";
const { ccclass, property } = _decorator;
const { GameBaccaratX } = gc;
const { render, handle } = Observer;
const { fadeIn, getUiOpacity } = AnimationUtils;

@ccclass
export class FairnessVerificationPopup extends ObserverComponent {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblShoeResultSHA256: Label = null;

    @property(Label)
    lblShoeResult: Label = null;

    @property(Label)
    lblMergeSeed: Label = null;

    @property(Node)
    nodeCardsContent: Node = null;

    @property(Prefab)
    prfCard: Prefab = null;

    @property(Prefab)
    prfCutCard: Prefab = null;

    @property(ScrollView)
    cardsScrollView: ScrollView = null;

    @property(Dialog)
    dialog: Dialog = null;

    @property(CCInteger)
    maxIndexCard = 416;

    @property(CCInteger)
    scrollViewMaxColumn = 20;

    @property(CCFloat)
    scrollViewCardHeight = 62.4;

    @property(CCInteger)
    cardSpacing = 4;

    roundId = 0;
    private pfData: GameServiceMessage.ShoeVerification = null;
    private DURATION_DELAY_RENDER_DATA = 0.4;
    private DURATION_SHOW_CARDS = 0.1;
    private readonly calculatedPercent: number[] = [];
    private scrollViewMaxRow: number = 0;

    onLoad() {
        super.onLoad();
        this.initCalculatePercent();
        this.dialog &&
            (this.dialog.onShowComplete = () => {
                if (!this.pfData?.cards) {
                    this.scheduleOnce(this.dialog.onShowComplete, this.DURATION_DELAY_RENDER_DATA);
                    return;
                }
                this.renderCards(this?.pfData);
            });
    }

    protected start(): void {
        this.handleRoundId();
    }

    onDestroy(): void {
        super.onDestroy();
        this.unscheduleAllCallbacks();
    }

    initCalculatePercent() {
        const maxRow = Math.ceil(this.maxIndexCard / this.scrollViewMaxColumn);
        this.scrollViewMaxRow = maxRow;
        const maskHeight = this.nodeCardsContent?.parent?.getComponent(UITransform)?.height;
        const contentHeight = maxRow * this.scrollViewCardHeight + (maxRow + 1) * this.cardSpacing;
        const maxOffset = contentHeight - maskHeight;
        for (let i = 0; i < maxRow; i++) {
            let offset = (this.scrollViewCardHeight + this.cardSpacing) * i;
            if (offset > maxOffset) {
                offset = maxOffset;
            }

            const percent = offset / maxOffset;
            this.calculatedPercent.push(percent);
        }
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handle) => handle.closeVerification())
    closePoup() {}

    @render(GameBaccaratX.ShoePF.ShoePFStore, (store) => store.pf, { fireImmediately: false })
    renderPFRound(pf: GameServiceMessage.ShoeVerification) {
        if (!pf) {
            return;
        }

        this.lblShoeResult.string = pf.rawValue;
        this.lblShoeResultSHA256.string = pf.hashValue;
        this.lblMergeSeed.string = pf.cutCardIndex.toString();
        this.pfData = pf;
    }

    handleRoundId() {
        this.lblRoundId.string = this.roundId.toString();
    }

    protected renderCards(pf: GameServiceMessage.ShoeVerification) {
        const { cards, usedCardIndexes, cutCardIndex, burnedCards } = pf;
        const opacityCardsContent = getUiOpacity(this.nodeCardsContent);
        opacityCardsContent.opacity = 0;
        cards?.forEach((card, index) => {
            let cardNode = instantiate(this.prfCard);
            const comp = cardNode.getComponent(FairnessPokerCard);
            comp.cardFairness.setCardData(card);
            comp.cardFairness.card.faceUp();
            comp.cardFairness.setIndexValue(index);
            if (cutCardIndex === index) {
                const cutCard = instantiate(this.prfCutCard);
                this.nodeCardsContent.addChild(cutCard);
            }

            comp.showHighlight(usedCardIndexes.includes(index));
            comp.showBgBurnCard(index < burnedCards);
            this.nodeCardsContent.addChild(cardNode);
        });

        this.scheduleOnce(async () => {
            await this.handleScrollCardUsing(usedCardIndexes?.slice(-1)[0] || 0);
        }, 0.1);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openCutCardIndex(roundId))
    onClickDetail() {
        return this.roundId;
    }

    protected async handleScrollCardUsing(index: number) {
        const rowIndex = this.calculateDisplayIndex(index);
        const currentIndex = rowIndex >= 2 ? rowIndex - 2 : 0;
        this.cardsScrollView.scrollToPercentVertical(1 - this.calculatedPercent[currentIndex]);
        fadeIn(this.nodeCardsContent, this.DURATION_SHOW_CARDS, 255);
    }

    protected calculateDisplayIndex(currentIndex: number) {
        let rowIndex = 1;
        const totalCards = this.scrollViewMaxRow * this.scrollViewMaxColumn;
        const maxIndex = this.scrollViewMaxRow * this.scrollViewMaxColumn - (this.scrollViewMaxColumn - 1);

        for (let i = 0, j = this.scrollViewMaxColumn - 1; i < maxIndex && j < totalCards; ) {
            if (currentIndex >= i && currentIndex <= j) {
                return rowIndex;
            }
            rowIndex++;
            i += this.scrollViewMaxColumn;
            j += this.scrollViewMaxColumn;
        }

        return 0;
    }
}
