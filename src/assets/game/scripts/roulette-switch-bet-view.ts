import { _decorator, Component, Node, Button, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RouletteSwitchBetView')
export class RouletteSwitchBetView extends Component {
    @property(Node)
    sideBetButton: Node = null;

    @property(Node)
    mainBetButton: Node = null;

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

    // Callback for rearranging UI elements
    public rearrangeIndexCallback = (type: number) => { };

    start() {
        this.initializeUI();
    }

    private initializeUI() {
        // Show main bet by default, hide side bet
        this.sideBetButton.active = true;   // Show side bet button (to switch TO side bet)
        this.mainBetButton.active = false;  // Hide main bet button (already in main bet view)
        this.sideBetNode.active = false;
        this.switchViewBackground.active = false;

        // Store original positions
        this.prevSideBetPosition = this.sideBetNode.position.clone();
        this.prevMainBetPosition = this.mainBetNode.position.clone();

        // Set up button listeners
        this.setupButtonListeners();
    }

    private setupButtonListeners() {
        // Side bet button (switches to side bet)
        const sideBetButtonComp = this.sideBetButton.getComponent(Button);
        if (sideBetButtonComp) {
            sideBetButtonComp.node.on('click', this.switchToSideBet, this);
        }

        // Main bet button (switches to main bet)
        const mainBetButtonComp = this.mainBetButton.getComponent(Button);
        if (mainBetButtonComp) {
            mainBetButtonComp.node.on('click', this.switchToMainBet, this);
        }
    }

    public playAnimationSwitchViewButton() {
        if (!this.mainBetButton || this.isInSideBetView) return;

        const parentNode = this.mainBetButton.parent;
        if (parentNode) {
            // Create repeating scale animation
            tween(parentNode)
                .to(0.8, { scale: new Vec3(1.05, 1.05, 1) }, { easing: 'sineInOut' })
                .to(0.8, { scale: new Vec3(1.0, 1.0, 1) }, { easing: 'sineInOut' })
                .union()
                .repeatForever()
                .tag(1)
                .start();
        }
    }

    public stopAnimationSwitchViewButton() {
        if (!this.mainBetButton) return;

        const parentNode = this.mainBetButton.parent;
        if (parentNode) {
            parentNode.scale = new Vec3(1, 1, 1);
            // Stop animation with tag 1
            tween(parentNode).stop();
        }
    }

    public enableSideBet(enable: boolean) {
        const buttonComp = this.mainBetButton?.getComponent(Button);
        if (buttonComp) {
            buttonComp.interactable = enable;
        }

        // Handle disable sprite (assuming it's the 3rd child)
        if (this.mainBetButton?.parent && this.mainBetButton.parent.children.length > 2) {
            const disableSprite = this.mainBetButton.parent.children[2];
            if (disableSprite) {
                disableSprite.active = !enable;
            }
        }

        if (enable) {
            this.playAnimationSwitchViewButton();
        } else {
            this.stopAnimationSwitchViewButton();
        }
    }

    public switchToSideBet() {
        if (this.isInSideBetView) return;

        this.isInSideBetView = true;
        
        // Play click sound (if audio manager is available)
        // AudioManager.getInstance().playClick();

        // Update button states
        this.sideBetButton.active = false;  // Hide side bet button (already in side bet view)
        this.mainBetButton.active = true;   // Show main bet button (to switch TO main bet)
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
        this.sideBetButton.active = true;   // Show side bet button (to switch TO side bet)
        this.mainBetButton.active = false;  // Hide main bet button (already in main bet view)
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


