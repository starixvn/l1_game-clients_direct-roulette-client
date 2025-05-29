import gc from "@sg/game-client-base";
import { _decorator, Component, ImageAsset, JsonAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import { FunctionUtils } from "../../../shared/utils";
import { isValidNode } from "../../../shared/utils/utils";
const { ccclass, property } = _decorator;
const { Translator } = gc;
@ccclass
export class HtmlSiteSprite extends Component {
    @property
    folder = "splash-resources";

    @property
    key = "game_background";

    @property
    extension = "webp";

    @property
    localization = false;

    @property
    originalSize = true;

    sprite: Sprite = null;

    async onLoad() {
        const { origin } = window.location;
        if (origin.includes("localhost")) {
            return;
        }

        this.sprite = this.getComponent(Sprite);

        const info = await this.getVersionInfo();
        try {
            const fileName = this.getFileName();
            let versionId = 1;
            if (info && info[fileName]) {
                versionId = info[fileName];
            }
            const url = this.getUrl(fileName, versionId);
            const imageAsset = (await FunctionUtils.loadRemote(url)) as ImageAsset;
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprite.spriteFrame = spriteFrameTmp;
            if (this.originalSize) {
                this.sprite.sizeMode = Sprite.SizeMode.RAW;
            }
        } catch (e) {}
    }

    async getVersionInfo() {
        const { origin, pathname } = window.location;
        const fileName = `${origin}${pathname}${this.folder}/versions.json`;
        if (FunctionUtils.cachedRemoteFile[fileName]) {
            return FunctionUtils.cachedRemoteFile[fileName];
        }
        const url = `${origin}${pathname}${this.folder}/versions.json?v=${Date.now()}`;

        try {
            const jsonAsset = (await FunctionUtils.loadRemote(url)) as JsonAsset;
            if (!isValidNode(this)) {
                return null;
            }
            if (jsonAsset) {
                FunctionUtils.cachedRemoteFile[fileName] = jsonAsset.json;
                return jsonAsset.json;
            }
        } catch (e) {
            return null;
        }
    }

    getFileName() {
        const languageId = this.localization ? `_${Translator.getCurrentLanguageId()}` : "";
        return `${this.key}${languageId}`;
    }

    getUrl(fileName: string, versionId: number): string {
        const { origin, pathname } = window.location;
        return `${origin}${pathname}${this.folder}/${fileName}.${this.extension}?v=${versionId}`;
    }
}
