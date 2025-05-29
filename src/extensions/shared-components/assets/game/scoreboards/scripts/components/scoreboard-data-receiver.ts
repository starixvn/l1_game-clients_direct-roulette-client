import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { ResultPercentage } from "../../../result-percentage/scripts/result-percentage";
import { Scoreboard } from "./scoreboard";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardDerived } from "./scoreboard-derived";
import { ScoreboardBeadRoad } from "./scoreboard-bead-road";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class ScoreboardDataReceiver extends ObserverComponent {
    @property({ type: Scoreboard })
    scoreboards: Scoreboard[] = [];

    @property(ResultPercentage)
    resultPercentage: ResultPercentage = null;

    protected lastRound: unknown = {};
    protected rounds: gc.RoundHistories.RoundHistory[] = [];
    protected numberOfRoundHistory = 0;

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    public render(rounds: gc.RoundHistories.RoundHistory[]) {
        if (!rounds) {
            return;
        }
        const reversedRounds = [...rounds].reverse();

        this.rounds = reversedRounds;
        this.scoreboards.forEach((scoreboard) => {
            scoreboard.render([...reversedRounds]);
        });

        this.resultPercentage?.render(this.rounds);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.getLastRound())
    public setLastRound(round: unknown) {
        this.lastRound = round;
    }

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.numberOfRoundHistory)
    setNumberOfRoundHistory(numberOfRoundHistory: number) {
        this.numberOfRoundHistory = numberOfRoundHistory;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isLocking)
    public toggleBlinkNode(active: boolean) {
        if (!active) {
            return;
        }

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
            const beadRoadScoreboard = scoreboard.getComponent(ScoreboardBeadRoad);
            if (derivedScoreboard) {
                derivedScoreboard.render(this.rounds, true);
            } else if (beadRoadScoreboard) {
                const beadRoadRounds =
                    this.numberOfRoundHistory !== 0 && rounds.length > this.numberOfRoundHistory
                        ? rounds.slice(-this.numberOfRoundHistory)
                        : rounds;

                beadRoadScoreboard.render(beadRoadRounds);
            } else {
                scoreboard.render(rounds);
            }
        });
    }
}
