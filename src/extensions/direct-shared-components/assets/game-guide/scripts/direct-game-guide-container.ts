import { _decorator } from "cc";
import { GameGuideContainer } from "db://shared-components/game/game-guide/scripts/game-guide-container";
import WebViewGuide from "db://shared-components/game/game-guide/scripts/web-view-guide";

const { ccclass } = _decorator;

@ccclass("DirectGameGuideContainer")
export class DirectGameGuideContainer extends GameGuideContainer {
    protected openDialog(scrollToId: string) {
        const guide = this.createNode();
        guide.getComponent(WebViewGuide)?.initUrl("&o=portrait", scrollToId);
    }
}
