import { _decorator, Component } from "cc";
import { Scoreboard } from "./scoreboard";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardDerived } from "./scoreboard-derived";

const { ccclass, property } = _decorator;

@ccclass
export class RenderFakeData extends Component {
    scoreboards: Scoreboard[] = [];

    protected results = [];
    onLoad(): void {
        this.scoreboards = this.node.getComponentsInChildren(Scoreboard);
        this.schedule(() => {
            this.render();
            this.scheduleOnce(this.renderBlinkNode, 1);
        }, 3);
    }

    render() {
        const randomNum = (inputNumber: number) => (Math.random() * inputNumber) >> 0; //NOSONAR
        const value = randomNum(9);
        const isBanker = value < 2;
        const isTie = value >= 8;

        const randomRank = () => (4 + Math.random() * 5) >> 0;
        const result = {
            player: {
                card1: { rank: 3 },
                card2: { rank: 4 },
            },
            banker: {
                card1: { rank: randomRank() },
                card2: { rank: randomRank() },
            },
        };

        const settlementResult = {
            banker: isBanker,
            tie: isTie,
            playerPair: randomNum(2) > 1,
            bankerPair: randomNum(2) > 1,
            natural: randomNum(2) > 1,
        };

        const round = { result, settlementResult };

        if (this.results.length < 102) {
            this.results.push(round);
        } else {
            this.results.shift();
            this.results.push(round);
        }

        this.scoreboards.forEach((scoreboard) => {
            scoreboard.render(this.results);
        });
    }

    renderBlinkNode() {
        const converter = this.scoreboards[0].getComponent(ScoreboardDataConverter);
        const round = converter.createRound();
        if (this.results.length > 0) {
            const lastResult = converter.convert(this.results[this.results.length - 1])?.[converter.keyOfA];
            round[converter.resultKey][converter.keyOfA] = lastResult;
        } else {
            round[converter.resultKey][converter.keyOfA] = true;
        }
        round[converter.resultKey][converter.blinkKey] = true;
        const rounds = [...this.results, round];

        this.scoreboards.forEach((scoreboard) => {
            const derivedScoreboard = scoreboard.getComponent(ScoreboardDerived);
            if (derivedScoreboard) {
                derivedScoreboard.render(this.results, true);
            } else {
                scoreboard.render(rounds);
            }
        });
    }
}
