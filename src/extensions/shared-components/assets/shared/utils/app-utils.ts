import gc from "@sg/game-client-base";

const { StorageManager, localStorageKeys } = gc;

export namespace AppUtils {
    export const getSession = () => {
        return StorageManager.get(localStorageKeys?.session);
    };

    export function getLocale() {
        const data = getSession() as any;
        return data.language;
    }

    export const DEFAULT_LOCALE = "en-US";
}
