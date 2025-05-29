import gc from "@sg/game-client-base";
import { _decorator, Button, instantiate, Label, Node, Prefab } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { BetAmountItem } from "./bet-amount-item";

const { FormatUtils, GameCrash } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetAmountPopup extends ObserverComponent {
    @property(Node)
    nodeBetContainer: Node = null;

    @property(Prefab)
    prfBetAmount: Prefab = null;

    @property(Label)
    lblBetAmount: Label = null;

    @property(Label)
    lblBetRange: Label = null;

    @property(Button)
    btnConfirm: Button = null;

    private readonly chipsLimit = 8;

    @render(GameCrash.BetInput.BetInputStore, (store) => ({ chips: store.chips, minBet: store.minBet, maxBet: store.maxBet }))
    private initBetAmount({ chips, minBet, maxBet }) {
        this.nodeBetContainer.destroyAllChildren();
        let count = 1;
        chips.forEach((chip) => {
            if (+chip < minBet || +chip > maxBet || count > this.chipsLimit) {
                return;
            }
            const node = instantiate(this.prfBetAmount);
            const comp = node.getComponent(BetAmountItem);
            comp?.setBetAmountItem(chip);
            this.nodeBetContainer.addChild(node);
            count += 1;
        });
        this.updateBetRange({ minBet, maxBet });
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.isOpenBetAmountPopup)
    private setBetAmountPopupVisibilty(status: boolean) {
        this.node.active = status;
        status && this.closeOtherPopups();
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.betAmountTemp)
    private updateBetAmount(amount: number) {
        this.lblBetAmount.string = `${FormatUtils.numberWithCommas(amount, 2)}`;
        this.checkConfirmBtnStatus(amount > 0);
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutBetInput())
    closeOtherPopups() {}

    @handle(GameCrash.BetInput.BetInputHandler, (handle) => handle.closeBetAmountPopup())
    private onCloseClick() {
        this.playSoundClick();
    }

    @handle(GameCrash.BetInput.BetInputHandler)
    private onConfirmClick() {
        this.playSoundClick();
    }

    @handle(GameCrash.BetInput.BetInputHandler, (handler) => handler.resetBetAmount())
    private onClearClick() {
        this.playSoundClick();
    }

    private checkConfirmBtnStatus(status: boolean) {
        this.btnConfirm.interactable = status;
        this.btnConfirm.node.getChildByName("overlay").active = !status;
    }

    private updateBetRange({ minBet, maxBet }) {
        this.lblBetRange.string = `${FormatUtils.numberWithCommas(minBet, 2)} - ${FormatUtils.numberWithCommas(maxBet, 2)}`;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
