import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Node } from "cc";
import Observer from "observer";

import BetHistoryBodyItem, { BetHistoryBodyItemType } from "../../../game/bet-history/scripts/components/bet-history-body-item";

const { ccclass, property } = _decorator;
const { handle } = Observer;

const { GameBaccaratX, FormatUtils, BetDetailsNew, DateTimeUtils } = gc;

@ccclass
export class BaccaratXBetHistorybodyItem extends BetHistoryBodyItem {
    @property(Node)
    nodeDisabledVerify: Node = null;

    @property(Label)
    lblVerify: Label = null;

    setData(data: BetHistoryBodyItemType) {
        const { verifiable, time } = data.betHistoryLog;
        super.setData(data);

        this.nodeDisabledVerify.active = !verifiable;
        this.lblVerify.color = verifiable ? new Color().fromHEX("0055FF") : new Color().fromHEX("586379");
        this.lblTime.string = `${DateTimeUtils.getStringDate1(time)} ${DateTimeUtils.getString12HourByTime(time)}`;
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickFairness() {
        this.playSoundClick();
        return this.betHistoryLog.roundId;
    }
}
