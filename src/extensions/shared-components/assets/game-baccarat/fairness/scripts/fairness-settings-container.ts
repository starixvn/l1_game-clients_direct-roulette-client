import { Prefab, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle, observer } = Observer;

@ccclass
export class FairnessSettingsContainer extends ObserverComponent {
    @property(Prefab)
    prfCutCardSetting: Prefab = null;
}
