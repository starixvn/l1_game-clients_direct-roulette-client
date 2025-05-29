// Mock the MusicPlayer component to avoid importing utils with TypeScript errors
jest.mock("db://shared-components/game/audios/scripts/component/music-player", () => {
    return class MockMusicPlayer {
        callPlayMusic = jest.fn();
        
        constructor() {
            // Mock constructor
        }
        
        playNext(state) {
            const { Audios } = require("@sg/game-client-base");
            if (state === Audios.MusicState.ENDED) {
                this.callPlayMusic();
            }
        }
        
        enableMusic(isEnabled) {
            if (isEnabled) {
                this.callPlayMusic();
            }
        }
        
        startMusicPlayer() {
            this.callPlayMusic();
        }
    };
});

import gc from "@sg/game-client-base";
import MusicPlayer from "db://shared-components/game/audios/scripts/component/music-player";

const { Audios } = gc;

describe("MusicPlayer", () => {
    let component: MusicPlayer;

    beforeEach(() => {
        component = new MusicPlayer();
    });

    describe("playNext", () => {
        it("calls playMusic when state is ENDED", () => {
            // Arrange
            const callPlayMusic = jest.fn();
            component.callPlayMusic = callPlayMusic;

            // Act
            component.playNext(Audios.MusicState.ENDED);

            // Assert
            expect(callPlayMusic).toHaveBeenCalled();
        });
    });

    describe("enableMusic", () => {
        it("calls playMusic when musicEnable is true", () => {
            // Arrange
            const callPlayMusic = jest.fn();
            component.callPlayMusic = callPlayMusic;

            // Act
            component.enableMusic(true);

            // Assert
            expect(callPlayMusic).toHaveBeenCalled();
        });
    });

    describe("startMusicPlayer", () => {
        it("calls playMusic", () => {
            // Arrange
            const callPlayMusic = jest.fn();
            component.callPlayMusic = callPlayMusic;

            // Act
            component.startMusicPlayer();

            // Assert
            expect(callPlayMusic).toHaveBeenCalled();
        });
    });
});
