import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import { isValidNode } from "../../../shared/utils/utils";
import gc from "@sg/game-client-base";
const { ccclass, property } = _decorator;
const { Translator } = gc;
@ccclass
export class CustomizeBackground extends Component {
    @property(Sprite)
    sprBackground: Sprite = null;

    @property
    versionImg = 1;

    @property
    isLocaleImage = false;

    onLoad() {
        const absolutePath = this.getAbsolutePath(this.isLocaleImage, this.versionImg);
        assetManager.loadRemote<ImageAsset>(absolutePath, (err, imageAsset) => {
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprBackground.spriteFrame = spriteFrameTmp;
            this.sprBackground.sizeMode = Sprite.SizeMode.RAW;
        });
    }

    getAbsolutePath(isLocaleImage: boolean, versionImg: number): string {
        const { origin, pathname } = window.location;
        const languageId = isLocaleImage ? `_${Translator.getCurrentLanguageId()}` : "";
        return `${origin}${pathname}splash-resources/game_background${languageId}.webp?v=${versionImg}`;
    }
}
