import gc from "@sg/game-client-base";
import { Label, Node, _decorator } from "cc";
import Observer from "observer";
import { Dialog } from "../../../shared/common-components/dialogs/dialog";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;
const { Shared, RoundBasePF } = gc;
const { utils } = Shared;
const { handle } = Observer;

@ccclass
export class ClientSeedManualPopup extends ObserverComponent {
    @property(Label)
    lblClientSeed: Label = null;

    @property(Node)
    nodeSaveDisabled: Node = null;

    clientSeedChar = 4;
    onLoad(): void {
        super.onLoad();
        this.handleGATracking();
    }

    handleGATracking() {
        utils.AnalyticsManager.trackEvent(gc.Shared.utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: gc.Shared.utils.TrackingAction.Click,
            object_name: utils.PFObjectName.PFClientSeed,
            game_name: FunctionUtils.getNamespace(),
        });
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    onClosePopup() {
        this.node.getComponent(Dialog)?.hide();
    }

    setClientSeedValue(value: string) {
        this.lblClientSeed.string = value;
    }

    getClientSeed() {
        return this.lblClientSeed.string;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    addValue(event, value) {
        const clientSeed = this.lblClientSeed.string;
        let newValue = `${clientSeed}`;
        if (clientSeed.length < this.clientSeedChar) {
            newValue = `${clientSeed}${value}`;
        }
        this.lblClientSeed.string = newValue;

        this.nodeSaveDisabled.active = this.disabledSaveBtn(newValue);
    }

    disabledSaveBtn(newCS: string) {
        return newCS === "";
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    clear() {
        this.lblClientSeed.string = "";
        this.nodeSaveDisabled.active = true;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    removeLastLetter() {
        let multiplierString = this.lblClientSeed.string.slice(0, -1);
        if (!multiplierString) {
            multiplierString = "";
            this.nodeSaveDisabled.active = true;
        }

        this.lblClientSeed.string = multiplierString;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    clickSaveBtn() {
        this.updateClientSeedValue(this.lblClientSeed.string);
        this.node.getComponent(Dialog).hide();
    }

    updateClientSeedValue(value: string) {
        this.sendClientSeed(value);
    }

    @handle(RoundBasePF.ProvablyFairHandler, (handle, value: string) => handle.saveManualClientSeed(value))
    sendClientSeed(value: string) {
        return value;
    }
}
