import { error, find, math, tween, TweenEasing, v3 } from "cc";
import LoadWebView from "db://shared-components/shared/common-components/web-view/load-web-view";

export class GameGuideUtils {
    private static LoadWebViewInstance: LoadWebView | null = null;

    private static readonly ANIMATION_CONFIG = {
        HIDE: {
            duration: 0.1,
            easing: "sineOut" as TweenEasing,
            position: () => v3(-10000, 0, 0),
        },
        SHOW: {
            duration: 0.2,
            easing: "sineIn" as TweenEasing,
            position: () => v3(0, 0, 0),
        },
    } as const;

    private static getLoadWebView(): LoadWebView | null {
        if (!GameGuideUtils.LoadWebViewInstance) {
            const canvas = find("Canvas");
            if (!canvas) {
                return null;
            }

            GameGuideUtils.LoadWebViewInstance = canvas.getComponentInChildren(LoadWebView) || null;
        }

        return GameGuideUtils.LoadWebViewInstance;
    }

    static hideWebViewGuide(): Promise<void> {
        try {
            return GameGuideUtils.animateLoadWebView(this.ANIMATION_CONFIG.HIDE);
        } catch (errorMessage) {
            error("[GameGuideUtils] Failed to hide web view guide:", errorMessage);
        }
    }

    static showWebViewGuide(): Promise<void> {
        try {
            return GameGuideUtils.animateLoadWebView(this.ANIMATION_CONFIG.SHOW);
        } catch (errorMessage) {
            error("[GameGuideUtils] Failed to show web view guide:", errorMessage);
        }
    }

    private static animateLoadWebView(config: { duration: number; easing: TweenEasing; position: () => math.Vec3 }): Promise<void> {
        const LoadWebView = GameGuideUtils.getLoadWebView();
        if (!LoadWebView?.node) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            tween(LoadWebView.node)
                .to(config.duration, { position: config.position() }, { easing: config.easing })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
}
