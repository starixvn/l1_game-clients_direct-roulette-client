import gc from "@sg/game-client-base";
import { CCBoolean, Component, Font, Label, _decorator } from "cc";
import { bundleManager } from "../bundle-manager/bundle-manager";
const { Translator } = gc;

const { ccclass, property } = _decorator;

class LanguageFont {
    language = "";
    name: "";
}

export type FontMapping = {
    [key in "vi" | "id" | "en" | "th" | "zh_cn" | "zh_tw"]: string;
};

@ccclass("LocalizedFont")
export class LocalizedFont extends Component {
    @property({ type: LanguageFont })
    overrideFonts: LanguageFont[] = [];

    @property(CCBoolean)
    enableCacheMode = false;

    label: Label = null;
    fontBases = {};

    onLoad() {
        this.initData();
        this.label = this.node.getComponent(Label);
        this.updateFont();
    }

    initData() {
        const notoRegular = "noto-serif-regular";
        this.fontBases = {
            vi: notoRegular,
            id: notoRegular,
            en: notoRegular,
            th: "noto-serif-regular-thai",
            zh_cn: "noto-serif-regular-zhcn",
            zh_tw: "noto-serif-regular-zhtw",
        } as FontMapping;
    }

    updateFont() {
        const name = this.getFontNameByLanguage();
        if (this.label) {
            this.loadFont(name)
                .then((font) => {
                    if (this.label?.isValid) {
                        this.label.font = font;
                        this.enableCacheMode && this.handleCacheMode();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    handleCacheMode() {
        const lang = Translator.getCurrentLanguageId();
        switch (lang) {
            case "th":
            case "zh_cn":
            case "zh_tw":
                this.label.cacheMode = Label.CacheMode.BITMAP;
                break;

            default:
                this.label.cacheMode = Label.CacheMode.CHAR;
                break;
        }
    }

    getFontNameByLanguage(): any {
        const lang = Translator.getCurrentLanguageId();
        const overrideFonts = this.overrideFonts.find((data) => data.language === lang);
        return overrideFonts?.name || this.fontBases[lang] || this.fontBases["en"];
    }

    loadFont(name: string) {
        return bundleManager.loadSharedAsset<Font>(`fonts/${name}`, Font);
    }
}
