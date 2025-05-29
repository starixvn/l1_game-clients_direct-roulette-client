import gc from "@sg/game-client-base";
import { _decorator, Enum, Toggle } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { Audios } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class AudioCmp extends ObserverComponent {
    @property({ type: Enum(Audios.AudioType) })
    type = Audios.AudioType.SFX;

    @property(Toggle)
    toggle: Toggle = null;

    @render(gc.UserSettings.UserSettingStore, (store) => store.musicEnable)
    renderMusicComp(enable: boolean) {
        if (this.type !== Audios.AudioType.MUSIC) {
            return;
        }
        this.updateDisplay(enable);
    }

    @render(gc.UserSettings.UserSettingStore, (store) => store.sfxEnable)
    renderSfxComp(enable: boolean) {
        if (this.type !== Audios.AudioType.SFX) {
            return;
        }
        this.updateDisplay(enable);
    }

    updateDisplay(enable: boolean) {
        if (this.toggle) {
            this.toggle.isChecked = enable;
        }
    }

    @handle(gc.UserSettings.UserSettingHandlers, (handle, param: { type: number; enable: boolean }) =>
        handle.handleAudioChanged(param.type, param.enable)
    )
    onChangedAudio() {
        return { type: this.type, enable: this.toggle.isChecked };
    }
}
