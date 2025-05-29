import { Label, Node, _decorator } from "cc";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

import gc from "@sg/game-client-base";
import Observer from "observer";
import { LabelCopyComponent } from "../../../shared/common-components/copy-label/scripts/label-copy-component";
import { ClientSeedInfo } from "../../../shared/common-components/provably-fair/client-seed-info";
import { FunctionUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { Shared, FormatUtils } = gc;
const { utils } = Shared;

@ccclass()
export class ProvablyFairPopup extends ObserverComponent {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblResult: Label = null;

    @property(LabelCopyComponent)
    lblServerSeed: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblServerSeedHash: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblMergeClientSeed: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblFinalHash: LabelCopyComponent = null;

    @property(Label)
    lblParaVerification: Label = null;

    @property({ type: ClientSeedInfo })
    listClientSeedInfo: ClientSeedInfo[] = [];

    @property(Node)
    nodeDisabledVerification: Node = null;

    onLoad() {
        super.onLoad();
        const para = `${gc.Translator.commonTranslate("pf_provably_fair_para_2")}`;
        this.lblParaVerification.string = para;
        this.handleGATracking();
    }

    handleGATracking() {
        utils.AnalyticsManager.trackEvent(gc.Shared.utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: gc.Shared.utils.TrackingAction.Show,
            object_name: utils.PFObjectName.ViewPFGuide,
            game_name: FunctionUtils.getNamespace(),
        });
    }

    @render(gc.GameCrash.ProvablyFair.PFVerificationStore, (store) => store.verification)
    private renderVerification(verification: gc.GameServiceMessage.ProvablyFair) {
        if (!verification) {
            return;
        }

        const { serverSeed, serverSeedHash, mergeClientSeed, finalHash, clientSeeds, result, roundId } = verification;
        this.lblRoundId.string = roundId.toString();
        result && (this.lblResult.string = `${FormatUtils.numberWithCommas(result, 2, false)}x`);

        serverSeed && this.lblServerSeed.setString(serverSeed);
        this.lblServerSeed.setActive(!!serverSeed);

        serverSeedHash && this.lblServerSeedHash.setString(serverSeedHash);
        this.lblServerSeedHash.setActive(!!serverSeedHash);

        mergeClientSeed && this.lblMergeClientSeed.setString(mergeClientSeed);
        this.lblMergeClientSeed.setActive(!!mergeClientSeed);

        finalHash && this.lblFinalHash.setString(finalHash);
        this.lblFinalHash.setActive(!!finalHash);
        this.listClientSeedInfo.forEach((clientSeedInfo) => {
            clientSeedInfo.activeDisabledBg(true);
        });
        if (clientSeeds && clientSeeds.length > 0) {
            clientSeeds.forEach((clientSeed, index) => {
                const info = this.listClientSeedInfo[index];
                info.setDisplay(clientSeed);
                info.activeDisabledBg(false);
            });
        }
        this.nodeDisabledVerification.active = !result;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle) => handle.closeVerification())
    onClickClose() {}

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    clickVerify() {
        this.openVerificationPopup();
    }

    @handle(gc.PFVerification.WebViewPFVerificationHandlers.VerificationPopupHandler)
    openVerificationPopup() {
        return true;
    }
}
