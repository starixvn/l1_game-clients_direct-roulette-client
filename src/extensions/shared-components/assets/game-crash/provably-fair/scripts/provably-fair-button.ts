import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;
const { handle } = Observer;
const { GameCrash, Shared } = gc;
const { utils } = Shared;

@ccclass
export class ProvablyFairButton extends ObserverComponent {
    onLoad(): void {
        super.onLoad();
        this.handleGATracking();
    }

    handleGATracking() {
        utils.AnalyticsManager.trackEvent(gc.Shared.utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: gc.Shared.utils.TrackingAction.Show,
            object_name: utils.PFObjectName.PFIcon,
            game_name: FunctionUtils.getNamespace(),
        });
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openPopup: boolean) => handle.handleClientSeedPopup(openPopup))
    onClickPFButton() {
        utils.AnalyticsManager.trackEvent(utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: utils.TrackingAction.Click,
            object_name: utils.PFObjectName.PFIcon,
            game_name: FunctionUtils.getNamespace(),
        });

        return true;
    }
}
