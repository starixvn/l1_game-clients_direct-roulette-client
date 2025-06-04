// Roulette bet types and interfaces
export enum RouletteBetType {
    StraightUp = "straightUp",
    Split = "split",
    Street = "street",
    Triangle = "triangle",
    Corner = "corner",
    FourNumbers = "fourNumbers",
    Line = "line",
    Column = "column",
    Dozen = "dozen",
    RedBlack = "redBlack",
    OddEven = "oddEven",
    BigSmall = "bigSmall"
}

export interface IRouletteBetInfo {
    type: RouletteBetType;
    numbers: number[];
}

export interface IBetChoices {
    [type: string]: {
        [key: string]: number;
    };
}

export interface IRouletteGameConfig {
    maxBetPerChoices: {
        [type: string]: number;
    };
    enableFreeBet: boolean;
}

export interface IRouletteSettlement {
    roundId: string;
    winningNumber: number;
    settlements: {
        [playerId: string]: number;
    };
}

export interface IRouletteResult {
    winningNumber: number;
    isRed: boolean;
    isOdd: boolean;
    isBig: boolean;
}

export interface IRouletteSettlementResult {
    playerId: string;
    totalWon: number;
    betsWon: Array<{
        type: RouletteBetType;
        key: string;
        amount: number;
        payout: number;
    }>;
} 