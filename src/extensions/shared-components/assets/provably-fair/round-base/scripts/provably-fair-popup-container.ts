import gc from "@sg/game-client-base";
import { Prefab, _decorator } from "cc";
import Observer from "observer";
import { MultipleNodeContainer } from "../../../shared/common-components/node-container/multiple-node-container";
import { ProvablyFairPopup } from "./provably-fair-popup";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { RoundBasePF } = gc;

enum Popup {
    ClientSeedSetting = "ClientSeedSetting",
    PFVerification = "PFVerification",
    PFVerificationDetail = "PFVerificationDetail",
}

@ccclass
export class ProvablyFairPopupContainer extends MultipleNodeContainer {
    @property(Prefab)
    customResultPrefab: Prefab = null;

    @render(RoundBasePF.ProvablyFairStore, (store) => store.openClientSeedPopup, { fireImmediately: false })
    private renderOpenClientSeedPopup(openClientSeedPopup: boolean) {
        if (openClientSeedPopup) {
            this.showNode(Popup.ClientSeedSetting);
        } else {
            this.onClose();
        }
    }

    @render(RoundBasePF.ProvablyFairStore, (store) => store.openVerification, { fireImmediately: false })
    private renderVerificationPopup(openVerification) {
        if (openVerification) {
            this.showNode(Popup.PFVerification);
            const node = this.getNode(Popup.PFVerification);
            node.getComponent(ProvablyFairPopup)?.initResultNode(this.customResultPrefab);
        } else {
            this.onClose();
        }
    }

    @render(gc.PFVerification.WebViewPFVerificationStore, (store) => store.openVerificationPopup, { fireImmediately: false })
    private renderVerificationPopupDetail(openVerificationPopup: boolean) {
        if (openVerificationPopup) {
            this.showNode(Popup.PFVerificationDetail);
        } else {
            this.onClose();
        }
    }
}
