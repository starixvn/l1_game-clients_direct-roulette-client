import gc from "@sg/game-client-base";
export const getTimePointCutCards = (durations: gc.GameConfigs.DurationSetting) => {
    const { wholeShoe, generatingResult, showingResult } = durations;
    const DurationShowCutCardsSetting = 10;
    return wholeShoe - generatingResult - showingResult - DurationShowCutCardsSetting;
};

export const getTimePointBurnCards = (durations: gc.GameConfigs.DurationSetting) => {
    const CutCardAnimationDuration = 5;
    return getTimePointCutCards(durations) - CutCardAnimationDuration;
};
