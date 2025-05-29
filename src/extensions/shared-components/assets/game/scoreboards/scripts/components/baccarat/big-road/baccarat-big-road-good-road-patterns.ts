import SCScoreboard from "sc-scoreboards";

const { CHASE, LONG_ROAD, buildPattern } = SCScoreboard;

const PositiveBanker = true;
const PositivePlayer = false;

export const STREAK_BANKER = { ...buildPattern(LONG_ROAD, PositiveBanker), name: "Streak Banker" };
export const PING_PONG_BANKER = { ...buildPattern(CHASE, PositiveBanker), name: "Pingpong Banker" };
export const STREAK_PLAYER = { ...buildPattern(LONG_ROAD, PositivePlayer), name: "Streak Player" };
export const PING_PONG_PLAYER = { ...buildPattern(CHASE, PositivePlayer), name: "Pingpong Banker" };

export const PATTED_EAT_BANKER = {
    name: "Patted Eat Banker",
    columns: [
        { exact: true, length: 2 },
        { exact: true, length: 2 },
        { exact: true, length: 2 },
        { exact: true, length: 2 },
    ],
    repeat: true,
    positive: PositiveBanker,
};

export const PATTED_EAT_PLAYER = {
    ...PATTED_EAT_BANKER,
    name: "Patted Eat Player",
    positive: PositivePlayer,
};

export const ONE_LOUNGE_2_ROOMS_BANKER = {
    name: "One Lounge 2 Bedroom Banker",
    columns: [
        { exact: true, length: 1 },
        { exact: true, length: 2 },
        { exact: true, length: 1 },
        { exact: true, length: 2 },
    ],
    repeat: true,
    positive: PositiveBanker,
};

export const ONE_LOUNGE_2_ROOMS_PLAYER = {
    ...ONE_LOUNGE_2_ROOMS_BANKER,
    name: "One Lounge 2 Bedroom Player",
    positive: PositivePlayer,
};

export const TEST_PATTERN = {
    name: "Test Pattern",
    columns: [{ exact: false, length: 1 }],
    repeat: false,
    positive: PositiveBanker,
};

export const DEFAULT_PATTERNS = [
    STREAK_BANKER,
    STREAK_PLAYER,
    PING_PONG_BANKER,
    PING_PONG_PLAYER,
    PATTED_EAT_BANKER,
    PATTED_EAT_PLAYER,
    ONE_LOUNGE_2_ROOMS_BANKER,
    ONE_LOUNGE_2_ROOMS_PLAYER,
];
