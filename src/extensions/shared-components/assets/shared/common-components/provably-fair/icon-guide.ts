import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "db://shared-components/shared/utils";
const { ccclass } = _decorator;
const { handle } = Observer;
const { Shared } = gc;
const { utils } = Shared;

@ccclass
export class IconGuide extends ObserverComponent {
    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(gc.GuidePF.GuidePFHandlers, (handle) => handle.handle())
    clickOpenGuide() {
        utils.AnalyticsManager.trackEvent(utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: utils.TrackingAction.Click,
            object_name: utils.PFObjectName.PFUseGuide,
            game_name: FunctionUtils.getNamespace(),
        });
    }
}
