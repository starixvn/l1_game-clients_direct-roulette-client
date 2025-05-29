import gc from "@sg/game-client-base";
import { Color, Label, Node, Prefab, Toggle, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { getTimePointCutCards } from "../../time-point";
import { ClientSeedManualBaccaratPopup } from "./client-seed-manual-baccarat-popup";
const { ccclass, property } = _decorator;
const { GameBaccaratX, Rounds, Translator } = gc;
const { render, handle, observer } = Observer;

@ccclass
export class FairnessSettingsBaccaratPopup extends ObserverComponent {
    @property(Label)
    lblClientSeed: Label = null;

    @property(Label)
    lblSHA256: Label = null;

    @property(Prefab)
    prfManualSettings: Prefab = null;

    @property(Node)
    nodeManualSettings: Node = null;

    @property(Label)
    lblCountDown: Label = null;

    @property(Label)
    lblMessageSubmit: Label = null;

    @property(Node)
    nodeDisabledSubmit: Node = null;

    @property(Label)
    lblRangeClientSeed: Label = null;

    @property(Toggle)
    tglDontShowAgain: Toggle = null;

    @property
    minCSNumber = 300;

    @property
    maxCSNumber = 350;

    private dontShowAgain = false;

    private timePointCutCards = 0;

    onLoad() {
        super.onLoad();
        this.updateMaxCS();
        this.updateMinCS();
        this.lblRangeClientSeed.string = `(${this.minCSNumber} - ${this.maxCSNumber})`;
        this.generateRandomCS();
        this.lblClientSeed.node?.on(Node.EventType.TOUCH_START, this.showPopupManual, this);
    }

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.durations)
    storeSettingDurations(durations: gc.GameConfigs.DurationSetting) {
        this.timePointCutCards = getTimePointCutCards(durations);
    }

    start() {
        this.tglDontShowAgain.isChecked = this.dontShowAgain;
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handle, isShow: boolean) => handle.updateDontShowAgain(isShow))
    openFairnessSetting() {
        return true;
    }

    showPopupManual() {
        this.playSoundClick();
        const manual = instantiate(this.prfManualSettings);
        const comp = manual.getComponent(ClientSeedManualBaccaratPopup);
        comp.minClientSeed = this.minCSNumber;
        comp.maxClientSeed = this.maxCSNumber;
        comp.renderRangeCS();
        this.nodeManualSettings.addChild(manual);
        comp.setClientSeedValue(this.lblClientSeed.string);
    }

    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.cutCardInfo)
    updateMessageSubmit(cutCardInfo: any) {
        const color: Color = new Color(0, 0, 0, 255);
        if (!cutCardInfo) {
            this.lblMessageSubmit.string = "";
            return;
        }

        if (cutCardInfo.successful) {
            this.lblMessageSubmit.string = Translator.gameTranslate("submission_sucessful");
            this.nodeDisabledSubmit.active = true;
            this.lblMessageSubmit.color = Color.fromHEX(color, "#06681D");
        } else {
            this.lblMessageSubmit.string = Translator.gameTranslate("submission_fail");
            this.nodeDisabledSubmit.active = false;
            this.lblMessageSubmit.color = Color.fromHEX(color, "#B82222");
        }
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handler, clientSeed: string) => handler.sendClientSeed(clientSeed))
    onClickSubmit() {
        this.playSoundClick();
        return this.lblClientSeed.string;
    }

    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.clientSeed)
    renderClientSeed(clientSeed: string) {
        this.lblClientSeed.string = clientSeed;
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeHash)
    renderSHA256(shoeHash: string) {
        this.lblSHA256.string = shoeHash;
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handle, isShow: boolean) => handle.updateDontShowAgain(isShow))
    onClickDontShowAgain() {
        this.playSoundClick();
        return !this.tglDontShowAgain.isChecked;
    }

    @render(GameBaccaratX.CutCardPF.FairnessStore, (store) => store.dontShowAgain)
    checkDontShowAgain(dontShowAgain: boolean) {
        this.dontShowAgain = dontShowAgain;
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    renderCountDownTime(roundTime: number) {
        this.lblCountDown && (this.lblCountDown.string = (roundTime - this.timePointCutCards).toString());
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handler, min: number) => handler.setMinClientSeed(min))
    updateMinCS() {
        return this.minCSNumber;
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handler, max: number) => handler.setMaxClientSeed(max))
    updateMaxCS() {
        return this.maxCSNumber;
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handler) => handler.generateClientSeed())
    generateRandomCS() {}

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handler, isShow: boolean) => handler.handleShowFairnessSettingsPopup(isShow))
    closePopup() {
        this.playSoundClick();
        return false;
    }

    onClickPrevious() {
        this.playSoundClick();
        let clientSeedTpm = +this.lblClientSeed.string - 1;
        if (clientSeedTpm < this.minCSNumber) {
            clientSeedTpm = this.maxCSNumber;
        }
        this.lblClientSeed.string = clientSeedTpm.toString();
    }

    onClickNext() {
        this.playSoundClick();
        let clientSeedTpm = +this.lblClientSeed.string + 1;
        if (clientSeedTpm > this.maxCSNumber) {
            clientSeedTpm = this.minCSNumber;
        }
        this.lblClientSeed.string = clientSeedTpm.toString();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
