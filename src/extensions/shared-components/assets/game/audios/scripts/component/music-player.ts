import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { Audios, UserSettings } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class MusicPlayer extends ObserverComponent {
    @render(Audios.AudioStore, (store) => store.musicState, { fireImmediately: false })
    playNext(state: gc.Audios.MusicState) {
        if (state === gc.Audios.MusicState.ENDED) {
            this.callPlayMusic();
        }
    }

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable)
    enableMusic(musicEnable: boolean) {
        if (musicEnable) {
            this.callPlayMusic();
        }
    }

    @render(Audios.AudioStore, (store) => store.startMusicPlayer, { fireImmediately: false })
    startMusicPlayer() {
        this.callPlayMusic();
    }

    @handle(Audios.AudioHandler, (handle) => handle.playRandomMusic())
    callPlayMusic() {}
}
