import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";
import { ReBetButton } from "./rebet-button";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Bet, Rounds, Shared } = gc;
const { utils } = Shared;

@ccclass("ReBet")
export class ReBet extends ObserverComponent {
    @property(ReBetButton)
    reBetButton: ReBetButton = null;

    onLoad(): void {
        super.onLoad();
        this.loadRuleReBetStorage();
        utils.AnalyticsManager.trackEvent(utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: utils.TrackingAction.Show,
            object_name: utils.PFObjectName.ReBetButton,
            game_name: FunctionUtils.getNamespace(),
        });
    }

    @handle(gc.Bet.ReBetHandlers.LoadRuleReBetStorage)
    loadRuleReBetStorage() {}

    @render(Bet.ReBetStore, (store) => store.isShowBtnReBet)
    checkReBetStatus(isShowBtnReBet: boolean) {
        this.reBetButton.changeInteractable(isShowBtnReBet);
    }

    @handle(gc.Bet.ReBetHandlers.ReBetHandler)
    onReBet() {
        this.playSoundClick();
        utils.AnalyticsManager.trackEvent(utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: utils.TrackingAction.Click,
            object_name: utils.PFObjectName.ReBetButton,
            game_name: FunctionUtils.getNamespace(),
        });
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

}
