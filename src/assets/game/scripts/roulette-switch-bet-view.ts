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

    // Private variables to store original positions
    private prevSideBetPosition = new Vec3();
    private prevMainBetPosition = new Vec3();
    private isInSideBetView = false;
    private currentRoundState = "";
    private currentCountdownTimer = 0;

    // Callback for rearranging UI elements
    public rearrangeIndexCallback = (type: number) => { };

    start() {
        this.initializeUI();
    }

    private initializeUI() {
        // Show main bet by default, hide side bet
        this.toSideBetButton.active = true;   // Show side bet button (to switch TO side bet)
        this.toMainBetButton.active = false;  // Hide main bet button (already in main bet view)
        this.sideBetNode.active = false;
        this.switchViewBackground.active = false;

        // Store original positions
        this.prevSideBetPosition = this.sideBetNode.position.clone();
        this.prevMainBetPosition = this.mainBetNode.position.clone();

        // Set up button listeners
        this.setupButtonListeners();
    }

    private setupButtonListeners() {
        // Side bet button (switches to side bet) - with null checks
        if (this.toSideBetButton) {
            const sideBetButtonComp = this.toSideBetButton.getComponent(Button);
            if (sideBetButtonComp) {
                sideBetButtonComp.node.on('click', this.switchToSideBet, this);
            }
        }

        // Main bet button (switches to main bet) - with null checks
        if (this.toMainBetButton) {
            const mainBetButtonComp = this.toMainBetButton.getComponent(Button);
            if (mainBetButtonComp) {
                mainBetButtonComp.node.on('click', this.switchToMainBet, this);
            }
        }
    }

    /**
     * React to countdown timer changes - same as bet-timer.ts
     * This will help us detect when we're approaching lock time
     */
    @render(RoundTimeStore, (store) => store.countdownTimer)
    onCountdownTimerChanged(time: number) {
        this.currentCountdownTimer = time;
        this.checkLockingTime();
    }

    /**
     * React to round state changes - same as bet-timer.ts  
     * This will tell us the current phase of the game
     */
    @render(RoundTimeStore, (store) => store.roundState)
    onRoundStateChanged(state: string) {
        this.currentRoundState = state;
        this.handleStateChange(state);
    }

    /**
     * React to round time state changes - same as bet-timer.ts
     * This tells us if we're in the active betting period
     */
    @render(RoundTimeStore, (store) => store.isInRoundTime)
    onRoundTimeStateChanged(isInRoundTime: boolean) {
        if (isInRoundTime) {
            // Re-enable side bet switching during betting phase
            this.enableSideBet(true);
        } else {
            // Disable side bet switching when not in round time
            this.enableSideBet(false);
            if (this.isInSideBetView) {
                this.switchToMainBet();
            }
        }
    }

    private checkLockingTime() {
        // Check if we're at or below the locking time (5 seconds from settings.durations.lockingBet)
        if (this.currentCountdownTimer <= settings.durations.lockingBet) {
            // Auto-switch to main bet when reaching lock time
            if (this.isInSideBetView) {
                this.switchToMainBet();
            }
            // Disable side bet switching
            this.enableSideBet(false);
        }
    }

    private handleStateChange(state: string) {
        // Handle different round states
        // You might need to adjust these state names based on your game's actual states
        const lockingStates = ['locking', 'locked', 'spinning', 'settling'];
        const bettingStates = ['betting', 'placingBet', 'accepting'];
        
        if (lockingStates.some(s => state?.toLowerCase().includes(s.toLowerCase()))) {
            // In locking/locked state - switch to main bet and disable
            if (this.isInSideBetView) {
                this.switchToMainBet();
            }
            this.enableSideBet(false);
        } else if (bettingStates.some(s => state?.toLowerCase().includes(s.toLowerCase()))) {
            // In betting state - enable side bet switching
            this.enableSideBet(true);
        }
    }

    public enableSideBet(enable: boolean) {
        // Safer Button component access with null checks
        if (this.toMainBetButton) {
            const buttonComp = this.toMainBetButton.getComponent(Button);
            if (buttonComp) {
                buttonComp.interactable = enable;
            }

            // Handle disable sprite (assuming it's the 3rd child)
            if (this.toMainBetButton.parent && this.toMainBetButton.parent.children.length > 2) {
                const disableSprite = this.toMainBetButton.parent.children[2];
                if (disableSprite) {
                    disableSprite.active = !enable;
                }
            }
        }
    }

    public switchToSideBet() {
        if (this.isInSideBetView) return;

        // Safer Button component access with null checks
        if (!this.toMainBetButton) {
            return;
        }

        const buttonComp = this.toMainBetButton.getComponent(Button);
        if (!buttonComp) {
            return;
        }

        if (!buttonComp.interactable) {
            return; // Don't allow switching if disabled by timer
        }

        // Additional check: don't allow switching if we're in lock time
        if (this.currentCountdownTimer <= settings.durations.lockingBet) {
            return;
        }

        // Additional safety checks for required nodes
        if (!this.sideBetNode || !this.mainBetNode || !this.smallMainBetNode) {
            return;
        }

        this.isInSideBetView = true;
        
        // Play click sound (if audio manager is available)
        // AudioManager.getInstance().playClick();

        // Update button states
        this.toSideBetButton.active = false;  // Hide side bet button (already in side bet view)
        this.toMainBetButton.active = true;   // Show main bet button (to switch TO main bet)
        this.switchViewBackground.active = true;
        this.sideBetNode.active = true;

        // Position side bet node and prepare for animation
        this.sideBetNode.setPosition(this.sideBetNode.position.x, this.smallMainBetNode.position.y, this.sideBetNode.position.z);
        this.sideBetNode.scale = new Vec3(0, 0, 1);

        // Trigger callback for index rearrangement
        this.rearrangeIndexCallback(1);

        // Stop all ongoing animations
        tween(this.sideBetNode).stop();
        tween(this.mainBetNode).stop();

        // Animate side bet node in
        tween(this.sideBetNode)
            .to(0.3, {
                scale: new Vec3(1, 1, 1),
                position: this.prevSideBetPosition
            }, { easing: 'circInOut' })
            .start();

        // Animate main bet node out (scale down and move)
        tween(this.mainBetNode)
            .to(0.3, {
                scale: new Vec3(0.627, 0.627, 1),
                position: this.smallMainBetNode.position
            }, { easing: 'circInOut' })
            .start();
    }

    public switchToMainBet() {
        if (!this.isInSideBetView) return;

        this.isInSideBetView = false;

        // Clear any highlights on the main bet board
        // this.board?.clearHighlight();

        // Play click sound (if audio manager is available)
        // AudioManager.getInstance().playClick();

        // Update button states
        this.toSideBetButton.active = true;   // Show side bet button (to switch TO side bet)
        this.toMainBetButton.active = false;  // Hide main bet button (already in main bet view)
        this.switchViewBackground.active = false;

        // Trigger callback for index rearrangement
        this.rearrangeIndexCallback(0);

        // Stop all ongoing animations
        tween(this.sideBetNode).stop();
        tween(this.mainBetNode).stop();

        // Animate side bet node out
        tween(this.sideBetNode)
            .to(0.3, {
                scale: new Vec3(0, 0, 1),
                position: this.smallMainBetNode.position
            }, { easing: 'circInOut' })
            .start();

        // Animate main bet node back in
        tween(this.mainBetNode)
            .to(0.3, {
                scale: new Vec3(1, 1, 1),
                position: this.prevMainBetPosition
            }, { easing: 'circInOut' })
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


