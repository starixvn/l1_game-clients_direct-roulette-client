import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { GuidePFContainer } from "db://shared-components/shared/common-components/provably-fair/guide-pf-container";
import { IntroPFPopup } from "db://shared-components/shared/common-components/provably-fair/intro-pf-popup";
import Observer from "observer";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class GuidePFContainerDirect extends GuidePFContainer {
    protected openDialog(url: string) {
        if (url === "") {
            return;
        }
        const guide = this.createNode();
        url += "&o=portrait";
        guide.getComponent(IntroPFPopup)?.openGuidePF(url);
    }
}
