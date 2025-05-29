import gc from "@sg/game-client-base";
import { _decorator, CCFloat, instantiate, Layers, Node, tween, UITransform, v3 } from "cc";
import { random, round } from "lodash-es";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../../shared/utils";
import { AroundTablePlayers } from "../../../around-table-player/scripts/components/around-table-players";
import {
    AroundTablePlayersChipStore,
    IAroundTablePlayerChip,
    IAroundTablePlayerPlaceChip,
} from "../../../around-table-player/scripts/stores/around-table-players-chip-store";
import { AroundTablePlayerUtils } from "../../../around-table-player/scripts/utils";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { TBalanceEffect, TWinningEffect } from "../../../balance-effect/scripts/stores/balance-effect-store";
import BetItem from "../../../bets/scripts/components/bet-item";
import { BetItems } from "../../../bets/scripts/components/bet-items";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import { FlyChipUtils } from "../../../sliding-chip/scripts/utils/fly-chip-utils";
import { ActionChipFlying, addChipsToChipBoxWhenJoinRoom, placeChipToChipBox } from "./actions";

const { Auth, Chips, Settlements, Rounds } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

export interface IChipFlyingInfo {
    slidingChip: SlidingChip;
    hiddenPlayersNode: Node;
    mainPlayerAvatarNode: Node;
    payChipsDuration: number;
}

export interface IMainPlayerChip {
    chipValue: number;
    chipBox?: Node;
}

@ccclass
export class ChipFlying extends ObserverComponent {
    @property(Node)
    mainPlayerAvatarNode: Node = null;

    @property(Node)
    hiddenPlayersNode: Node = null;

    @property(Node)
    dealerChipBox: Node = null;

    @property(Node)
    chipContainer: Node = null;

    @property(Node)
    nodeSlidingChip: Node = null;

    @property(Node)
    nodeAroundTablePlayers: Node = null;

    @property(Node)
    nodeBetItems: Node = null;

    @property
    usingDelayPayChips = true;

    @property({
        visible: function (this: ChipFlying) {
            return this.usingDelayPayChips;
        },
        type: CCFloat,
    })
    delayAnimPayChips = 1.25;

    @property
    supportChoices = "";
    protected get validChoices() {
        return this.supportChoices.split(",");
    }

    slidingChip: SlidingChip = null;
    aroundTablePlayers: AroundTablePlayers = null;
    betItems: BetItems = null;
    useFakeChip = false;

    protected enablePlaceChips = true;
    protected payChipsDuration = 1.2;
    protected chipDelayFlyingTime = 1.25;
    protected settlementStatus: gc.GameServiceMessage.Status = null;
    protected aroundTablePlayerChips = [];
    protected isFlyChipSlow = true;
    protected chipStorage = {};
    protected startShowResultAnimation = false;
    protected winningPlayers: gc.GameServiceMessage.TWinningPlayers = {};

    onLoad(): void {
        this.fetchComponents();
        super.onLoad();
    }

    fetchComponents() {
        this.slidingChip = this.nodeSlidingChip?.getComponent(SlidingChip);
        this.aroundTablePlayers = this.nodeAroundTablePlayers?.getComponent(AroundTablePlayers);
        this.betItems = this.nodeBetItems?.getComponent(BetItems);
    }

    @render(Chips.ChipStore, (store) => store.chipsByMainPlayerRate)
    async flyChipsWhenJoinGame(chipsByMainPlayerRate: gc.Chips.TChipsByMainPlayerRate) {
        if (!this.node.activeInHierarchy || !chipsByMainPlayerRate.isShow || Object.keys(chipsByMainPlayerRate?.chips).length === 0) {
            return;
        }

        while (!this.slidingChip.getReady()) {
            await FunctionUtils.delay(100);
        }

        for (const betItem of this.betItems.betItemComponents) {
            const chipGroup = chipsByMainPlayerRate.chips[betItem.betChoice];
            if (chipGroup) {
                const nodes = addChipsToChipBoxWhenJoinRoom(this.chipContainer, betItem.chipBox, chipGroup, this.slidingChip);
                this.addChipsToBoxWithChoice(nodes, betItem.betChoice);
            }
        }
    }

    @render(Chips.ChipStore, (store) => store.ownChip, { fireImmediately: false })
    flyOwnChip(ownChip: gc.GameServiceMessage.OwnChip) {
        const { betChoice, amount } = ownChip ?? {};
        if (!betChoice || !amount) {
            return;
        }

        const betItem = this.betItems?.betItemComponents.find((item) => betChoice === item.betChoice);
        if (!betItem) {
            return;
        }
        const mainPlayerChip: IMainPlayerChip = {
            chipBox: betItem?.chipBox,
            chipValue: amount,
        };
        this.placeChipToChipBox(betChoice, this.chipContainer, this.slidingChip, mainPlayerChip, null, null);
        this.playSoundSingleChip();
    }

    protected placeChipToChipBox(
        betChoice: string,
        chipContainer: Node,
        slidingChip: SlidingChip,
        mainPlayerChip: IMainPlayerChip,
        startNode: Node,
        onComplete: () => void,
        isHiddenPlayer = false
    ) {
        const chipNode = placeChipToChipBox(chipContainer, slidingChip, mainPlayerChip, startNode, onComplete, isHiddenPlayer);
        this.addChipsToBoxWithChoice([chipNode], betChoice);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundSingleChip() {
        return gc.Audios.AudioIds.SINGLE_CHIP;
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult, { fireImmediately: false })
    payChipsWhenReceivingSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        if (!this || !settlementResult || !this.enablePlaceChips || !this.node) {
            return;
        }

        if (!this.node.activeInHierarchy) {
            this.actionPayChips(false);
        } else {
            this.startShowResultAnimation = true;

            if (this.usingDelayPayChips) {
                tween(this.node)
                    .delay(this.delayAnimPayChips)
                    .call(() => this.actionPayChips(true))
                    .start();
            }
        }
    }

    callActionPayChips() {
        if (this.usingDelayPayChips) {
            return;
        }

        this.actionPayChips(true);
    }

    actionPayChips(animated: boolean) {
        if (!animated) {
            ActionChipFlying.dealerGetChips(this.dealerChipBox, this.betItems?.lostBetItems, this);
            ActionChipFlying.dealerPayChips(this.dealerChipBox, this.betItems?.winBetItems, this);
            this.payChipToAllPlayers();
            return;
        }

        tween(this.node)
            .call(() => {
                this.handlePayMoneySound();
                ActionChipFlying.dealerGetChips(this.dealerChipBox, this.betItems?.lostBetItems, this);
            })
            .delay(this.chipDelayFlyingTime)
            .call(() => {
                ActionChipFlying.dealerPayChips(this.dealerChipBox, this.betItems?.winBetItems, this);
            })
            .delay(this.chipDelayFlyingTime)
            .call(() => {
                this.payChipToAllPlayers();
            })
            .start();
    }

    handlePayMoneySound() {
        if (Object.keys(this.chipStorage).length > 0) {
            this.playPayMoneySound();
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX("pay-money"))
    playPayMoneySound() {}

    private readonly payChipToAllPlayers = () => {
        const chipFlyingInfo: IChipFlyingInfo = {
            slidingChip: this.slidingChip,
            hiddenPlayersNode: this.hiddenPlayersNode,
            mainPlayerAvatarNode: this.mainPlayerAvatarNode,
            payChipsDuration: this.payChipsDuration,
        };

        ActionChipFlying.payChipsToMainPlayer(this.settlementStatus, chipFlyingInfo, this.betItems?.winBetItems, this);
        this.showPayoutForMainPlayer();

        if (this.hiddenPlayersNode) {
            ActionChipFlying.payChipsToHiddenPlayers(this.hiddenPlayersNode, this.betItems?.winBetItems, this);
        }

        this.payChipsToAroundTablePlayers();
        this.startShowResultAnimation = false;
    };

    private showPayoutForMainPlayer() {
        if (this.settlementStatus?.win) {
            this.mainPlayerIncreaseBalance(this.settlementStatus?.bet);
            this.mainPlayerPlayWinningEffect();
            if (this.settlementStatus?.reachMaxWin && this.settlementStatus.reachMaxWin) {
                this.handleReachMaxWin();
            }

            this.getBalance();
            this.resetSettlementStatus();
        }
    }

    @handle(Settlements.SettlementHandlers, (handle) => handle.handleReachMaxWin())
    handleReachMaxWin() {}

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.MainPlayerWinEffect)
    mainPlayerPlayWinningEffect() {
        return true;
    }

    @render(Settlements.SettlementStore, (store) => store.winningPlayers, { fireImmediately: false })
    handleWinningAroundTablePlayers(winningPlayers: gc.GameServiceMessage.TWinningPlayers) {
        this.winningPlayers = winningPlayers;

        if (!this.startShowResultAnimation) {
            this.payChipsToAroundTablePlayers();
        }
    }

    protected payChipsToAroundTablePlayers() {
        if (this.winningPlayers === null || Object.keys(this.winningPlayers).length === 0) {
            return;
        }

        const winningPlayerIds = Object.keys(this.winningPlayers);
        const winningEffects: TWinningEffect[] = [];
        const balanceEffects: TBalanceEffect[] = [];

        winningPlayerIds.forEach((playerId) => {
            const aroundTablePlayerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(
                this.aroundTablePlayers?.aroundTablePlayerComponents,
                playerId
            );
            if (!aroundTablePlayerSlot) {
                return;
            }

            const winningPlayerData = this.winningPlayers[playerId];
            const playerBetItems = winningPlayerData.winningByChoices;

            this.betItems.winBetItems.forEach((item) => {
                const chipNodes = this.getChipsByChoice(item.betChoice);
                if (playerBetItems && playerBetItems[item.betChoice] > 0) {
                    this.moveChipsWithRandomAmount(chipNodes, aroundTablePlayerSlot.avatar.node, this.payChipsDuration);
                }
            });

            const { bet } = winningPlayerData;
            aroundTablePlayerSlot.increaseBalance(bet);
            winningEffects.push({ effectNode: aroundTablePlayerSlot.node, status: true });
            balanceEffects.push({ effectNode: aroundTablePlayerSlot.node, balance: bet });
        });

        this.aroundTablePlayersShowWinningEffect(winningEffects);
        this.updateAroundTablePlayersIncreaseBalance(balanceEffects);
    }

    public moveChipsWithRandomAmount(chipNodes: Node[], destBox: Node, flyTime: number) {
        const randomAmount = 3;
        const destWorldPosition = destBox.parent.getComponent(UITransform).convertToWorldSpaceAR(destBox.position);
        const cloneChipsBox = new Node();
        cloneChipsBox.layer = Layers.Enum.UI_2D;
        const chipBoxTransform = cloneChipsBox.addComponent(UITransform);
        this.chipContainer.addChild(cloneChipsBox);
        const destPosition = chipBoxTransform.convertToNodeSpaceAR(destWorldPosition);
        const chipsCount = round(random(1, randomAmount));
        for (let i = 0; i < chipsCount; i++) {
            const chip = chipNodes[i];
            if (chip) {
                const cloneChip = instantiate(chip);
                const chipTransform = chip.getComponent(UITransform);
                cloneChip.position = chipBoxTransform.convertToNodeSpaceAR(chipTransform.convertToWorldSpaceAR(v3(0)));
                chipBoxTransform.node.addChild(cloneChip);
                FlyChipUtils.moveChipThenDestroy(cloneChip, destPosition, flyTime);
            }
        }
        tween(this.node)
            .delay(flyTime * 1.5)
            .call(() => {
                cloneChipsBox.destroy();
            })
            .start();
    }

    @handle(BalanceEffectHandlers.AroundTablePlayersWinEffect)
    aroundTablePlayersShowWinningEffect(winningEffects: TWinningEffect[]) {
        return winningEffects;
    }

    @handle(BalanceEffectHandlers.AroundTablePlayersIncreaseBalance)
    updateAroundTablePlayersIncreaseBalance(balanceEffects: TBalanceEffect[]) {
        return balanceEffects;
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, { fireImmediately: false })
    handleSettleStatus(settlementStatus: gc.GameServiceMessage.Status) {
        this.settlementStatus = settlementStatus;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    startNewRound(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.resetSettlementStatus();
    }

    protected resetSettlementStatus() {
        this.settlementStatus = null;
        this.startShowResultAnimation = false;
    }

    @render(Chips.ChipStore, (store) => store.collectChipsReBet, { fireImmediately: false })
    flyChipsReBet(collectChipsReBet: gc.Chips.TChipReBet[]) {
        if (collectChipsReBet.length === 0) {
            return;
        }

        collectChipsReBet.forEach((chipReBet) => {
            const { betChoice, amount } = chipReBet;
            const betItem = this.betItems?.betItemComponents.find((item) => betChoice === item.betChoice);
            if (betItem) {
                this.placeChipToChipBox(
                    betChoice,
                    this.chipContainer,
                    this.slidingChip,
                    {
                        chipBox: betItem?.chipBox,
                        chipValue: amount,
                    },
                    null,
                    null
                );
                this.playSoundSingleChip();
            }
        });
    }

    @render(AroundTablePlayersChipStore, (store) => store.aroundTablePlayerChip, { fireImmediately: false })
    handleAroundTablePlayerPlaceChip(aroundTablePlayerPlaceChip: IAroundTablePlayerChip) {
        if (!this.aroundTablePlayers) {
            return;
        }
        const { playerChip, chipValues, clientRoundId } = aroundTablePlayerPlaceChip ?? {};
        if (!playerChip) {
            return;
        }
        const { betChoice, playerId } = playerChip;
        if (this.supportChoices !== "" && !this.validChoices.includes(betChoice)) {
            return;
        }
        this.aroundTablePlayerChips.push(aroundTablePlayerPlaceChip);

        const betItem: BetItem = AroundTablePlayerUtils.getBetItem(this.betItems.betItemComponents, betChoice);
        if (!betItem) {
            return;
        }
        let startNode: Node;
        let isHiddenPlayer = false;
        const aroundTablePlayer = AroundTablePlayerUtils.getAroundTablePlayerSlot(
            this.aroundTablePlayers.aroundTablePlayerComponents,
            playerId
        );

        if (aroundTablePlayer) {
            AroundTablePlayerUtils.updatePlayerSlotDataStorage(playerChip, aroundTablePlayer);
            startNode = aroundTablePlayer.avatar.node;
        } else {
            startNode = this.hiddenPlayersNode;
            isHiddenPlayer = true;
            this.aroundTablePlayers.updateHiddenPlayerStorage(playerChip);
        }

        const aroundTablePlayerInfo = {
            betChoice,
            chipValues,
            chipBox: betItem?.chipBox,
            startNode,
            isHiddenPlayer,
        };

        this.useFakeChip && this.storeTotalBetsChips(betChoice, chipValues, clientRoundId);

        if (!this.node.activeInHierarchy) {
            this.placeAroundTablePlayerChip(aroundTablePlayerInfo);
        } else {
            const delayTime = this.calculateDelayTime();
            this.delayedPlaceChip(aroundTablePlayerInfo, delayTime);
        }
    }

    private storeTotalBetsChips(betChoice: string, chipValues: Record<string, number>, clientRoundId: number) {
        const existingStorage = gc.Shared.utils.StorageManager.get("TotalBetsChips")?.[clientRoundId] || {};

        const updatedChips = this.mergeChipValues(existingStorage[betChoice] || {}, chipValues);

        const newStorage = {
            ...existingStorage,
            [betChoice]: updatedChips,
        };

        if (Object.keys(existingStorage).length === 0) {
            gc.Shared.utils.StorageManager.remove("TotalBetsChips");
        }

        gc.Shared.utils.StorageManager.set("TotalBetsChips", {
            [clientRoundId]: newStorage,
        });
    }

    private mergeChipValues(existing: Record<string, number>, chipValues: Record<string, number>): Record<string, number> {
        const merged = { ...existing };
        Object.entries(chipValues).forEach(([key, value]) => {
            merged[key] = (merged[key] || 0) + value;
        });
        return merged;
    }

    @render(Rounds.RoundTimeStore, (store) => ({ roundTime: store.roundTime, lockingBet: store.lockingBet }))
    calculateDelayFlyChip({ roundTime, lockingBet }: { roundTime: number; lockingBet: number }) {
        if (roundTime >= lockingBet + 2) {
            this.isFlyChipSlow = true;
        } else {
            this.isFlyChipSlow = false;
        }
    }

    protected calculateDelayTime() {
        let delayTime = this.aroundTablePlayerChips.length * 0.01;

        if (this.isFlyChipSlow) {
            delayTime = this.aroundTablePlayerChips.length * 0.07;
        }

        return delayTime > 1 ? delayTime / 2 : delayTime;
    }

    protected delayedPlaceChip(aroundTablePlayerInfo: IAroundTablePlayerPlaceChip, delayTime: number) {
        tween(this.node)
            .delay(delayTime)
            .call(() => {
                this.placeAroundTablePlayerChip(aroundTablePlayerInfo);
            })
            .start();
    }

    protected placeAroundTablePlayerChip(visiblePlayerPlaceChip: IAroundTablePlayerPlaceChip) {
        const { chipValues, chipBox, startNode, isHiddenPlayer, betChoice } = visiblePlayerPlaceChip ?? {};
        if (chipValues) {
            this.playSoundSingleChip();
            Object.keys(chipValues).forEach((chipValue) => {
                let count = chipValues[chipValue];
                for (; count > 0; count--) {
                    const ownerChip = {
                        chipBox,
                        chipValue: +chipValue,
                    };
                    this.placeChipToChipBox(betChoice, this.chipContainer, this.slidingChip, ownerChip, startNode, null, isHiddenPlayer);
                }
            });
            this.aroundTablePlayerChips.pop();
        }
    }

    @render(Chips.ChipStore, (store) => store.clearAllChips, { fireImmediately: false })
    clearChipsForAllBetItems() {
        this.chipStorage = {};
        this.chipContainer.destroyAllChildren();
    }

    getChipsByChoice(choice: string): Node[] {
        return this.chipStorage[choice] ?? [];
    }

    addChipsToBoxWithChoice(chips: Node[], betChoice: string) {
        const list = this.chipStorage[betChoice] ?? [];
        list.push(...chips);

        this.chipStorage[betChoice] = list;
    }
}
