import { CCString, SpriteAtlas, SpriteFrame, _decorator, error } from "cc";
import { EDITOR } from "cc/env";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import * as i18n from "./LanguageData";
import { LocalizedSprite } from "./LocalizedSprite";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("LocalizedOnePackSprite")
@executeInEditMode
export class LocalizedOnePackSprite extends LocalizedSprite {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(CCString)
    prefix = "";

    @property(CCString)
    defaultLocalized = "en";

    @property({
        type: SpriteFrame,
        override: true,
        visible: false,
    })
    spriteList = [];

    getSpriteFrameByLang(lang: string) {
        const spriteName = `${this.prefix}_${lang}`;
        return this.atlas?.getSpriteFrame(spriteName) || null;
    }

    getDefaultSprite() {
        const spriteName = this.defaultLocalized ? `${this.prefix}_en` : this.prefix;
        return this.atlas.getSpriteFrame(spriteName);
    }

    async updateSprite() {
        if (!this.atlas && EDITOR) {
            return;
        }
        if (!this.sprite) {
            if (this.node.activeInHierarchy) {
                error("Failed to update localized sprite, sprite component is invalid!");
            }
            return;
        }

        if (!this.atlas) {
            //try download atlas
            this.atlas = await bundleManager.loadAssetsFromBundle<SpriteAtlas>(
                "resources",
                `i18n-images/atlas_${this.currentLanguage}`,
                SpriteAtlas,
                null
            );
        }
        if (!this.atlas) {
            error("Failed to update localized sprite, atlas is invalid!");
            return;
        }

        let spriteFrame = this.getSpriteFrameByLang(i18n._language);
        if (!spriteFrame) {
            spriteFrame = this.getDefaultSprite();
        }

        this.setSprite(spriteFrame);
    }
}
