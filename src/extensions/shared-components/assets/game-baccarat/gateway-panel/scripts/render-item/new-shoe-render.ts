import { _decorator, sp } from "cc";
import { AnimationUtils } from "../../../../shared/utils/utils";
import { EmitterEvents, Store } from "../models/definitions";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class NewShoeRender extends RenderItem {
    onLoad() {
        this.node.active = false;

        const data = this._gameData;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.StartRound, this.onStartRound, this);
        store?.addListener(EmitterEvents.ActiveNewShoe, this.onActiveNewShoe, this);

        store?.wakeUp();
    }

    clearRenderListeners() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeAll(this);
    }

    onActiveNewShoe = async (show: boolean) => {
        this.node.active = show;
        if (!show) {
            return;
        }
        try {
            const spine = this.getComponentInChildren(sp.Skeleton);
            await AnimationUtils.playSpine(spine, "in", false);
            spine.setAnimation(0, "shuffling", true);
        } catch (e) {}
    };
    onStartRound = async () => {
        if (this.node.active) {
            try {
                const spine = this.getComponentInChildren(sp.Skeleton);
                await AnimationUtils.playSpine(spine, "out", false);
            } catch (e) {}
            this.node.active = false;
        }
    };
}
