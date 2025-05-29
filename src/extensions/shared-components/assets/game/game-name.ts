import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class GameName extends ObserverComponent {
    @property
    upperCaseName = false;

    private label: Label = null;

    onLoad() {
        this.label = this.getComponent(Label);
        super.onLoad();
    }

    @render(gc.GameConfigs.GameSetting, (store) => store.name)
    renderGameName(name: string) {
        if (!this.label) {
            return;
        }
        const gameName = gc.Translator.translate(`${name}.game_name`);
        this.label.string = this.upperCaseName ? gameName.toUpperCase() : gameName;
    }
}
