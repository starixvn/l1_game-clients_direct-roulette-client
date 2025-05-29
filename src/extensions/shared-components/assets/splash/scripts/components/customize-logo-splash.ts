import gc from "@sg/game-client-base";
import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import * as i18n from "db://i18n/LanguageData";
import Observer from "observer";
import { OperatorUtils } from "../../../shared/utils/operator-utils";
import { isValidNode } from "./../../../shared/utils/utils";
const { ccclass, property } = _decorator;

const { Configs } = gc;
const { observer, handle, render } = Observer;

@ccclass
export class CustomizeLogoSplash extends Component {
    @property(Sprite)
    sprLogo: Sprite = null;

    @property(Sprite)
    sprTagline: Sprite = null;

    @property
    versionImg = 1;

    protected readonly href = `${window.location.origin}${window.location.pathname}`;

    onLoad() {
        const { origin } = window.location;
        if (origin.includes("localhost")) {
            return;
        }
        this.renderLogo();
        this.renderTagLine();
    }

    renderLogo() {
        const operator = OperatorUtils.getOperatorAlias();
        if (operator === "OTHER") {
            return;
        }

        const logoName = `logo_${operator.toLowerCase()}`;
        const logoPath = `${this.href}images/${logoName}.webp?v=${this.versionImg}`;
        assetManager.loadRemote<ImageAsset>(logoPath, (err, imageAsset) => {
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprLogo.spriteFrame = spriteFrameTmp;
            this.sprLogo.sizeMode = Sprite.SizeMode.RAW;
        });
    }

    renderTagLine() {
        const taglinePath = this.createTagLinePath();
        assetManager.loadRemote<ImageAsset>(taglinePath, (err, imageAsset) => {
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprTagline.spriteFrame = spriteFrameTmp;
            this.sprTagline.sizeMode = Sprite.SizeMode.RAW;
        });
    }

    protected createTagLinePath() {
        const lang = i18n._language;
        const taglinePath = `${this.href}images/splash_text_${lang}.webp?v=${this.versionImg}`;
        return taglinePath;
    }
}
