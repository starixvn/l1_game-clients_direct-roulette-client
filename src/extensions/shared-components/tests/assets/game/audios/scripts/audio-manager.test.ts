import AudioManager from "db://shared-components/game/audios/scripts/audio-manager";

describe("AudioManager", () => {
    it("should return the singleton instance", () => {
        const manager1 = AudioManager.getInstance();
        const manager2 = AudioManager.getInstance();

        expect(manager1).toBe(manager2);
    });

    it("should allow getting and setting audio configs", () => {
        const configs = {
            music: {
                bundle: "game.bundle",
                path: "music/theme.mp3",
                type: "mp3",
            },
        };

        AudioManager.audioConfigs(configs);

        const fetchedConfigs = AudioManager.audioConfigs();

        expect(fetchedConfigs).toEqual(configs);
    });
});
