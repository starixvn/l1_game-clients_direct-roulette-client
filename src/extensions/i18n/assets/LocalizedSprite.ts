import * as i18n from "./LanguageData";

import { Component, Sprite, SpriteFrame, _decorator } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("LocalizedSpriteItem")
class LocalizedSpriteItem {
    @property
    language: string = "en";
    @property({
        type: SpriteFrame,
    })
    spriteFrame: SpriteFrame | null = null;
}

@ccclass("LocalizedSprite")
@executeInEditMode
export class LocalizedSprite extends Component {
    sprite: Sprite | null = null;

    @property({
        type: LocalizedSpriteItem,
    })
    spriteList = [];

    @property
    usingRawSize = true;

    onLoad() {
        if (!i18n.ready) {
            i18n.init("en");
        }
        this.fetchRender();
    }

    fetchRender() {
        let sprite = this.getComponent(Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite();
            return;
        }
    }

    get currentLanguage() {
        return i18n._language;
    }

    updateSprite() {
        for (let i = 0; i < this.spriteList.length; i++) {
            const item = this.spriteList[i];
            // @ts-ignore
            if (item.language === this.currentLanguage) {
                // @ts-ignore
                this.setSprite(spriteFrame);
                break;
            }
        }
    }

    setSprite(spriteFrame: SpriteFrame) {
        if (this.usingRawSize) {
            this.sprite.sizeMode = Sprite.SizeMode.RAW;
            this.sprite.trim = false;
        }
        this.sprite.spriteFrame = spriteFrame;
    }
}
