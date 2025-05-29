import gc from "@sg/game-client-base";
import { _decorator, Game, game, Label } from "cc";
import Observer from "observer";

import { StaticNode } from "../../../shared/common-components/static-node/scripts/static-node";
import { StaticGroupId } from "../../../shared/common-components/static-node/scripts/static-node-info";
import { ComponentUtils } from "../../../shared/utils";
import { LogStore } from "../stores/log-store";
import { GameComponentBase } from "./game-component-base";

const { Rounds, Connection, HideGame, Settlements, FormatUtils, RoundHistories } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class GameComponent extends GameComponentBase {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblMinBet: Label = null;

    @property(Label)
    lblMaxBet: Label = null;

    containerOptions: gc.IContainerOptions;
    protected isReceiveFinishBeforeRoundHistory = true;
    protected enableFixHandleFinish = false;
    protected enableEventShowHideGame = true;

    onLoad() {
        this.registerEventShowHideGame();
        this.initUserSettings();
        this.initPlayerSelections();
        this.handleStaticNodeAndSetEmptyLabels();
    }

    private registerEventShowHideGame() {
        if (!this.enableEventShowHideGame) {
            return;
        }
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onShowGame, this);
    }

    private clearEventShowHideGame() {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onShowGame, this);
    }

    protected handleStaticNodeAndSetEmptyLabels() {
        const lblList: Label[] = [this?.lblRoundId, this?.lblMinBet, this?.lblMaxBet];
        if (lblList.length > 0) {
            lblList?.forEach((label) => {
                if (label) {
                    const component = label?.addComponent(StaticNode);
                    component && (component.groupId = StaticGroupId.TextContainer);
                }
            });
            ComponentUtils.setEmptyLabels(lblList);
        }
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.name)
    logLoadScene(gameName: string) {
        console.log(`LoadScene ${gameName}`);
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {}

    @handle(gc.UserSettings.UserSettingHandlers, (handle) => handle.loadStorages())
    initUserSettings() {}

    @handle(gc.PlayerSelections.PlayerSelectionHandlers.InitHandlers)
    initPlayerSelections() {}

    protected onDestroy(): void {
        this.clearEventShowHideGame();
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {
        // reload here will run when page appears from hidden
        // to fix issue on iOS that EVENT_SHOW are not triggered when phone active
        // if (sys.os === sys.OS.IOS) {
        //     setTimeout(() => {
        //         window.location.reload();
        //     }, 100);
        // }
    }

    onShowGame() {
        window.location.reload();
    }

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinGameHistory)
    handleJoinGameAndShowResult(joinGameHistory: gc.RoundHistories.IJoinGameHistory) {
        if (this.enableFixHandleFinish) {
            return;
        }
        const { roundHistory } = joinGameHistory ?? {};
        if (roundHistory) {
            this.isReceiveFinishBeforeRoundHistory = false;
            this.showResult(roundHistory?.result, false, roundHistory?.settlementResult);
        }
    }

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    renderRoundId(roundId: number) {
        roundId > 0 && this.lblRoundId && (this.lblRoundId.string = `#${roundId}`);
    }

    @render(Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {
        this.lblMinBet && (this.lblMinBet.string = FormatUtils.numberWithCommas(minBet));
        this.lblMaxBet && (this.lblMaxBet.string = FormatUtils.numberWithCommas(maxBet));
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        if (this.enableFixHandleFinish) {
            return;
        }
        const { result, settlementResult } = data;

        if (!this.isValidResult(result, settlementResult)) {
            this.isReceiveFinishBeforeRoundHistory = false;
            return;
        }

        this.showResult(result, true, settlementResult).then(() => {
            this.finishShowResult(result, settlementResult);
        });
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    @render(Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish || !this.enableFixHandleFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }

        this.showResult(result, true, settlementResult).then(() => {
            this.finishShowResult(result, settlementResult);
        });
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    async showResult(
        result: gc.GameServiceMessage.TResult,
        hasAnimation: boolean,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ) {}

    isValidResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        return !!result && !!settlementResult;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {}

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    handleStartRound(isStartRound: boolean) {}

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        isStartRound && this.playSound(gc.Audios.AudioIds.STARTING_ROUND);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }
}
