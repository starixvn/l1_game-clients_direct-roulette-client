import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";

import { EmitterEvents, Store } from "../models/definitions";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class ConnectionErrorRender extends RenderItem {
    onLoad() {
        this.node.active = false;

        const data = this._gameData;
        const store = data.getStore(Store.DisableGame);
        store?.addListener(EmitterEvents.ConnectionFailed, this.onChangeConnectionFailed, this);

        store?.wakeUp();
    }

    clearRenderListeners() {
        const store = this._gameData?.getStore(Store.DisableGame);
        store?.removeAll(this);
    }

    onChangeConnectionFailed = (isFailed: boolean) => {
        this.node.active = isFailed;

        const label = this.getComponentInChildren(Label);
        if (label) {
            const errorCode = "SB0010";
            const key = gc.ErrorUtils.parseErrorCode(errorCode);
            label.string = gc.Translator.translate(key, { errorCode });
        }
    };
}
