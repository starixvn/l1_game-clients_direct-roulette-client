import { _decorator, CCString, SpriteFrame } from "cc";

const { ccclass, property } = _decorator;

@ccclass("LedLightItemModel")
export class LedLightItemModel {
    @property(CCString)
    choiceNames = "";

    @property(SpriteFrame)
    backgroundForChoice: SpriteFrame = null;
}
