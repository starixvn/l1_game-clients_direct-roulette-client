import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { CrossControlItem } from "db://shared-components/shared/common-components/cross-control/cross-control-item";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils/utils";
import observer from "observer";
const { ccclass, property } = _decorator;
const { fadeIn } = AnimationUtils;
const { handle } = observer;

@ccclass
export class IconInfoPopup extends ObserverComponent {
    @property(Node)
    nodeTooltip: Node = null;

    @property(Label)
    lblContent: Label = null;

    @property
    keyText = "";

    @property
    nameSpace = "Common";

    onLoad() {
        super.onLoad();
        const crossControlItem = this.getComponentInChildren(CrossControlItem);
        if (crossControlItem) {
            crossControlItem.registerListenerOtherControls(() => this.hideTooltipComp());
        }
    }

    hideTooltipComp() {
        this.nodeTooltip.active = false;
    }

    showTooltipComp() {
        this.nodeTooltip.active = true;
    }

    setDisplayTooltip(show: boolean) {
        this.nodeTooltip.active = show;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    clickInfoIcon() {
        this.nodeTooltip.active = !this.nodeTooltip.active;
        this.setContentTooltip();
    }

    setContentTooltip() {
        this.lblContent.string = gc.Translator.translate(`${this?.nameSpace}.${this?.keyText}`);
        fadeIn(this.lblContent.node, 0.3);
    }
}
