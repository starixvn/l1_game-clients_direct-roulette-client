import { _decorator, Component, Node, Sprite, SpriteFrame, tween, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('RouletteNumber')
export class RouletteNumber extends Component {
    @property(Node)
    highlight: Node = null;

    @property(Node)
    winning: Node = null;

    private originFrame: SpriteFrame;
    private highlightTween: any = null;
    private winningTween: any = null;

    onLoad() {
        if (this.winning) {
            this.originFrame = this.winning.getComponent(Sprite).spriteFrame;
        }
        this.clearHighlight();
        this.hideWinning();
    }

    public clearHighlight() {
        if (this.highlightTween) {
            this.highlightTween.stop();
        }
        
        let highlightOpacity = this.highlight.getComponent(UIOpacity);
        if (!highlightOpacity) {
            highlightOpacity = this.highlight.addComponent(UIOpacity);
        }
        
        this.highlightTween = tween(highlightOpacity)
            .to(0.1, { opacity: 0 })
            .start();
    }

    public showHighlight() {
        if (this.highlightTween) {
            this.highlightTween.stop();
        }
        
        let highlightOpacity = this.highlight.getComponent(UIOpacity);
        if (!highlightOpacity) {
            highlightOpacity = this.highlight.addComponent(UIOpacity);
        }
        
        this.highlightTween = tween(highlightOpacity)
            .to(0.11, { opacity: 255 })
            .start();
    }

    public showWinning(animated: boolean) {
        if (this.winning) {
            this.winning.active = animated;
        }

        const sprite = this.winning.getComponent(Sprite);
        sprite.spriteFrame = this.originFrame;
        if (animated) {
            const winningOpacity = this.winning.getComponent(UIOpacity);
            this.winningTween = tween(winningOpacity)
                .repeatForever(
                    tween()
                        .to(0.2, { opacity: 0 })
                        .to(0.2, { opacity: 255 })
                )
                .start();
            
            // Stop the animation after some time
            setTimeout(() => {
                if (this.winningTween) {
                    this.winningTween.stop();
                    winningOpacity.opacity = 0;
                    sprite.spriteFrame = this.originFrame;
                }
            }, 8000); // 20 cycles * 0.4s per cycle = 8 seconds
        }
    }

    public hideWinning() {
        if (this.winning) {
            this.winning.active = false;
        }
        if (this.winningTween) {
            this.winningTween.stop();
        }
    }
}


