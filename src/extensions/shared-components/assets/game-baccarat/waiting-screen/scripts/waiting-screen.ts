import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { getTimePointCutCards } from "./../../time-point";
const { ccclass, property } = _decorator;
const { render, handle, observer } = Observer;
const { Rounds, GameBaccaratX } = gc;

@ccclass
export class WaitingScreen extends ObserverComponent {
    @property(Node)
    nodeDisabled: Node = null;

    @property(Label)
    lblCountDown: Label = null;

    private timePointCutCards = 0;

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.durations)
    storeSettingDurations(durations: gc.GameConfigs.DurationSetting) {
        this.timePointCutCards = getTimePointCutCards(durations);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handler, isShow: boolean) => handler.handleShowFairnessSettingsPopup(isShow))
    onClickCutCardBtn() {
        return true;
    }

    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.cutCardInfo)
    showCutCardButtonSection(cutCardInfo: any) {
        this.nodeDisabled.active = cutCardInfo && cutCardInfo.successful;
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    renderCountDownTime(roundTime: number) {
        this.lblCountDown && (this.lblCountDown.string = (roundTime - this.timePointCutCards).toString());
    }
}
