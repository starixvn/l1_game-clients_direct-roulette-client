import { _decorator, assetManager, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import * as i18n from "db://i18n/LanguageData";
import { isValidNode, OperatorAlias, OperatorUtils } from "db://shared-components/shared/utils";
import { CustomizeLogoSplash } from "db://shared-components/splash/scripts/components/customize-logo-splash";
const { ccclass, property } = _decorator;

const POWEREDBY = {
    [OperatorAlias.SG]: "bong88",
    [OperatorAlias.TIP88]: "vg",
};
@ccclass
export class CustomizeLogoSplashDirect extends CustomizeLogoSplash {
    @property(Sprite)
    sprPoweredBy: Sprite = null;

    onLoad(): void {
        super.onLoad();
        this.renderPoweredBy();
    }

    renderPoweredBy() {
        const operator = OperatorUtils.getOperatorAlias();
        const system = POWEREDBY[operator];
        if (system) {
            const poweredByPath = this.createPoweredByPath(system);
            assetManager.loadRemote<ImageAsset>(poweredByPath, (err, imageAsset) => {
                if (!isValidNode(this)) {
                    return;
                }
                const spriteFrameTmp = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrameTmp.texture = texture;
                this.sprPoweredBy.spriteFrame = spriteFrameTmp;
                this.sprTagline.sizeMode = Sprite.SizeMode.RAW;
            });
        }
    }

    createPoweredByPath(system: string) {
        if (system === POWEREDBY[OperatorAlias.SG]) {
            return `${this.href}images/powered_by_${system}.webp?v=${this.versionImg}`;
        }
        const lang = i18n._language;
        return `${this.href}images/powered_by_${system}_${lang}.webp?v=${this.versionImg}`;
    }
}
