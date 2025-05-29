import gc from "@sg/game-client-base";
import * as i18n from "db://i18n/LanguageData";
import mobx from "mobx";
import Observer from "observer";

const loadI18n = (siteConfigs: gc.Configs.SiteConfigs, namespaces: string[]) => {
    try {
        const isUseTolgeeRealTime = !!siteConfigs.tolgeeUrl;
        const languageId = gc.Translator.getLanguageId();
        const languageCodes = ["en", "id", "th", "vi", "zh_cn", "zh_tw"];
        const translationOptions: gc.Shared.utils.TranslationOptions = {
            languageId: languageId,
            tolgeeUrl: siteConfigs.tolgeeUrl,
            isUseTolgeeRealTime: isUseTolgeeRealTime,
            getStaticData: (languageId) => {
                return window["languages"][languageId];
            },
            availableLanguages: languageCodes,
            onLoaded: () => {
                console.log("started tolgee");
            },
            gameNamespaces: namespaces,
        };

        gc.Translator.init(translationOptions);
        i18n.init(languageId);
    } catch (e) {
        console.log(e);
    }
};

export function startGame(
    gameName: string,
    containerOptions: gc.IContainerOptions,
    siteConfigs: gc.Configs.SiteConfigs,
    namespaces?: string[]
) {
    gc.StorageManager.setPrefixKey(siteConfigs.storagePrefixKey);
    loadI18n(siteConfigs, namespaces ? namespaces : [gameName]);

    const container = gc.getContainer(containerOptions);
    const observerContainer = gc.buildObserverContainer(container);

    Observer.configure({ [gameName]: { mobx, container: observerContainer } });

    return container;
}

export function getSharedContainer(siteConfigs: gc.Configs.SiteConfigs) {
    const containerOptions: gc.IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);
        },
        enabledFeatures: [
            gc.Player.FEATURE_NAME,
            gc.Auth.FEATURE_NAME,
            gc.App.FEATURE_NAME,
            gc.Notification.FEATURE_NAME,
            gc.ConnectSite.FEATURE_NAME,
            gc.ChipSetting.FEATURE_NAME,
            gc.GameConfiguration.FEATURE_NAME,
        ],
    };

    return gc.getContainer(containerOptions);
}
