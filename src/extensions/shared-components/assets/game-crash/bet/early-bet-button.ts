import gc from "@sg/game-client-base";
import { Node, Sprite, _decorator } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Rounds, Translator } = gc;

@ccclass
export default class EarlyBetButton extends ObserverComponent {
    @property(Sprite)
    bgWaiting: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

    @property(Node)
    bgWaitingDisabled: Node = null;

    private readonly placeBetSound = "place_bet";

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.clickEarlyBet())
    onClickEarlyBet() {
        this.closeAllPopups();
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(GameCrash.CrashBet.EarlyBetStore, (store) => store.earlyBetEnable)
    renderEarlyBetStore(enable: boolean) {
        if (enable) {
            this.playSoundPlaceBet();
        }
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.buttonState)
    renderButtonState(buttonState: string) {
        const isBetNextRound = buttonState === GameCrash.ButtonState.BET_NEXT_ROUND;
        const isWaitingBet = buttonState === GameCrash.ButtonState.CANCEL_BET;
        this.bgWaiting.node.active = isWaitingBet;
        this.bgPlaceBet.node.active = isBetNextRound;
        this.node.active = isWaitingBet || isBetNextRound;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundPlaceBet() {
        return this.placeBetSound;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.disabledWaitingBet)
    setDisabledWaitingBet(disabledWaitingBet: boolean) {
        this.bgWaitingDisabled.active = disabledWaitingBet;
    }
}
