import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import Observer from "observer";
import { IntroPFPopup } from "./intro-pf-popup";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class GuidePFContainer extends NodeContainer {
    @render(gc.GuidePF.GuidePFStore, (store) => store.url, { fireImmediately: false })
    protected openDialog(url: string) {
        if (url === "") {
            return;
        }
        const guide = this.createNode();
        guide.getComponent(IntroPFPopup)?.openGuidePF(url);
    }

    @render(gc.Dialogs.DialogsStore, (store) => store.forceClosed, { fireImmediately: false })
    popupVisibility(forceClosed: any) {
        forceClosed && this.node.destroyAllChildren();
    }
}
