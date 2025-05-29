import gc from "@sg/game-client-base";
import { _decorator, AudioClip, AudioSource, game, JsonAsset, log, sys, tween } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AudioUtils } from "../../utils";
import AudioManager from "../audio-manager";
import { siteConfigs } from "../../../../../../../assets/scripts/site-configs";
import { FunctionUtils } from "../../../../shared/utils";

const { Audios, UserSettings, App, BrowserDomUtils, AppTypes, Auth } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

export type TAudioConfigs = {
    [key: string]: TAudioValue;
};

export type TAudioValue = {
    bundle?: string;
    path: string;
    type: string;
    isMusicGame?: boolean;
    isLazyLoad?: boolean;
    isRemote?: boolean;
};

export type IRemoteSoundConfigs = {
    version: number;
    defaultTheme: string;
    backgroundMusic: {
        version: number;
    };
    themes: string[];
};

@ccclass
export class AudioContainer extends ObserverComponent {
    @property(JsonAsset)
    sharedAudioConfig: JsonAsset = null;

    @property(JsonAsset)
    audioConfig: JsonAsset = null;

    @property(AudioSource)
    musicSource: AudioSource = null;

    @property(AudioSource)
    sfxSource: AudioSource = null;

    @property(AudioSource)
    stoppableSFXSource: AudioSource = null;

    audios = [];
    musicIds = [];
    musicGameIds = [];
    protected isUserGesture = false;
    protected isPlayMusic = false;
    protected isPlaySFX = false;
    protected currentPlayTime = {};
    protected remoteSoundConfigs: IRemoteSoundConfigs = null;
    protected remoteAudioConfigs: TAudioConfigs = null;

    setIsUserGesture(isUserGesture: boolean) {
        this.isUserGesture = isUserGesture;
    }

    onLoad() {
        super.onLoad();
        this.musicSource.node.on(AudioSource.EventType.STARTED, () => this.updateMusicState(Audios.MusicState.STARTED));
        this.musicSource.node.on(AudioSource.EventType.ENDED, () => this.updateMusicState(Audios.MusicState.ENDED));

        // The AudioContext was not allowed to start.
        // It must be resumed (or created) after a user gesture on the page
        this.initTouchBind();

        this.getRemoteSoundConfigs().finally(() => {
            this.loadAudios().catch((error) => log(error));
        });
    }

    onDestroy(): void {
        super.onDestroy();
        window.removeEventListener("message", this.handleSoundEventFromParent);
    }

    async loadAudios() {
        this.getRemoteAudioConfig().finally(() => {
            const audioConfigs: TAudioConfigs = {
                ...this.sharedAudioConfig?.json,
                ...this.remoteAudioConfigs,
                ...this.audioConfig?.json,
            };

            AudioManager.audioConfigs(audioConfigs);
            const keys = Object.keys(audioConfigs);
            for (const key of keys) {
                const value = audioConfigs[key];
                if (Object.keys(value).length === 0) {
                    continue;
                }
                if (value.type === "music") {
                    if (value?.isMusicGame) {
                        this.musicGameIds.push(key);
                    } else {
                        this.musicIds.push(key);
                    }
                } else {
                    this.audios.push(key);
                }
            }

            this.registerMusicIds();
            this.registerMusicGameIds();
            this.audiosLoaded();
        });
    }

    protected initTouchBind() {
        const touchEvent = "ontouchend" in window ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];
        const [touchStartEvent, touchEndEvent] = touchEvent;

        const handleTouchEvent = () => {
            this.isUserGesture = true;
            this.postMessageUserGestureToParent();
            this.updateTouchedScreen();
        };

        game.canvas.addEventListener(touchStartEvent, handleTouchEvent);
        game.canvas.addEventListener(touchEndEvent, handleTouchEvent);

        window.addEventListener("message", this.handleSoundEventFromParent);
    }

    @handle(gc.App.AppHandlers.UserGesturePage, (handle, value: boolean) => handle.handleTouchScreen(value))
    updateTouchedScreen() {
        return true;
    }

    handleSoundEventFromParent = (event: MessageEvent) => {
        const { sfxEnable } = event.data;
        if (sfxEnable !== null && sfxEnable !== undefined) {
            this.switchSound(sfxEnable);
        }
    };

    start() {
        const audioConfigs = AudioManager?.audioConfigs() || {};
        for (const [audioKey, value] of Object.entries(audioConfigs)) {
            if (value?.isLazyLoad !== true) {
                const { bundle, path } = AudioUtils.getAudioInfo(value, audioKey);
                AudioUtils.getAudioClip(bundle, path);
            }
        }
    }

    @handle(gc.UserSettings.UserSettingHandlers, (handle, sfxEnable: boolean) => handle.setSfxEnable(sfxEnable))
    private switchSound(sfxEnable: boolean) {
        return sfxEnable;
    }

    protected postMessageUserGestureToParent() {
        BrowserDomUtils.postMessageToParent({ isUserGesture: true });
    }

    @render(App.AppStore, (store) => store.isUserGesture)
    setUserGesture(isUserGesture: boolean): void {
        if (sys.os !== sys.OS.IOS && isUserGesture) {
            this.isUserGesture = true;
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, state: gc.Audios.MusicState) => handle.updateMusicState(state))
    updateMusicState(state: gc.Audios.MusicState) {
        return state;
    }

    @handle(gc.Audios.AudioHandler, (handle, ids: string[]) => handle.setMusicIds(ids))
    registerMusicIds() {
        return this.musicIds;
    }

    @handle(gc.Audios.AudioHandler, (handle, ids: string[]) => handle.setMusicGameIds(ids))
    registerMusicGameIds() {
        return this.musicGameIds;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.audiosLoaded())
    audiosLoaded() {}

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable, { fireImmediately: false })
    enableMusic(musicEnable: boolean) {
        this.isPlayMusic = musicEnable;
        if (!musicEnable) {
            this.stopAudio(this.musicSource);
        }
    }

    updateVolumeMusicSource(volume: number, duration: number) {
        tween(this.musicSource).to(duration, { volume: volume }).start();
    }

    updateVoulmeStoppableSFXSource(volume: number, duration: number) {
        tween(this.stoppableSFXSource).to(duration, { volume: volume }).start();
    }

    @render(UserSettings.UserSettingStore, (store) => store.sfxEnable)
    enableSFX(sfxEnable: boolean) {
        this.isPlaySFX = sfxEnable;
    }

    @render(Audios.AudioStore, (store) => store.music, { fireImmediately: false })
    playMusic(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY) {
            this.playMusicAudio(data.id);
        }
    }

    async playMusicAudio(id: string) {
        await this.playAudio(
            id,
            (clip, isPlay) => {
                isPlay === this.isPlayMusic && this.playSourceClip(this.musicSource, clip);
            },
            this.isPlayMusic
        );
    }

    protected stopAudio(audioSource: AudioSource) {
        audioSource?.stop();
    }

    @render(Audios.AudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFX(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id, false);
        }
    }

    @render(Audios.AudioStore, (store) => store.stoppableSFX)
    handleStoppableSFX(data: gc.Audios.AudioData) {
        if (data && data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id, true);
        } else {
            this.stopAudio(this.stoppableSFXSource);
        }
    }

    async playSFXAudio(id: string, isStoppableSFX: boolean) {
        this.playAudio(
            id,
            (clip, isPlay) => {
                if (isPlay === this.isPlaySFX) {
                    isStoppableSFX ? this.playSourceClip(this.stoppableSFXSource, clip) : this.sfxSource.playOneShot(clip);
                }
            },
            this.isPlaySFX
        );
    }

    protected playSourceClip(audioSource: AudioSource, audioClip: AudioClip) {
        audioSource.clip = audioClip;
        audioSource.play();
    }

    protected stopSourceClip(audioSource: AudioSource, audioClip: AudioClip) {
        audioSource.clip = audioClip;
        audioSource.stop();
    }

    async playAudio(id: string, playFunction: (clip: AudioClip, isPlay: boolean) => void, isCurrentPlaying: boolean) {
        const audioValue = AudioManager?.audioConfigs()?.[id];
        if (!audioValue || (this.currentPlayTime[id] !== undefined && this.currentPlayTime[id] > 0)) {
            return;
        }

        const currentTime = new Date().getTime();
        this.currentPlayTime[id] = currentTime;
        const { audioClip, currentLoadAssetTime, isPlay } = await this.loadAssets(audioValue, id, currentTime, isCurrentPlaying);

        if (audioClip) {
            if (this.currentPlayTime[id] !== currentLoadAssetTime) {
                return;
            }

            playFunction(audioClip, isPlay);
            this.currentPlayTime[id] = 0;
        }
    }

    loadAssets = async (
        audioValue: TAudioValue,
        soundId: string,
        currentLoadAssetTime: number,
        isPlay: boolean
    ): Promise<{ audioClip: AudioClip | null; currentLoadAssetTime: number; isPlay: boolean }> => {
        if (audioValue?.isRemote) {
            const url = `${this.getRemoteSoundPath()}/${this.remoteSoundConfigs.defaultTheme}/${
                this.remoteAudioConfigs[soundId].path
            }.mp3?v=${this.remoteSoundConfigs.version}`;
            const audioClip = await AudioUtils.getRemoteAudioClip(url);

            return { audioClip, currentLoadAssetTime, isPlay };
        }

        const { bundle, path } = AudioUtils.getAudioInfo(audioValue, soundId);

        if (!bundle || !path) {
            return { audioClip: null, currentLoadAssetTime: 0, isPlay: false };
        }

        const audioClip = await AudioUtils.getAudioClip(bundle, path);

        return { audioClip, currentLoadAssetTime, isPlay };
    };

    async getRemoteSoundConfigs() {
        try {
            const configUrl = `${this.getRemoteSoundPath()}/info.json?v=${Date.now()}`;
            const jsonAsset = (await FunctionUtils.loadRemote(configUrl)) as JsonAsset;
            this.remoteSoundConfigs = (jsonAsset?.json as IRemoteSoundConfigs) ?? null;
        } catch (error) {
            log("Get config remote sounds failed!");
        }
    }

    async getRemoteAudioConfig() {
        try {
            const configUrl = `${this.getRemoteSoundPath()}/${this.remoteSoundConfigs.defaultTheme}/info.json?v=${Date.now()}`;
            const jsonAsset = (await FunctionUtils.loadRemote(configUrl)) as JsonAsset;
            this.remoteAudioConfigs = (jsonAsset?.json as TAudioConfigs) ?? null;
        } catch (error) {
            log("Get remote audio config failed!");
        }
    }

    getRemoteSoundPath() {
        return `${gc.UrlUtils.buildShareResource(siteConfigs)}/sounds/themes`;
    }
}
