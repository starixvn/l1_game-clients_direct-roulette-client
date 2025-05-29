import { CCString, MaskComponent, SpriteAtlas, _decorator } from "cc";
import gc from "@sg/game-client-base";
const {Translator} = gc;


const { ccclass, property } = _decorator;

@ccclass("LocalizedSpriteMask")
export class LocalizedSpriteMask extends MaskComponent {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(CCString)
    prefix = "";

    onLoad() {
        super.onLoad();
        this._sprite && (this._sprite.spriteFrame = this.getSpriteFrameByLang(Translator.getCurrentLanguageId()));
    }

    getSpriteFrameByLang(lang: string) {
        const suffix = lang !== "vi" ? `_${lang}` : "";
        const spriteName = `${this.prefix}${suffix}`;
        return this.atlas.getSpriteFrame(spriteName);
    }
}
