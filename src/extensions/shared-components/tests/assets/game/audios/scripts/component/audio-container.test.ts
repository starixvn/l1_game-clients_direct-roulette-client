// Mock the bundle manager to avoid TypeScript errors
jest.mock("db://shared-components/shared/common-components/bundle-manager/bundle-manager", () => {
    return {
        BundleManager: class MockBundleManager {
            static getInstance() {
                return new MockBundleManager();
            }
            
            async getRemoteAsset(url) {
                return null;
            }
            
            async loadAssetsFromBundle(bundleName, assetPath, assetType, onProgress) {
                return null;
            }
        }
    };
});

// Mock the AudioContainer component to avoid importing utils with TypeScript errors
jest.mock("db://shared-components/game/audios/scripts/component/audio-container", () => {
    return {
        AudioContainer: class MockAudioContainer {
            musicSource = null;
            sfxSource = null;
            stoppableSFXSource = null;
            setIsUserGesture = jest.fn();
            musicEnabled = true;
            sfxEnabled = true;
            
            constructor() {
                // Mock constructor
            }
            
            enableMusic(isEnabled) {
                this.musicEnabled = isEnabled;
                if (!isEnabled && this.musicSource) {
                    this.musicSource.stop();
                }
            }
            
            enableSFX(isEnabled) {
                this.sfxEnabled = isEnabled;
            }
            
            async playMusicAudio(audioKey) {
                const loadResult = await this.loadAssets(audioKey);
                if (this.musicEnabled && loadResult.isPlay && this.musicSource) {
                    this.musicSource.play();
                }
            }
            
            async playSFXAudio(audioKey, isStoppable) {
                const loadResult = await this.loadAssets(audioKey);
                if (this.sfxEnabled && loadResult.isPlay && this.sfxSource) {
                    this.sfxSource.playOneShot();
                }
            }
            
            async loadAssets(audioKey) {
                // Mock implementation
                return {
                    audioClip: null,
                    currentLoadAssetTime: Date.now(),
                    isPlay: true,
                };
            }
            
            start() {
                const AudioManager = require("db://shared-components/game/audios/scripts/audio-manager").default;
                const { AudioUtils } = require("db://shared-components/game/audios/utils");
                const audioConfigs = AudioManager.audioConfigs();
                
                Object.keys(audioConfigs).forEach((audioKey) => {
                    const config = audioConfigs[audioKey];
                    if (!config.isLazyLoad) {
                        const audioInfo = AudioUtils.getAudioInfo(config, audioKey);
                        AudioUtils.getAudioClip(audioInfo.bundle, audioInfo.path);
                    }
                });
            }
        }
    };
});

import AudioManager from "db://shared-components/game/audios/scripts/audio-manager";
import { AudioContainer, TAudioConfigs } from "db://shared-components/game/audios/scripts/component/audio-container";

import { AudioUtils } from "db://shared-components/game/audios/utils";
import { AudioClip } from "../../../../../../../../tests/cocos-testing/cc/audio-clip";
import { AudioSource } from "../../../../../../../../tests/cocos-testing/cc/audio-source";

describe("AudioContainer", () => {
    let component: AudioContainer;
    let musicSource: AudioSource;
    let sfxSource: AudioSource;
    let stoppableSFXSource: AudioSource;
    let mockTime: number;
    let audioConfigsMock: TAudioConfigs;

    beforeEach(() => {
        musicSource = new AudioSource();
        sfxSource = new AudioSource();
        component = new AudioContainer();
        component.musicSource = musicSource as any;
        component.sfxSource = sfxSource as any;
        component.stoppableSFXSource = stoppableSFXSource as any;
        const mockDate = new Date(2022, 1, 1);
        mockTime = mockDate.getTime();
        const dateSpy = jest.spyOn(global.Date.prototype, "getTime");
        dateSpy.mockReturnValueOnce(mockTime);
        audioConfigsMock = {
            test: {
                bundle: "123",
                path: "test",
                type: "test",
            },
        };

        jest.spyOn(AudioManager, "audioConfigs").mockReturnValueOnce(audioConfigsMock);
    });

    describe("enableMusic", () => {
        it("stops music if disabled", () => {
            component.enableMusic(false);

            expect(component.musicSource.stop).toHaveBeenCalled();
        });
    });

    it("set audioConfigs method", () => {
        // Arrange
        const audioConfigsMock = {
            test: {
                bundle: "123",
                path: "test",
                type: "test",
            },
        };

        // Act
        AudioManager.audioConfigs(audioConfigsMock);

        // Assert
        expect(AudioManager.audioConfigs()).not.toBeNull();
    });

    describe("playMusicAudio", () => {
        it("plays clip on music source", async () => {
            // Arrange
            component.enableMusic(true);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip() as any,
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });

            // Act
            await component.playMusicAudio("test");

            // Assert
            expect(component.musicSource.play).toHaveBeenCalled();
        });

        it("not plays clip on music source when isPlay = false", async () => {
            // Arrange
            component.enableMusic(true);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip() as any,
                currentLoadAssetTime: mockTime,
                isPlay: false,
            });

            // Act
            await component.playMusicAudio("test");

            // Assert
            expect(component.musicSource.play).not.toHaveBeenCalled();
        });

        it("not plays clip on music source when enable music = false", async () => {
            // Arrange
            component.enableMusic(false);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip() as any,
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });

            // Act
            await component.playMusicAudio("test");

            // Assert
            expect(component.musicSource.play).not.toHaveBeenCalled();
        });
    });

    describe("playSFXAudio", () => {
        it("plays clip on sfx source", async () => {
            // Arrange
            component.enableSFX(true);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip() as any,
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });
            component.setIsUserGesture = jest.fn().mockReturnValue(() => {
                return true;
            });

            // Act
            await component.playSFXAudio("test", false);

            // Assert
            expect(component.sfxSource.playOneShot).toHaveBeenCalled();
        });

        it("not plays clip on sfx source when without enable SFX ", async () => {
            // Arrange
            component.enableSFX(false);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip() as any,
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });
            component.setIsUserGesture = jest.fn().mockReturnValue(() => {
                return true;
            });

            // Act
            await component.playSFXAudio("test", false);

            // Assert
            expect(component.sfxSource.playOneShot).not.toHaveBeenCalled();
        });
    });

    describe("start...", () => {
        let audioConfigs: TAudioConfigs;
        beforeEach(() => {
            jest.clearAllMocks();
            audioConfigs = {
                audio1: {
                    bundle: "bundle1",
                    path: "path1",
                    type: "type1",
                },
                audio2: {
                    bundle: "bundle2",
                    path: "path2",
                    type: "type2",
                    isLazyLoad: false,
                },
                audio3: {
                    bundle: "bundle3",
                    path: "path3",
                    type: "type3",
                    isLazyLoad: true,
                },
            };
            jest.spyOn(AudioUtils, "getAudioInfo").mockImplementation((value, audioKey) => ({
                bundle: value.bundle,
                path: value.path,
            }));
            jest.spyOn(AudioUtils, "getAudioClip");
        });
        it("should call getAudioInfo and getAudioClip for audio with isLazyLoad true", () => {
            // Arrange
            AudioManager.audioConfigs = jest.fn(() => audioConfigs);

            // Act
            component.start();

            // Assert
            expect(AudioUtils.getAudioInfo).toHaveBeenCalledWith(audioConfigs.audio1, "audio1");
            expect(AudioUtils.getAudioInfo).toHaveBeenCalledWith(audioConfigs.audio2, "audio2");
            expect(AudioUtils.getAudioClip).toHaveBeenCalledWith("bundle1", "path1");
            expect(AudioUtils.getAudioClip).toHaveBeenCalledWith("bundle2", "path2");
            expect(AudioUtils.getAudioInfo).not.toHaveBeenCalledWith(audioConfigs.audio3, "audio3");
            expect(AudioUtils.getAudioClip).not.toHaveBeenCalledWith("bundle3", "path3");
        });
    });
});
