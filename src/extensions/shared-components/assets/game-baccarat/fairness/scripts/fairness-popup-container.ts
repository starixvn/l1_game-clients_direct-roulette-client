import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { MultipleNodeContainer } from "../../../shared/common-components/node-container/multiple-node-container";
import { CutCardIndexPopup } from "./cut-card-index-popup";
import { FairnessVerificationPopup } from "./fairness-verification-popup";
const { ccclass, property } = _decorator;
const { GameBaccaratX } = gc;
const { render, handle } = Observer;

enum Popup {
    ClientSeedSetting = "ClientSeedSetting",
    FairnessVerification = "FairnessVerification",
    CutCardIndex = "CutCardIndex",
}

@ccclass
export class FairnessPopupContainer extends MultipleNodeContainer {
    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.openCutCardIndex, { fireImmediately: false })
    renderCutCardIndexPopup(openCutCardIndex: any) {
        if (openCutCardIndex.isOpen) {
            this.showNode(Popup.CutCardIndex);
            const node = this.getNode(Popup.CutCardIndex);
            node.getComponent(CutCardIndexPopup).roundId = openCutCardIndex.roundId;
        } else {
            this.onClose();
        }
    }

    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.isShowFairnessSettingsPopup)
    renderClientSeedSettingPopup(isShowFairnessSettingsPopup: boolean) {
        if (isShowFairnessSettingsPopup) {
            this.showNode(Popup.ClientSeedSetting);
        } else {
            this.onClose();
        }
    }

    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.openVerification, { fireImmediately: false })
    renderOpenVerificationPopup(openVerification: any) {
        if (openVerification.isOpen) {
            this.showNode(Popup.FairnessVerification);
            const node = this.getNode(Popup.FairnessVerification);
            node.getComponent(FairnessVerificationPopup).roundId = openVerification.roundId;
        } else {
            this.onClose();
        }
    }

    @render(gc.Dialogs.DialogsStore, (store) => store.forceClosed, { fireImmediately: false })
    popupVisibility(forceClosed: any) {
        if (forceClosed) {
            this.forcedClose([Popup.CutCardIndex, Popup.FairnessVerification]);
            this.showDialog(false, false);
        }
    }

    forcedClose(names: string[]) {
        names.forEach((name) => {
            const index = this.nodeStacks.indexOf(name);
            if (index > -1) {
                this.nodeStacks.splice(index, 1);
            }
            this.clearNode(name);
        });
    }
}
