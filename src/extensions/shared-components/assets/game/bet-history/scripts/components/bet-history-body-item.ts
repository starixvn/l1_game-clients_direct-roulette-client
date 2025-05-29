import gc from "@sg/game-client-base";
import { _decorator, Button, Color, Component, instantiate, Label, Node, Prefab } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { property, ccclass } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
const { BetHistory } = gc;
const { handle } = Observer;

export type BetHistoryBodyItemType = {
    betHistoryLog: gc.BetHistory.BetHistoryLog;
    index: number;
    resultPrefab: Prefab | null;
    fractionalOddsFormat?: boolean;
};

@ccclass
export default class BetHistoryBodyItem extends ObserverComponent {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblRound: Label = null;

    @property(Label)
    lblTotalStake: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;

    @property(Button)
    btnRound: Button = null;

    @property(Node)
    result: Node = null;

    @property(Label)
    lblWinLoss: Label = null;

    betHistoryLog: gc.BetHistory.BetHistoryLog = null;

    setData(data: BetHistoryBodyItemType) {
        const { betHistoryLog, index, resultPrefab } = data;
        this.betHistoryLog = betHistoryLog;
        this.nodeBackground.active = index % 2 > 0;
        const { time, betwin, roundId, totalAmount } = betHistoryLog;

        if (time) {
            const date = DateTimeUtils.getStringDate(time);
            const hour = DateTimeUtils.getStringHourByTime(time);
            this.lblDate && (this.lblDate.string = date);
            this.lblHour && (this.lblHour.string = hour);
        }

        this.lblTime && (this.lblTime.string = DateTimeUtils.getStringDateByTime(time));
        this.lblRound.string = roundId.toString();

        this.lblWin && (this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2));
        this.lblTotalStake && (this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2));

        if (resultPrefab) {
            const bodyRow = instantiate(resultPrefab);
            const { result, settlementResult } = betHistoryLog;
            bodyRow.getComponent(BaseResultBodyItem)?.setData(result as gc.BetHistory.DynamicObject<object>, settlementResult);
            this.result.addChild(bodyRow);
        }

        if (this.lblWinLoss) {
            const winloss = betwin - totalAmount;
            this.lblWinLoss.string = FormatUtils.numberWithCommas(winloss, 2);
            this.lblWinLoss.color = winloss >= 0 ? new Color().fromHEX("F1E344") : new Color().fromHEX("EB3D26");
        }
    }

    @handle(BetHistory.BetDetailsHandlers)
    openTicketDetail() {
        this.playSoundClick();
        return this.betHistoryLog;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @handle(gc.RoundBasePF.ProvablyFairHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickVerify() {
        this.playSoundClick();
        return this.betHistoryLog.roundId;
    }

    @handle(gc.BetDetailsNew.BetDetailsHandler, (handler, payload: any) => handler.openBetDetails(payload))
    openBetDetails() {
        this.playSoundClick();
        return {
            roundId: this.betHistoryLog.roundId,
            mode: "dark",
            language: gc.Translator.getLanguageId(),
            timeZoneOffset: -new Date().getTimezoneOffset() / 60,
        };
    }
}

export class BaseResultBodyItem extends Component {
    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {}
}
