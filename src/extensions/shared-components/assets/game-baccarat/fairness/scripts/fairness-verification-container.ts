import gc from "@sg/game-client-base";
import { Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FairnessVerificationPopup } from "./fairness-verification-popup";
const { ccclass, property } = _decorator;
const { GameBaccaratX } = gc;
const { render, handle, observer } = Observer;

@ccclass
export class FairnessVerificationContainer extends ObserverComponent {
    @property(Prefab)
    prfPFPopup: Prefab = null;
    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.openVerification)
    renderPopup(openVerification: any) {
        if (openVerification && openVerification.isOpen) {
            const popup = instantiate(this.prfPFPopup);
            popup.getComponent(FairnessVerificationPopup).roundId = openVerification.roundId;
            this.node.addChild(popup);
        } else {
            this.node.destroyAllChildren();
        }
    }
}
