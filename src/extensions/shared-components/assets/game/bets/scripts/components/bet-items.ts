import gc from "@sg/game-client-base";
import { Node, _decorator } from "cc";
import { isEmpty } from "lodash-es";
import Observer from "observer";
import { StaticNode } from "../../../../shared/common-components/static-node/scripts/static-node";
import { StaticGroupId } from "../../../../shared/common-components/static-node/scripts/static-node-info";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
import BetItem from "./bet-item";

const { ccclass } = _decorator;
const { render, handle } = Observer;
const { Settlements, Rounds, RoundHistories } = gc;

type TContainerStatics = {
    [groupId: number]: Node[];
};
@ccclass
export class BetItems extends ObserverComponent {
    betItemComponents: BetItem[] = [];
    settlementResult: gc.GameServiceMessage.TSettlementResult = null;

    init() {
        this.betItemComponents = this.node.getComponentsInChildren(BetItem);
        this.betItemComponents.forEach((item) => item.init());
    }

    onLoad() {
        this.init();
        this.handleStaticNode();
        super.onLoad();
    }

    protected handleStaticNode() {
        const containerStatics: TContainerStatics = {
            [StaticGroupId.TextContainer]: [],
            [StaticGroupId.ChipContainer]: [],
            [StaticGroupId.BetInfoContainer]: [],
        };

        this.betItemComponents.forEach((betItemComponent) => {
            containerStatics[StaticGroupId.TextContainer].push(betItemComponent?.choice, betItemComponent?.lblOdds?.node);
            containerStatics[StaticGroupId.ChipContainer].push(betItemComponent?.chipBox);
            containerStatics[StaticGroupId.BetInfoContainer].push(betItemComponent?.lblOwnBet?.node, betItemComponent?.lblTotalBet?.node);
        });

        Object.keys(containerStatics).forEach((groupId) => {
            containerStatics[groupId]?.forEach((item: Node) => {
                const itemComp = item?.addComponent(StaticNode);
                itemComp && (itemComp.groupId = +groupId);
            });
        });
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult)
    updateSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        settlementResult && (this.settlementResult = settlementResult);
    }

    get lostBetItems(): BetItem[] {
        return this.betItemComponents.filter((item: BetItem) => !this.settlementResult?.[item.betChoice]);
    }

    get winBetItems(): BetItem[] {
        return this.betItemComponents.filter((item: BetItem) => this.settlementResult?.[item.betChoice]);
    }

    filterBetItem(choice: string) {
        return this.betItemComponents.find((item) => item.node.name === choice);
    }

    @render(Rounds.RoundStore, (store) => store.roundOdds)
    renderOdds(roundOdds: gc.Rounds.RoundOdds) {
        const { odds, fractional } = roundOdds;

        Object.keys(odds).forEach((choice) => {
            const betItem = this.filterBetItem(choice);
            betItem?.renderOdd(odds[choice], fractional);
        });
    }

    @render(Rounds.RoundStore, (store) => store.ownBets, { fireImmediately: false })
    renderOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            if (ownBets?.[choice]) {
                betItem.renderOwnBet(gc.FormatUtils.numberWithCommas(ownBets[choice]));
            } else {
                betItem.renderOwnBet("");
            }
        });
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            if (totalBets?.[choice]) {
                betItem.renderTotalBet(gc.FormatUtils.numberWithCommas(totalBets[choice]));
            } else {
                betItem.renderTotalBet("");
            }
        });
    }

    @render(Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        this.clearHighlightStatic();
        this.clearHighlightAnim();
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }
        const { roundHistory, staticHighlight, animationHighlight } = firstJoinGameHistory;
        roundHistory && this.setHighlightStatic(staticHighlight, animationHighlight, roundHistory);
    }

    setHighlightStatic(staticHighlight: boolean, animationHighlight: boolean, roundHistory: gc.RoundHistories.RoundHistory) {
        if (staticHighlight || animationHighlight) {
            this.showHighlightStatic(roundHistory.settlementResult);
        }
    }

    @render(Rounds.RoundStore, (store) => store.highLightAnim, { fireImmediately: false })
    handleHighlightAnim(highLightInfo: gc.Rounds.THighlightAnim) {
        const { settlementResult, isAnim } = highLightInfo;
        if (highLightInfo?.settlementResult) {
            this.betItemComponents.forEach((betItem) => {
                const choice = betItem.node.name;
                betItem.handleHighlightAnim(this.isWinning(+settlementResult?.[choice]) && isAnim);
            });
        } else {
            this.clearHighlightAnim();
        }
    }

    @render(Rounds.RoundStore, (store) => store.highlightStatic, { fireImmediately: false })
    handleHighlightStatic(highlightStatic: gc.Rounds.THighlightStatic) {
        if (!isEmpty(highlightStatic?.settlementResult)) {
            this.showHighlightStatic(highlightStatic.settlementResult);
        } else {
            this.clearHighlightStatic();
        }
    }

    protected showHighlightStatic(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.handleHighlightStatic(this.isWinning(+settlementResult?.[choice]));
        });
    }

    protected showAnimationHighlight(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.handleHighlightAnim(this.isWinning(+settlementResult?.[choice]));
        });
    }

    @render(Rounds.RoundStore, (store) => store.isResetHighlight)
    handleResetHighlight(isResetHighlight: boolean) {
        if (isResetHighlight) {
            this.clearHighlightStatic();
        }
    }

    clearHighlightStatic() {
        this.betItemComponents.forEach((betItem) => {
            betItem.handleHighlightStatic(false);
        });
    }

    clearHighlightAnim() {
        this.betItemComponents.forEach((betItem) => {
            betItem.handleHighlightAnim(false);
        });
    }

    isWinning(value: number, target = 1) {
        return value === target;
    }

    @render(Rounds.RoundStore, (store) => store.userBetPercentage)
    handleUserBetPercentage(userBetPercentage: gc.GameServiceMessage.UserBetPercentage) {
        if (!userBetPercentage) {
            return;
        }
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.renderUserBetPercentage(userBetPercentage ? userBetPercentage[choice] : 0);
        });
    }

    @render(Rounds.RoundStore, (store) => store.betPercentage)
    handleBetPercentage(betPercentage: gc.GameServiceMessage.BetPercentage) {
        if (!betPercentage) {
            return;
        }
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.renderUserBetPercentage(betPercentage[choice] ? betPercentage[choice] : 0);
        });
    }
}
