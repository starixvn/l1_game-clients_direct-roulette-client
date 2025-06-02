import gc from "@sg/game-client-base";
import { _decorator, Component, Node, Label, Sprite, SpriteFrame, Prefab, instantiate } from 'cc';
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import RouletteUtils from './roulette-utils';

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass('RouletteRoundHistory')
export class RouletteRoundHistory extends ObserverComponent {
    
    @property(Node)
    content: Node = null;

    @property(Prefab)
    resultNodePrefab: Prefab = null;

    @property(SpriteFrame)
    redSprite: SpriteFrame = null;

    @property(SpriteFrame)
    blackSprite: SpriteFrame = null;

    private resultNodes: Node[] = [];
    private maxResults = 8;

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    updateRoundHistory(histories: gc.RoundHistories.RoundHistory[]) {
        this.displayHistories(histories);
    }

    private displayHistories(histories: gc.RoundHistories.RoundHistory[]) {
        if (!histories || histories.length === 0) {
            this.clearDisplay();
            return;
        }

        // Extract numbers from round history - result is always a number for roulette
        const numbers = histories
            .map(history => history.result as number)
            .filter(num => num !== null && num !== undefined);

        this.displayNumbers(numbers);
    }

    /**
     * Display array of numbers in the result nodes
     * Dynamically creates/destroys nodes as needed
     */
    private displayNumbers(numbers: number[]) {
        // Clear existing nodes
        this.clearDisplay();

        // Take up to maxResults numbers (newest first from gc)
        const numbersToShow = numbers.slice(0, this.maxResults);
        
        // Create and display nodes for each number
        numbersToShow.forEach((number, index) => {
            const resultNode = this.createResultNode(number, index);
            if (resultNode) {
                this.resultNodes.push(resultNode);
            }
        });
    }

    /**
     * Create a single result node for a number
     */
    private createResultNode(number: number, index: number): Node | null {
        if (!this.resultNodePrefab || !this.content) {
            console.error('Missing resultNodePrefab or content node');
            return null;
        }

        // Instantiate the prefab
        const resultNode = instantiate(this.resultNodePrefab);
        resultNode.name = `result-${index + 1}`;
        
        // Set the number and sprite
        this.setResultNode(resultNode, number);
        
        // Add to content (position will be handled by layout if using one)
        this.content.addChild(resultNode);
        
        return resultNode;
    }

    /**
     * Set a single result node with number and sprite
     */
    private setResultNode(node: Node, number: number) {
        // Set number text
        const txtNode = node.getChildByName('txt');
        const label = txtNode?.getComponent(Label);
        if (label) {
            label.string = number.toString();
        }

        // Set color sprite - simplified logic
        const sprite = node.getComponent(Sprite);
        if (sprite) {
            sprite.spriteFrame = (number !== 0 && RouletteUtils.isRed(number)) 
                ? this.redSprite 
                : this.blackSprite;
        }
    }

    /**
     * Clear all displays and destroy nodes
     */
    private clearDisplay() {
        this.resultNodes.forEach(node => {
            if (node && node.isValid) {
                node.destroy();
            }
        });
        this.resultNodes = [];
    }

    onDestroy() {
        // Clean up when component is destroyed
        this.clearDisplay();
    }
}


