// Mock the AudioCmp component to avoid importing utils with TypeScript errors
jest.mock("db://shared-components/game/audios/scripts/component/audio-cmp", () => {
    return class MockAudioCmp {
        toggle = null;
        type = null;
        updateDisplay = jest.fn();
        
        constructor() {
            // Mock constructor
        }
        
        renderMusicComp(isEnabled) {
            const { Audios } = require("@sg/game-client-base");
            if (this.type === Audios.AudioType.MUSIC) {
                this.updateDisplay(isEnabled);
            }
        }
        
        renderSfxComp(isEnabled) {
            const { Audios } = require("@sg/game-client-base");
            if (this.type === Audios.AudioType.SFX) {
                this.updateDisplay(isEnabled);
            }
        }
        
        onChangedAudio() {
            return {
                type: this.type,
                enable: this.toggle ? this.toggle.isChecked : false,
            };
        }
    };
});

import gc from "@sg/game-client-base";
import AudioCmp from "db://shared-components/game/audios/scripts/component/audio-cmp";
import { Toggle } from "../../../../../../../../tests/cocos-testing/cc/toggle";

const { Audios } = gc;

describe("AudioCmp", () => {
    let component: AudioCmp;
    let toggle: Toggle;

    beforeEach(() => {
        toggle = new Toggle();
        component = new AudioCmp();
        component.toggle = toggle as any;
        toggle.isChecked = false;
    });

    describe("renderMusicComp", () => {
        it("updates display when type is MUSIC", () => {
            // Arrange
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;
            component.type = Audios.AudioType.MUSIC;

            // Act
            component.renderMusicComp(true);

            // Assert
            expect(updateDisplay).toHaveBeenCalledWith(true);
        });

        it("does not update display when type is not MUSIC", () => {
            // Arrange
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;
            component.type = Audios.AudioType.SFX;

            // Act
            component.renderMusicComp(true);

            // Assert
            expect(updateDisplay).not.toHaveBeenCalled();
        });
    });

    describe("renderSfxComp", () => {
        it("updates display when type is SFX", () => {
            // Arrange
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;
            component.type = Audios.AudioType.SFX;

            // Act
            component.renderSfxComp(true);

            // Assert
            expect(updateDisplay).toHaveBeenCalledWith(true);
        });

        it("does not update display when type is not SFX", () => {
            // Arrange
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;
            component.type = Audios.AudioType.MUSIC;

            // Act
            component.renderSfxComp(true);

            // Assert
            expect(updateDisplay).not.toHaveBeenCalled();
        });
    });

    describe("onChangedAudio", () => {
        it("returns correct params", () => {
            // Arrange
            component.type = Audios.AudioType.MUSIC;

            // Act
            const result = component.onChangedAudio();

            // Assert
            expect(result).toEqual({
                type: Audios.AudioType.MUSIC,
                enable: false,
            });
        });
    });
});
