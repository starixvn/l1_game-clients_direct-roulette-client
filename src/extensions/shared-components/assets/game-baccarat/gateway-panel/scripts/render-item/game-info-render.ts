import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import { EmitterEvents, Store } from "../models/definitions";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class GameInfoRender extends RenderItem {
    @property(Label)
    labelRTP: Label = null;

    @property(Label)
    labelTotalOnlineUsers: Label = null;

    @property(Label)
    labelLimitBet: Label = null;

    onLoad() {
        const data = this._gameData;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.RtpChange, this.onChangeRTP, this);
        store?.addListener(EmitterEvents.TotalOnlineChange, this.onChangeTotalOnlineUser, this);
        store?.addListener(EmitterEvents.BetLimitChange, this.onChangeBetLimit, this);

        store?.wakeUp();
    }

    clearRenderListeners() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeAll(this);
    }

    onChangeBetLimit = (data: { minBet: number; maxBet: number }) => {
        if (!data) {
            return;
        }
        if (this.labelLimitBet) {
            this.labelLimitBet.string = `${gc.FormatUtils.nFormatter(data.minBet, 2)} - ${gc.FormatUtils.nFormatter(data.maxBet, 2)}`;
        }
    };
    onChangeTotalOnlineUser = (data: number) => {
        if (!this.labelTotalOnlineUsers) {
            return;
        }
        this.labelTotalOnlineUsers.string = gc.FormatUtils.numberWithCommas(data);
    };
    onChangeRTP = (data: number) => {
        if (!this.labelRTP) {
            return;
        }
        this.labelRTP.string = `${gc.FormatUtils.numberWithCommas(data, 0, true)}%`;
    };
}
