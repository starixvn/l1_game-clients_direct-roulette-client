import { _decorator } from "cc";
import { ResultPercentage } from "../../../../game/result-percentage/scripts/result-percentage";
import { Scoreboard } from "../../../../game/scoreboards/scripts/components/scoreboard";
import { ScoreboardDataConverter } from "../../../../game/scoreboards/scripts/components/scoreboard-converter";
import { ScoreboardDerived } from "../../../../game/scoreboards/scripts/components/scoreboard-derived";
import { EmitterEvents, Store } from "../models/definitions";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class ScoreboardRender extends RenderItem {
    @property({ type: Scoreboard })
    scoreboards: Scoreboard[] = [];

    @property(ResultPercentage)
    resultPercentage: ResultPercentage = null;

    private rounds = [];
    onLoad() {
        const data = this._gameData;
        const store = data.getStore(Store.RoundHistory);
        store?.addListener(EmitterEvents.RoundHistoryChange, this.onData, this);

        const infoStore = data.getStore(Store.GameInfo);
        infoStore?.addListener(EmitterEvents.LockingBet, this.showNextNode, this);

        store?.wakeUp();
    }

    clearRenderListeners() {
        const store = this._gameData?.getStore(Store.RoundHistory);
        store?.removeAll(this);

        const infoStore = this._gameData?.getStore(Store.GameInfo);
        infoStore?.removeAll(this);
    }

    showNextNode = () => {
        const converter = this.scoreboards[0].getComponent(ScoreboardDataConverter);
        const round = converter.createRound();
        if (this.rounds.length > 0) {
            const lastResult = converter.convert(this.rounds[this.rounds.length - 1])?.[converter.keyOfA];
            round[converter.resultKey][converter.keyOfA] = lastResult;
        } else {
            round[converter.resultKey][converter.keyOfA] = true;
        }

        round[converter.resultKey][converter.blinkKey] = true;
        const rounds = [...this.rounds, round];

        this.scoreboards.forEach((scoreboard) => {
            const derivedScoreboard = scoreboard.getComponent(ScoreboardDerived);
            if (derivedScoreboard) {
                derivedScoreboard.render(this.rounds, true);
            } else {
                scoreboard.render(rounds);
            }
        });
    };

    onData = (rounds: any[]) => {
        if (!rounds) {
            return;
        }
        const reversedRounds = [...rounds].reverse();

        this.rounds = reversedRounds;
        this.scoreboards.forEach((scoreboard) => {
            scoreboard.render([...reversedRounds]);
        });

        this.resultPercentage?.render(this.rounds);
    };
}
