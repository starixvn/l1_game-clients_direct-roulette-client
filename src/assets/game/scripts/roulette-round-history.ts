import gc from "@sg/game-client-base";
import { _decorator, Node, Label, Sprite, SpriteFrame, Prefab, instantiate, tween, UIOpacity } from 'cc';
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import RouletteUtils from './roulette-utils';

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass('RouletteRoundHistory')
export class RouletteRoundHistory extends ObserverComponent {
    
    @property(Node)
    content: Node = null;

    @property(Node)
    highlight: Node = null;

    @property(Prefab)
    resultNodePrefab: Prefab = null;

    @property(SpriteFrame)
    redSprite: SpriteFrame = null;

    @property(SpriteFrame)
    blackSprite: SpriteFrame = null;

    private resultNodes: Node[] = [];
    private maxResults = 8;
    private lastRoundId: number | null = null;
    private highlightAnimation: any = null;
    private isInitialLoad = true;

    @render(gc.RoundHistories.RoundHistoryStore, (store) => {
        console.log('=== Store State Debug ===');
        if (store.histories && store.histories.length > 0) {
            console.log('Latest round - ID:', store.histories[0]?.roundId, 'Result:', store.histories[0]?.result);
        }
        return store.histories;
    })
    updateRoundHistory(histories: gc.RoundHistories.RoundHistory[]) {
        console.log('=== UpdateRoundHistory Called ===');
        
        if (histories && histories.length > 0) {
            console.log('Latest round - ID:', histories[0]?.roundId, 'Result:', histories[0]?.result, 'Type:', typeof histories[0]?.result);
            console.log('First few rounds:', histories.slice(0, 3).map(h => `ID: ${h.roundId}, Result: ${h.result}`));
        }
        
        this.displayHistories(histories);
        this.updateHighlight(histories);
    }

    private displayHistories(histories: gc.RoundHistories.RoundHistory[]) {
        if (!histories || histories.length === 0) {
            this.clearDisplay();
            this.hideHighlight();
            return;
        }

        this.clearDisplay();
        
        const numbers = histories.map(history => history.result as number);
        const numbersToShow = numbers.slice(0, this.maxResults);
        
        numbersToShow.forEach((number, index) => {
            const resultNode = this.createResultNode(number, index);
            if (resultNode) {
                this.resultNodes.push(resultNode);
            }
        });
    }

    private updateHighlight(histories: gc.RoundHistories.RoundHistory[]) {
        const newRound = histories && histories.length > 0 ? histories[0] : null;
        if (!newRound) return;

        const isNewRound = newRound.roundId !== this.lastRoundId;
        
        if (this.isInitialLoad) {
            this.showStaticHighlight();
            this.lastRoundId = newRound.roundId;
            this.isInitialLoad = false;
        } else if (isNewRound) {
            this.showAnimatedHighlight();
            this.lastRoundId = newRound.roundId;
        }
    }

    private createResultNode(number: number, index: number): Node | null {
        if (!this.resultNodePrefab || !this.content) {
            console.error('Missing resultNodePrefab or content node');
            return null;
        }

        const resultNode = instantiate(this.resultNodePrefab);
        resultNode.name = `result-${index + 1}`;
        
        // Set number text
        const txtNode = resultNode.getChildByName('txt');
        const label = txtNode?.getComponent(Label);
        if (label) {
            label.string = number.toString();
        }

        // Set color sprite
        const sprite = resultNode.getComponent(Sprite);
        if (sprite) {
            const isRed = (number !== 0 && RouletteUtils.isRed(number));
            sprite.spriteFrame = isRed ? this.redSprite : this.blackSprite;
        }
        
        this.content.addChild(resultNode);
        return resultNode;
    }

    private showStaticHighlight() {
        if (!this.highlight) return;
        
        this.stopHighlightAnimation();
        this.highlight.active = true;
    }

    private showAnimatedHighlight() {
        if (!this.highlight) return;
        
        this.stopHighlightAnimation();
        this.highlight.active = true;
        this.startHighlightAnimation();
    }

    private startHighlightAnimation() {
        let uiOpacity = this.highlight.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.highlight.addComponent(UIOpacity);
        }
        
        const fadeSequence = tween(uiOpacity)
            .to(0.2, { opacity: 0 })
            .to(0.2, { opacity: 255 })
            .union();
        
        this.highlightAnimation = tween(uiOpacity)
            .repeat(4, fadeSequence)
            .call(() => {
                uiOpacity.opacity = 255;
                this.highlightAnimation = null;
            })
            .start();
    }

    private stopHighlightAnimation() {
        if (this.highlightAnimation) {
            this.highlightAnimation.stop();
            this.highlightAnimation = null;
        }
        
        const uiOpacity = this.highlight?.getComponent(UIOpacity);
        if (uiOpacity) {
            uiOpacity.opacity = 255;
        }
    }

    private hideHighlight() {
        if (this.highlight) {
            this.stopHighlightAnimation();
            this.highlight.active = false;
        }
    }

    private clearDisplay() {
        this.resultNodes.forEach(node => {
            if (node && node.isValid) {
                node.destroy();
            }
        });
        this.resultNodes = [];
    }

    onDestroy() {
        this.clearDisplay();
    }
}


