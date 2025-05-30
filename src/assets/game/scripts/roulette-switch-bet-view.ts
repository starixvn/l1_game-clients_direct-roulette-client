import { _decorator, Component, Node, Button, tween, Vec3 } from 'cc';
import gc from "@sg/game-client-base";
import Observer from "observer";
import { settings } from "./game-settings";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass('RouletteSwitchBetView')
@observer(settings.name)
export class RouletteSwitchBetView extends Component {
    @property(Node)
    toSideBetButton: Node = null;

    @property(Node)
    toMainBetButton: Node = null;

    @property(Node)
    sideBetNode: Node = null;

    @property(Node)
    mainBetNode: Node = null;

    @property(Node)
    smallMainBetNode: Node = null;

    @property(Node)
    switchViewBackground: Node = null;

    // Private variables
    private prevSideBetPosition = new Vec3();
    private prevMainBetPosition = new Vec3();
    private isInSideBetView = false;

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    // Callback for rearranging UI elements
    public rearrangeIndexCallback = (type: number) => { };

    start() {
        this.initializeUI();
        this.setupButtonListeners();
    }

    private initializeUI() {
        // Show main bet by default, hide side bet
        this.updateButtonVisibility(false);
        this.sideBetNode.active = false;
        this.switchViewBackground.active = false;

        // Store original positions
        this.prevSideBetPosition = this.sideBetNode.position.clone();
        this.prevMainBetPosition = this.mainBetNode.position.clone();
    }

    private setupButtonListeners() {
        this.setupButtonListener(this.toSideBetButton, this.switchToSideBet);
        this.setupButtonListener(this.toMainBetButton, this.switchToMainBet);
    }

    private setupButtonListener(buttonNode: Node, callback: () => void) {
        if (buttonNode) {
            const buttonComp = buttonNode.getComponent(Button);
            if (buttonComp) {
                buttonComp.node.on('click', callback, this);
            }
        }
    }

    private updateButtonVisibility(showSideBetView: boolean) {
        this.toSideBetButton.active = !showSideBetView;
        this.toMainBetButton.active = showSideBetView;
    }

    /**
     * Centralized betting state management using timer-based logic
     * Matches the RouletteTimeHandler and GameBaseTimeHandler pattern exactly
     */
    @render(RoundTimeStore, (store) => ({ 
        countdownTimer: store.countdownTimer, 
        isInRoundTime: store.isInRoundTime
    }))
    onBettingStateChanged({ countdownTimer, isInRoundTime }: { 
        countdownTimer: number, 
        isInRoundTime: boolean
    }) {
        const isBettingAllowed = this.isBettingAllowed(countdownTimer, isInRoundTime);
        
        // Auto-switch to main bet when betting becomes disabled
        if (!isBettingAllowed && this.isInSideBetView) {
            this.switchToMainBet();
        }
        
        // Update button interactability
        this.enableSideBet(isBettingAllowed);
    }

    /**
     * Centralized logic to determine if betting is allowed
     * Uses the same timer-based logic as GameBaseTimeHandler and RouletteTimeHandler
     */
    private isBettingAllowed(countdownTimer: number, isInRoundTime: boolean): boolean {
        // Timer constraint: Same as GameBaseTimeHandler.isInLockBetTime
        // This matches RouletteTimeHandler's handleAtLockBetTime/handleInLockBetTime logic
        if (countdownTimer <= settings.durations.lockingBet) {
            return false;
        }

        // Round time constraint: Same as GameBaseTimeHandler.isInRoundTime
        if (!isInRoundTime) {
            return false;
        }

        return true;
    }

    private enableSideBet(enable: boolean) {
        if (this.toMainBetButton) {
            const buttonComp = this.toMainBetButton.getComponent(Button);
            if (buttonComp) {
                buttonComp.interactable = enable;
            }

            // Handle disable sprite
            this.toggleDisableSprite(this.toMainBetButton, !enable);
        }
    }

    private toggleDisableSprite(buttonNode: Node, show: boolean) {
        if (buttonNode.parent && buttonNode.parent.children.length > 2) {
            const disableSprite = buttonNode.parent.children[2];
            if (disableSprite) {
                disableSprite.active = show;
            }
        }
    }

    private canSwitchToSideBet(): boolean {
        // Validate required nodes
        if (!this.toMainBetButton || !this.sideBetNode || !this.mainBetNode || !this.smallMainBetNode) {
            return false;
        }

        // Check button interactability
        const buttonComp = this.toMainBetButton.getComponent(Button);
        return buttonComp?.interactable === true;
    }

    public switchToSideBet() {
        if (this.isInSideBetView || !this.canSwitchToSideBet()) {
            return;
        }

        // Play click sound
        this.playSoundClick();

        this.isInSideBetView = true;
        this.updateButtonVisibility(true);
        this.switchViewBackground.active = true;
        this.sideBetNode.active = true;

        // Setup and animate
        this.setupSideBetAnimation();
        this.rearrangeIndexCallback(1);
    }

    public switchToMainBet() {
        if (!this.isInSideBetView) return;

        // Play click sound
        this.playSoundClick();

        this.isInSideBetView = false;
        this.updateButtonVisibility(false);
        this.switchViewBackground.active = false;

        // Setup and animate
        this.setupMainBetAnimation();
        this.rearrangeIndexCallback(0);
    }

    private setupSideBetAnimation() {
        // Position and prepare for animation
        this.sideBetNode.setPosition(
            this.sideBetNode.position.x, 
            this.smallMainBetNode.position.y, 
            this.sideBetNode.position.z
        );
        this.sideBetNode.scale = new Vec3(0, 0, 1);

        // Stop ongoing animations and start new ones
        this.stopAllAnimations();
        this.animateNodeTransition(
            this.sideBetNode,
            { scale: new Vec3(1, 1, 1), position: this.prevSideBetPosition }
        );
        this.animateNodeTransition(
            this.mainBetNode,
            { scale: new Vec3(0.627, 0.627, 1), position: this.smallMainBetNode.position }
        );
    }

    private setupMainBetAnimation() {
        this.stopAllAnimations();
        this.animateNodeTransition(
            this.sideBetNode,
            { scale: new Vec3(0, 0, 1), position: this.smallMainBetNode.position }
        );
        this.animateNodeTransition(
            this.mainBetNode,
            { scale: new Vec3(1, 1, 1), position: this.prevMainBetPosition }
        );
    }

    private stopAllAnimations() {
        tween(this.sideBetNode).stop();
        tween(this.mainBetNode).stop();
    }

    private animateNodeTransition(node: Node, target: { scale?: Vec3, position?: Vec3 }) {
        tween(node)
            .to(0.3, target, { easing: 'circInOut' })
            .start();
    }

    // Getter for current view state
    public get isShowingSideBet(): boolean {
        return this.isInSideBetView;
    }

    // Method to force switch to a specific view
    public setView(showSideBet: boolean) {
        if (showSideBet && !this.isInSideBetView) {
            this.switchToSideBet();
        } else if (!showSideBet && this.isInSideBetView) {
            this.switchToMainBet();
        }
    }
}


