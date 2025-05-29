import { _decorator } from "cc";
import { IntroPFPopup } from "db://shared-components/shared/common-components/provably-fair/intro-pf-popup";
const { ccclass } = _decorator;

@ccclass
export class IntroPFPopupDirect extends IntroPFPopup {
    openGuidePF(url: string) {
        url && (url += "&o=portrait");
        this.loadContent(url);
    }
}
