import { _decorator, Node } from "cc";
import { EmitterEvents, Store } from "../models/definitions";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class StatusGameRender extends RenderItem {
    @property({ type: Node })
    nodes: Node[] = [];

    private _isNewShoe = false;

    onLoad() {
        const data = this._gameData;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.PlacingBet, this.onPlacingBet, this);
        store?.addListener(EmitterEvents.LockingBet, this.onLockingBet, this);
        store?.addListener(EmitterEvents.Settling, this.onSettling, this);
        store?.addListener(EmitterEvents.ActiveNewShoe, this.onActiveNewShoe, this);

        const disableStore = data.getStore(Store.DisableGame);
        disableStore?.addListener(EmitterEvents.DisabledGame, this.onChangeDisabledGame, this);

        store?.wakeUp();
    }

    clearRenderListeners() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeAll(this);
        const disableStore = this._gameData?.getStore(Store.DisableGame);
        disableStore?.removeAll(this);
    }

    onChangeDisabledGame = (data: boolean) => {
        if (data) {
            this.nodes.forEach((node) => {
                node.active = false;
            });
            return;
        }
    };

    onActiveNewShoe = (show: boolean) => {
        this._isNewShoe = show;
        if (show) {
            this.nodes.forEach((node) => {
                node.active = false;
            });
        }
    };

    onPlacingBet = () => {
        this.updateVisibility(EmitterEvents.PlacingBet);
    };

    onLockingBet = () => {
        this.updateVisibility(EmitterEvents.LockingBet);
    };

    onSettling = () => {
        this.updateVisibility(EmitterEvents.Settling);
    };

    updateVisibility(name: string) {
        this.nodes.forEach((node) => {
            node.active = node.name === name && !this._isNewShoe;
        });
    }
}
