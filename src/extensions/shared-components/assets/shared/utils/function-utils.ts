import { Asset, Node, assetManager, find, screen, warn } from "cc";
import { GameComponentBase } from "../../game/scripts/components/game-component-base";

export namespace FunctionUtils {
    export const cachedRemoteFile = {};
    export const loadRemote = (url: string) => {
        return new Promise((resolve, reject) => {
            assetManager.loadRemote(url, (err, data: Asset) => {
                if (err) return reject(err);

                resolve(data);
            });
        });
    };
    export const getNamespace = () => {
        const namespace = find("Canvas").getComponentInChildren(GameComponentBase)?.namespace;

        return namespace || window?.envConfig?.mainObserverNamespace || "default";
    };
    export const isIpad = (): boolean => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /ipad/.test(userAgent);
    };

    export const isPortraitMode = (): boolean => {
        const frameSize = screen.windowSize;
        return frameSize.width < frameSize.height;
    };

    export const delay = async (milliseconds: number) => {
        let timeoutId: NodeJS.Timeout;
        return new Promise<void>((resolve) => {
            timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                resolve();
            }, milliseconds);
        });
    };

    export const waitUntil = async (condition: Function, interval = 1000, maxWait = 5000): Promise<void> => {
        if (condition()) {
            return;
        }
        return new Promise<void>((resolve, reject) => {
            const startTime = new Date().getTime();
            let timeoutId: NodeJS.Timeout;

            const clearTimer = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };

            const checkCondition = async () => {
                try {
                    if (await condition()) {
                        resolve();
                    } else if (new Date().getTime() - startTime <= maxWait) {
                        timeoutId = setTimeout(checkCondition, interval);
                    } else {
                        clearTimer();
                        resolve(); // Max wait time exceeded
                    }
                } catch (e) {
                    reject(e);
                }
            };

            checkCondition();
        });
    };

    export const asyncExecute = async <T>(node: Node, promiseValue: Promise<T>): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            const errorMessage = "Node is not valid!.";
            if (!node?.isValid) {
                reject(new Error(errorMessage));
            } else {
                promiseValue
                    .then((result) => {
                        if (!node?.isValid) {
                            reject(new Error(errorMessage));
                        } else {
                            resolve(result);
                        }
                    })
                    .catch((err) => {
                        warn("----asyncExecute----:", err);
                        reject(new Error(errorMessage));
                    });
            }
        });
    };
}
