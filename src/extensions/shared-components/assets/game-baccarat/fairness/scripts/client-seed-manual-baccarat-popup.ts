import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import { ClientSeedManualPopup } from "../../../provably-fair/round-base/scripts/client-seed-manual-popup";
const { ccclass, property } = _decorator;
const { handle } = Observer;
const { GameBaccaratX } = gc;

@ccclass
export class ClientSeedManualBaccaratPopup extends ClientSeedManualPopup {
    @property(Label)
    lblMinCSNumber: Label = null;

    @property(Label)
    lblMaxCSNumber: Label = null;

    clientSeedChar = 3;

    minClientSeed = 0;
    maxClientSeed = 0;

    onLoad() {
        super.onLoad();
    }

    renderRangeCS() {
        this.lblMaxCSNumber.string = this.maxClientSeed.toString();
        this.lblMinCSNumber.string = this.minClientSeed.toString();
    }

    disabledSaveBtn(newCS: string) {
        if (+newCS >= this.minClientSeed && +newCS <= this.maxClientSeed) {
            return false;
        }
        return true;
    }

    updateClientSeedValue(value: string) {
        this.sendCSBaccarat(value);
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handle, value: string) => handle.saveClientSeed(value))
    sendCSBaccarat(value: string) {
        return value;
    }
}
