import { _decorator, Enum, SpriteFrame } from "cc";
import { EDITOR } from "cc/env";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { LocalizedSprite } from "./LocalizedSprite";
import { getSpritePath, LocalizedPathType } from "./localized-utils";

const { ccclass, property } = _decorator;

@ccclass("AutoLoadLocalizedSprite")
export class AutoLoadLocalizedSprite extends LocalizedSprite {
    @property({
        visible: false,
        override: true,
    })
    spriteList = [];
    @property
    bundleName = "resources";

    @property
    path = "images/splash/i18n";

    @property
    frameName = "tagline_sc1";

    @property({ type: Enum(LocalizedPathType) })
    pathType = LocalizedPathType.Suffix;

    protected generateSpriteFrameName() {
        return getSpritePath(this.pathType, this.path, this.frameName, this.currentLanguage);
    }
    
    async updateSprite() {
          // Skip load image in editor
          if (EDITOR) {
            return;
        }
        
        try {
            const fileName = this.generateSpriteFrameName();
            const spriteFrame = await bundleManager.loadAssetsFromBundle<SpriteFrame>(this.bundleName, fileName, SpriteFrame, null);
            this.setSprite(spriteFrame);
        } catch (e) {}
    }
}
