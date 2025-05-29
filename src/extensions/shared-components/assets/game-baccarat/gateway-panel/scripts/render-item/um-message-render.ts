import { _decorator, Label } from "cc";
import { EmitterEvents, Store } from "../models/definitions";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class UmMessageRender extends RenderItem {
    onLoad() {
        this.node.active = false;

        const data = this._gameData;
        const store = data.getStore(Store.DisableGame);
        store?.addListener(EmitterEvents.UmMessage, this.onChangeUmMessage, this);
        store?.addListener(EmitterEvents.DisabledGame, this.onChangeDisabledGame, this);

        store?.wakeUp();
    }

    clearRenderListeners() {
        const store = this._gameData?.getStore(Store.DisableGame);
        store?.removeAll(this);
    }

    onChangeDisabledGame = (data: boolean) => {
        this.node.active = data;
    };

    onChangeUmMessage = (message: string) => {
        const label = this.getComponentInChildren(Label);
        if (label) {
            label.string = message;
        }
    };
}
