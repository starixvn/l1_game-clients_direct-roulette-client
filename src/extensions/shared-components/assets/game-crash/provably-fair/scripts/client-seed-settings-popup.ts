import gc from "@sg/game-client-base";
import { Label, Node, Prefab, Toggle, UIOpacity, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";
import { ClientSeedManualPopup } from "./client-seed-manual-popup";
const { ccclass, property } = _decorator;
const { GameCrash, Shared } = gc;
const { utils } = Shared;
const { render, handle } = Observer;

@ccclass
export class ClientSeedSettingsPopup extends ObserverComponent {
    @property(Label)
    lblRandomClientSeed: Label = null;

    @property(Label)
    lblManualClientSeed: Label = null;

    @property(Toggle)
    tglRandomClientSeed: Toggle = null;

    @property(Toggle)
    tglManualClientSeed: Toggle = null;

    @property(Prefab)
    prfClientSeedManual: Prefab = null;

    @property(Node)
    nodeManualPopup: Node = null;

    @property(Node)
    nodeOverlayChangeBtn: Node = null;

    @property(Node)
    nodeRandomLabelDisabledBg: Node = null;

    @property(Node)
    nodeManualLabelDisabledBg: Node = null;

    @property(Node)
    nodeWarningText: Node = null;

    private readonly OPACITY_DISABLED = 153;
    private readonly OPACITY_ENABLED = 255;
    private manualClientSeed = "";

    onLoad(): void {
        super.onLoad();
        this.handleGATracking();
    }

    handleGATracking() {
        utils.AnalyticsManager.trackEvent(gc.Shared.utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: gc.Shared.utils.TrackingAction.Show,
            object_name: utils.PFObjectName.PFClientSeed,
            game_name: FunctionUtils.getNamespace(),
        });

        utils.AnalyticsManager.trackEvent(gc.Shared.utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: gc.Shared.utils.TrackingAction.Show,
            object_name: utils.PFObjectName.PFUseGuide,
            game_name: FunctionUtils.getNamespace(),
        });
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openCS: boolean) => handle.handleClientSeedPopup(openCS))
    closeSettingsPopup() {
        return false;
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.randomClientSeed)
    displayClientSeed(randomClientSeed: string) {
        this.lblRandomClientSeed.string = randomClientSeed;
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.randomClientSeedEnabled)
    updateRandomMode(randomClientSeedEnabled: boolean) {
        if (!randomClientSeedEnabled) {
            this.tglManualClientSeed.isChecked = true;
        } else {
            this.tglRandomClientSeed.isChecked = true;
            this.updateValueManualMode("");
        }
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.showManualClientSeedPopup)
    setDisplayManualClientSeedPopup(showManualClientSeedPopup: boolean) {
        if (showManualClientSeedPopup) {
            this.openManualSettingPopup();
        }
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.manualClientSeed)
    updateManualClientSeed(manualClientSeed: string) {
        this.manualClientSeed = manualClientSeed;
        if (manualClientSeed === "") {
            this.lblManualClientSeed.string = "";
        } else {
            this.lblManualClientSeed.string = manualClientSeed;
        }
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, isRandom: boolean) => handle.clientSeedGenerationMode(isRandom))
    clickManualMode() {
        return false;
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, isRandom: boolean) => handle.clientSeedGenerationMode(isRandom))
    clickRandomMode() {
        return true;
    }

    openManualSettingPopup() {
        const node = instantiate(this.prfClientSeedManual);
        const comp = node.getComponent(ClientSeedManualPopup);
        const randomCS = this.lblRandomClientSeed.string;
        if (this.manualClientSeed === "") {
            comp.setClientSeedValue(randomCS);
            this.lblManualClientSeed.string = randomCS;
            this.updateValueManualMode(randomCS);
        } else {
            comp.setClientSeedValue(this.manualClientSeed);
        }

        this.nodeManualPopup.addChild(node);
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    clickChangeBtn() {
        this.openManualSettingPopup();
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.buttonState, { fireImmediately: false })
    closePopup(buttonState: string) {
        if (buttonState === GameCrash.ButtonState.BET_ACCEPTED) {
            this.closeSettingsPopup();
        }
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.notAllowChangeClientSeed)
    setDisplayComponents(notAllowChangeClientSeed: boolean) {
        if (notAllowChangeClientSeed) {
            this.nodeRandomLabelDisabledBg.active = true;
            this.nodeManualLabelDisabledBg.active = true;
            this.tglManualClientSeed.node.getComponent(UIOpacity).opacity = this.OPACITY_DISABLED;
            this.tglRandomClientSeed.node.getComponent(UIOpacity).opacity = this.OPACITY_DISABLED;
            this.tglManualClientSeed.interactable = false;
            this.tglRandomClientSeed.interactable = false;
            this.nodeWarningText.active = true;
        } else {
            this.nodeRandomLabelDisabledBg.active = false;
            this.nodeManualLabelDisabledBg.active = false;
            this.tglManualClientSeed.node.getComponent(UIOpacity).opacity = this.OPACITY_ENABLED;
            this.tglRandomClientSeed.node.getComponent(UIOpacity).opacity = this.OPACITY_ENABLED;
            this.tglManualClientSeed.interactable = true;
            this.tglRandomClientSeed.interactable = true;
            this.nodeWarningText.active = false;
        }
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.highlightManualMode)
    setDisplayContentManualMode(allowChangeManualClientSeed: boolean) {
        this.nodeOverlayChangeBtn.active = !allowChangeManualClientSeed;
        this.tglManualClientSeed.node.getComponent(UIOpacity).opacity = allowChangeManualClientSeed
            ? this.OPACITY_ENABLED
            : this.OPACITY_DISABLED;
        this.nodeManualLabelDisabledBg.active = !allowChangeManualClientSeed;
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, manualCS: string) => handle.saveManualClientSeed(manualCS))
    updateValueManualMode(value: string) {
        return value;
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.highlightRandomMode)
    setDisplayContentRandomMode(selectedRandomMode: boolean) {
        this.tglRandomClientSeed.node.getComponent(UIOpacity).opacity = selectedRandomMode ? this.OPACITY_ENABLED : this.OPACITY_DISABLED;
        this.nodeRandomLabelDisabledBg.active = !selectedRandomMode;
        this.lblRandomClientSeed.node.getComponent(UIOpacity).opacity = selectedRandomMode ? this.OPACITY_ENABLED : this.OPACITY_DISABLED;
    }
}
