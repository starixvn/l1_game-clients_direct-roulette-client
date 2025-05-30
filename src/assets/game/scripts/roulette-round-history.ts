import gc from "@sg/game-client-base";
import { _decorator, Node, Label, Sprite, SpriteFrame } from 'cc';
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import RouletteUtils from './roulette-utils';
import { settings } from "./game-settings";

const { ccclass, property } = _decorator;
const { render, observer } = Observer;
const { RoundHistories } = gc;

@ccclass('RouletteRoundHistory')
@observer(settings.name)
export class RouletteRoundHistory extends ObserverComponent {
    
    @property(Node)
    content: Node = null;

    @property(SpriteFrame)
    redSprite: SpriteFrame = null;

    @property(SpriteFrame)
    blackSprite: SpriteFrame = null;

    private resultNodes: Node[] = [];
    private readonly maxResults = 8;

    start() {
        super.start();
        this.setupResultNodes();
    }

    private setupResultNodes() {
        if (!this.content) {
            this.content = this.node.getChildByName('content');
        }

        for (let i = 1; i <= this.maxResults; i++) {
            const resultNode = this.content?.getChildByName(`result-${i}`);
            if (resultNode) {
                this.resultNodes.push(resultNode);
                resultNode.active = false;
            }
        }
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.histories)
    updateRoundHistory(histories: gc.RoundHistories.RoundHistory[]) {
        this.displayHistories(histories);
    }

    private displayHistories(histories: gc.RoundHistories.RoundHistory[]) {
        if (!histories?.length) {
            this.clearDisplay();
            return;
        }

        const numbers = histories
            .map(history => this.extractNumber(history))
            .filter(num => num !== null);

        this.displayNumbers(numbers);
    }

    private displayNumbers(numbers: number[]) {
        this.clearDisplay();
        
        const numbersToShow = numbers.slice(0, this.maxResults);
        numbersToShow.forEach((number, index) => {
            if (index < this.resultNodes.length) {
                this.setResultNode(this.resultNodes[index], number);
                this.resultNodes[index].active = true;
            }
        });
    }

    private setResultNode(node: Node, number: number) {
        this.setNodeText(node, number.toString());
        this.setNodeSprite(node, number);
    }

    private setNodeText(node: Node, text: string) {
        const txtNode = node.getChildByName('txt');
        const label = txtNode?.getComponent(Label);
        if (label) {
            label.string = text;
        }
    }

    private setNodeSprite(node: Node, number: number) {
        const sprite = node.getComponent(Sprite);
        if (!sprite) return;

        const isRed = number !== 0 && RouletteUtils.isRed(number);
        sprite.spriteFrame = isRed ? this.redSprite : this.blackSprite;
    }

    private extractNumber(roundHistory: gc.RoundHistories.RoundHistory): number | null {
        if (!roundHistory?.result) return null;

        const result = roundHistory.result;
        
        // 🔍 DEBUG: Log the complete structure to identify the format
        console.log('🔍 DEBUGGING ROUND HISTORY:');
        console.log('Full roundHistory object:', JSON.stringify(roundHistory, null, 2));
        console.log('result object:', JSON.stringify(result, null, 2));
        console.log('typeof result:', typeof result);
        console.log('Object.keys(result):', result && typeof result === 'object' ? Object.keys(result) : 'not an object');
        
        // Try common number properties
        const numberProperties = ['number', 'winningNumber', 'winNumber', 'rouletteNumber'];
        
        if (typeof result === 'number') {
            console.log('✅ Found direct number result:', result);
            return result;
        }

        for (const prop of numberProperties) {
            if (result && typeof result[prop] === 'number') {
                console.log(`✅ Found result.${prop}:`, result[prop]);
                return result[prop];
            }
        }

        console.log('❌ Could not extract number from result');
        return null;
    }

    private clearDisplay() {
        this.resultNodes.forEach(node => node.active = false);
    }
}


