import gc from "@sg/game-client-base";
import { _decorator, Node, Prefab } from "cc";
import SplashComponentBase from "db://shared-components/splash/scripts/components/splash-component-base";
import Observer from "observer";
import { AdjustPortraitResolution } from "../../shared/common-components/adjust-portrait-resolution";

const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { Auth, AppTypes } = gc;

@ccclass
@observer
export default class SplashDirect extends SplashComponentBase {
    @property({ type: Node, override: true, visible: false })
    signNameContainer: Node = null;

    @property({ type: Node, override: true, visible: false })
    containerCustomize: Node = null;

    @property({ type: Prefab, override: true, visible: false })
    prefabCustomize: Prefab = null;

    @render(Auth.AuthStore, (store) => store.system)
    adjustResolution(system: number) {
        if (system && system !== AppTypes.MobileDirect) {
            this.node.addComponent(AdjustPortraitResolution);
        }
    }

    override get sceneName() {
        if (this.system === AppTypes.MobileDirect) {
            return "direct-game";
        }

        return "portrait-game";
    }

    updateProgressBar(progress: number): void {
        this.percentResourceLoad && (this.percentResourceLoad.string = `${Math.round(progress * 100)}%`);
    }
}
