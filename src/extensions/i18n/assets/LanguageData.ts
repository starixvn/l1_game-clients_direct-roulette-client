import gc from "@sg/game-client-base";
import * as cc from "cc";
const { director } = cc;
export let _language = "en";

export let ready: boolean = false;

/**
 * 初始化
 * @param language
 */
export function init(language: string) {
    ready = true;
    const isChangingLanguage = _language != language;
    _language = language;

    try {
        if(!gc.Translator.isReady)
        {
            gc.Translator.init({
                isUseTolgeeRealTime: false,
                languageId: _language,
                getStaticData: (languageId) => {
                    return window["languages"][languageId]
                }
            })
            console.log("init language in LanguageData");
        }
        else if(isChangingLanguage && _language !== gc.Translator.options?.languageId) {
            gc.Translator.changeLanguage(_language);
            console.log("change language in LanguageData");
        }

    } catch (e) {
        console.log(e);
    }
}

/**
 * 翻译数据
 * @param key
 */
export function t(key: string) {
    
    try {
        return gc.Translator.translate(key)
    } catch (e) {
        console.log(e);
    }

    return key || "";
}

export function updateSceneRenderers() {
    // very costly iterations
    const rootNodes = director.getScene()!.children;
    // walk all nodes with localize label and update
    const allLocalizedLabels: any[] = [];
    for (let i = 0; i < rootNodes.length; ++i) {
        let labels = rootNodes[i].getComponentsInChildren("LocalizedLabel");
        Array.prototype.push.apply(allLocalizedLabels, labels);
    }
    for (let i = 0; i < allLocalizedLabels.length; ++i) {
        let label = allLocalizedLabels[i];
        if (!label.node.active) continue;
        label.updateLabel();
    }
    // walk all nodes with localize sprite and update
    const allLocalizedSprites: any[] = [];
    for (let i = 0; i < rootNodes.length; ++i) {
        let sprites = rootNodes[i].getComponentsInChildren("LocalizedSprite");
        Array.prototype.push.apply(allLocalizedSprites, sprites);
    }
    for (let i = 0; i < allLocalizedSprites.length; ++i) {
        let sprite = allLocalizedSprites[i];
        if (!sprite.node.active) continue;
        sprite.updateSprite();
    }
}

// 供插件查询当前语言使用
const win = window as any;
win._languageData = {
    get language() {
        return _language;
    },
    init(lang: string) {
        init(lang);
    },
    updateSceneRenderers() {
        updateSceneRenderers();
    },
};
