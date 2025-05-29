import gc from "@sg/game-client-base";
import { _decorator } from "cc";

import Observer from "observer";
import { LabelCopyComponent } from "db://shared-components/shared/common-components/copy-label/scripts/label-copy-component";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass
export class ServerSeedHash extends ObserverComponent {
    @property(LabelCopyComponent)
    sshValue: LabelCopyComponent = null;

    @render(gc.RoundPF.RoundPFStore, (store) => store.currentPF)
    private renderSSH(currentPF: gc.GameServiceMessage.RoundPFResult) {
        const serverSeedHash = currentPF ? currentPF.serverSeedHash : "";
        this.sshValue?.setString(serverSeedHash);
    }
}
