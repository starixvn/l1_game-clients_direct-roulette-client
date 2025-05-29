import { _decorator } from "cc";
import { ScoreboardDataConverter } from "./scoreboard-converter";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardKeepDetailConverter extends ScoreboardDataConverter {
    private readonly resultProperty = "result";

    convert<T>(rounds: T[] | T) {
        if (Array.isArray(rounds)) {
            return rounds.map((round) => ({
                ...round[this.resultKey],
                result: round[this.resultProperty],
            }));
        }

        return rounds[this.resultKey];
    }
}
