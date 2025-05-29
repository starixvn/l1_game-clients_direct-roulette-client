import gc from "@sg/game-client-base";
import { _decorator, Component, Label, Node } from "cc";
import { ComponentUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;
@ccclass
export class ResultPercentage extends Component {
    @property
    autoFindLabels = false;

    @property({
        type: Label,
        visible: function () {
            return !this.autoFindLabels;
        },
    })
    labels: Label[] = [];

    @property({
        type: Node,
        visible: function () {
            return this.autoFindLabels;
        },
    })
    labelContainer: Node = null;

    @property
    supportChoices = "dragon,tiger,tie";

    @property
    enablePercentage = true;

    @property
    showSignPercentage = true;

    originalChoices: string[] = [];

    private initialized = false;
    onLoad() {
        if (!this.initialized) {
            this.initSomeStuffs();
        }
    }

    private initSomeStuffs() {
        this.initialized = true;
        this.generateOriginalChoices();
        if (this.autoFindLabels && this.labelContainer) {
            this.labelContainer.children.forEach((child) => {
                const label = child.getComponent(Label);
                if (label) {
                    this.labels.push(label);
                }
            });
        }
        ComponentUtils.setEmptyLabels(this.labels);
    }

    generateOriginalChoices() {
        this.originalChoices = this.supportChoices.split(",");
    }

    render(histories: gc.RoundHistories.RoundHistory[]) {
        if (!this.initialized) {
            this.initSomeStuffs();
        }
        if (histories.length === 0) {
            this.clearAllLabels();
            return;
        }

        if (this.enablePercentage) {
            this.handlePercentageChoice(histories);
        } else {
            this.handleOccurrenceChoice(histories);
        }
    }

    clearAllLabels() {
        this.labels.forEach((label) => {
            if (this.enablePercentage) {
                label.string = `0${this.showSignPercentage ? "%" : ""}`;
            } else {
                label.string = `0`;
            }
        });
    }

    handlePercentageChoice(histories: gc.RoundHistories.RoundHistory[]) {
        const percentage = this.calculateWinPercentage(this.originalChoices, histories);
        this.labels.forEach((label) => {
            const choice = label.node.name;
            label.string = `${percentage[choice] || 0}${this.showSignPercentage ? "%" : ""}`;
        });
    }

    calculateWinPercentage(originalChoices: string[], roundHistory: gc.RoundHistories.RoundHistory[]) {
        const count = this.calculateWin(originalChoices, roundHistory);

        const choices = [...originalChoices].sort((a, b) => count[a] - count[b]);

        let total = 0;
        const percentage = {};
        choices.forEach((choice, index) => {
            if (count[choice]) {
                const rawValue = (count[choice] * 100) / roundHistory.length;
                const value = index === 0 ? Math.ceil(rawValue) : Math.floor(rawValue);
                percentage[choice] = `${value}`;
                if (index === choices.length - 1) {
                    percentage[choice] = `${100 - total}`;
                }

                total += value;
            }
        });

        return percentage;
    }

    calculateWin(originalChoices: string[], roundHistory: gc.RoundHistories.RoundHistory[]) {
        return roundHistory.reduce((count: Record<string, number>, history) => {
            originalChoices.forEach((choice) => {
                count[choice] = count[choice] ?? 0;
                if (history.settlementResult[choice]) {
                    count[choice] = count[choice] + 1;
                }
            });
            return count;
        }, {});
    }

    handleOccurrenceChoice(histories: gc.RoundHistories.RoundHistory[]) {
        const countChoices = this.calculateWin(this.originalChoices, histories);
        this.labels.forEach((label) => {
            const choice = label.node.name;
            countChoices[choice] !== undefined && (label.string = countChoices[choice].toString());
        });
    }
}
