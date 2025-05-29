import { Label, Sprite, _decorator } from "cc";
import MainPlayerProfile from "../../../../../game/main-player-profile/scripts/components/main-player-profile";

const { ccclass, property } = _decorator;

@ccclass
export default class MainPlayerProfileInstant extends MainPlayerProfile {
    @property({ override: true, visible: false })
    lblName: Label = null;

    @property({ override: true, visible: false })
    lblBalance: Label = null;

    @property({ override: true, visible: false })
    sprAvatar: Sprite = null;
}
