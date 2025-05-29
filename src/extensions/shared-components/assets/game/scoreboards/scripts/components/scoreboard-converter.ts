import { _decorator, Component } from "cc";
import { ScoreboardConverterProperty } from "../models/scoreboard-converter-property";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardDataConverter extends Component {
    @property
    resultKey = "settlementResult";

    @property([ScoreboardConverterProperty])
    properties: ScoreboardConverterProperty[] = [];

    convert<T>(rounds: T[] | T) {
        if (Array.isArray(rounds)) {
            return rounds.map((round) => round[this.resultKey]);
        }

        return rounds[this.resultKey];
    }

    getProperty(key: string) {
        return this.properties.find((x) => x.key === key)?.value;
    }

    createRound() {
        const round = { [this.resultKey]: {} };

        this.properties.forEach(({ value }) => Object.assign(round[this.resultKey], { [value]: false }));

        return round;
    }

    get keyOfA() {
        return this.getProperty("keyOfA");
    }

    get tieKey() {
        return this.getProperty("tieKey");
    }

    get blinkKey() {
        return this.getProperty("blinkKey");
    }
}
