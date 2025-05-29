import gc from "@sg/game-client-base";
import {
    Color,
    Component,
    Layers,
    Layout,
    Node,
    Prefab,
    Sprite,
    SpriteAtlas,
    SpriteFrame,
    Tween,
    UITransform,
    Vec3,
    _decorator,
    instantiate,
    tween,
    v3,
} from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { ExpandableNode } from "db://shared-components/shared/common-components/expandable-node/scripts/expandable-node";
import { SlidingChipHandler } from "db://shared-components/game/sliding-chip/scripts/handlers/sliding-chip-handler";
import { SlidingChipStore } from "db://shared-components/game/sliding-chip/scripts/stores/sliding-chip-store";
import Chip, { ChipDisplayType } from "db://shared-components/game/sliding-chip/scripts/components/chip";
import { VerticalSnapScrollView } from "./vertical-snap-scroll-view";

const { render, handle } = Observer;
const { Chips, Rounds, ChipSetting } = gc;

const { ccclass, property } = _decorator;

@ccclass
export default class VerticalSlidingChip extends ObserverComponent {
    @property(Node)
    chips: Node = null;

    @property(SpriteAtlas)
    chipAltas: SpriteAtlas = null;

    @property(VerticalSnapScrollView)
    snappedScrollView: VerticalSnapScrollView = null;

    @property(Node)
    topButton: Node = null;

    @property(Node)
    bottomButton: Node = null;

    @property(Node)
    currentChipDisplay: Node = null;

    @property(ExpandableNode)
    expandableNode: ExpandableNode = null;

    @property
    displaySize = 3; // Reduced for vertical display

    @property
    movingStep = 1;

    @property(Prefab)
    chipPrefab: Prefab = null;

    @property(SpriteFrame)
    lowValueChipSprite: SpriteFrame = null;

    @property
    autoCollapseOnSelect = false; // New property to control collapse behavior

    public chipValues: number[] = [];
    protected smallChipScale = 0.29;
    protected chipList: Node[] = [];
    private disabledBetChips = false;
    protected chipSetting: gc.ChipSetting.TChipSetting;
    private isExpanded = false;

    static chipFlyingTime = 0.8;
    static mainPlayerChipFlyingTime = 0.5;
    private currentSelectChip = 0;
    private isCreatedChips = false;

    setDisabledBetChips(status: boolean) {
        this.disabledBetChips = status;
    }

    onLoad() {
        super.onLoad();
        this.handleFirstLoad();
    }

    handleFirstLoad() {
        // Start collapsed
        this.isExpanded = false;
        this.expandableNode?.collapse(false);
        
        // Hide arrows initially (vertical doesn't need them)
        this.setTopButtonStatus(false);
        this.setBottomButtonStatus(false);
        
        this.snappedScrollView.actionScrollEnded = () => {
            this.updateSelectChip();
        };

        // Spacing and padding are now controlled by VerticalSnapScrollView properties

        // Set up current chip display click handler
        if (this.currentChipDisplay) {
            this.currentChipDisplay.on("click", this.onToggleExpansion.bind(this));
        }
    }

    getReady() {
        return this.chipSetting && this.isCreatedChips;
    }

    @handle(SlidingChipHandler.UpdateSelectChip)
    updateSelectChip() {
        return {
            displayMin: this.snappedScrollView.getMinDisplay(),
            displaySize: this.displaySize,
        };
    }

    // Override arrow visibility for vertical behavior
    private updateArrowVisibility(selectChip: number) {
        this.setTopButtonStatus(true);
        this.setBottomButtonStatus(true);

        if (selectChip >= this.chipList.length - 1) {
            this.setTopButtonStatus(false); // Hide top button when at end (can't go to next)
        } 
        if (selectChip <= 0) {
            this.setBottomButtonStatus(false); // Hide bottom button when at start (can't go to previous)
        }
    }

    @handle(SlidingChipHandler.UpdateCurrentBet)
    updateCurrentBet(bet: string) {
        return { bet };
    }

    // For vertical: top = up, bottom = down
    protected setTopButtonStatus(isShowUpArrow: boolean) {
        this.topButton.active = isShowUpArrow && !this.disabledBetChips;
    }

    protected setBottomButtonStatus(isShowDownArrow: boolean) {
        this.bottomButton.active = isShowDownArrow && !this.disabledBetChips;
    }

    @render(SlidingChipStore, (store) => store.currentChip, { fireImmediately: false })
    public setCurrentBet(currentBet: string) {
        this.updateSelectedBet(currentBet);
        this.updateCurrentChipDisplay(currentBet);
    }

    protected updateSelectedBet(targetName: string) {
        this.chipList?.forEach((chip) => {
            Tween.stopAllByTarget(chip);
            const highlight = chip.name === targetName;
            this.highlightChip(chip, highlight);
        });
    }

    // Adjust highlight for vertical layout
    protected highlightChip(chip: Node, highlight: boolean) {
        if (chip) {
            const activeNode = chip.getChildByName("active");
            if (activeNode) {
                activeNode.active = highlight;
            }
            chip.setSiblingIndex(highlight ? this.chipList.length + 1 : 0);
            const scaleChip = highlight ? 1.1 : 1;
            tween(chip)
                .to(0.2, {
                    scale: v3(scaleChip, scaleChip, scaleChip),
                })
                .start();
        }
    }

    // For vertical: Bottom button = scroll to previous chips (lower indices/values)
    @handle(SlidingChipHandler.ClickArrow, (handler, payload: { chipMovingStep: number }) => handler.handlePrev(payload))
    public onPrevious() {
        this.playSoundClick();
        return { chipMovingStep: this.movingStep };
    }

    // For vertical: Top button = scroll to next chips (higher indices/values)
    @handle(SlidingChipHandler.ClickArrow, (handler, payload: { chipMovingStep: number }) => handler.handleNext(payload))
    public onNext() {
        this.playSoundClick();
        return { chipMovingStep: this.movingStep };
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @render(SlidingChipStore, (store) => store.selectChip)
    scrollToSelectedIndex(selectChip: number) {
        this.currentSelectChip = selectChip;
        this.updateArrowVisibility(selectChip);
        
        // Always handle the bet selection
        this.handleBet(selectChip);
        
        // Always scroll to keep selected chip visible, regardless of expansion state
        const min = this.snappedScrollView.getMinDisplay();
        if (selectChip <= min) {
            this.snappedScrollView.scrollTo(selectChip);
        } else if (selectChip >= min + this.displaySize - 1) {
            this.snappedScrollView.scrollTo(selectChip - this.displaySize + 2);
        }
    }

    private handleBet(selectChip: number) {
        if (this.chipList.length === 0) {
            return;
        }
        const bet = this.chipList[selectChip]?.name;
        if (bet) {
            this.updateCurrentBet(bet);
        }
    }

    @handle(gc.PlayerSelections.PlayerSelectionHandlers.ChipHandlers)
    updatePlayerSelectionChip(selectChip: number) {
        return selectChip;
    }

    private getChipDisplayType(index: number) {
        return index > this.chipValues.length - 3 ? ChipDisplayType.VIP : ChipDisplayType.Normal;
    }

    @render(ChipSetting.ChipSettingStore, (store) => store.chipSetting)
    updateChipSetting(chipSetting: gc.ChipSetting.TChipSetting) {
        this.chipSetting = chipSetting;
    }

    getChipColor(value: number): Color {
        const hexStr = this.chipSetting[value];
        const color: Color = new Color(0, 0, 0, 255);
        if (!hexStr) {
            console.error(`Missing color for chip ${value}`);
            Color.fromHEX(color, this.chipSetting[0]);
            return color;
        }

        Color.fromHEX(color, hexStr);
        return color;
    }

    @handle(SlidingChipHandler.CreateChips)
    createChips() {
        this.destroyChips();
        this.chipList = this.chipValues.map((value) => this.createChipNode(value)).filter((node) => node !== null);

        this.chipList.forEach((node) => {
            this.chips.addChild(node);
            node.on("click", this.onClickChip.bind(this));
        });

        const layout = this.chips.getComponent(Layout);
        if (layout) {
            layout.enabled = true;
            layout.updateLayout();
            layout.enabled = false;
        }

        this.chipList.length > 0 && this.restoreChipState();

        return { chipsLength: this.chipList.length };
    }

    protected restoreChipState() {
        this.scrollToSelectedIndex(this.currentSelectChip);
        this.highlightChip(this.chipList?.[this.currentSelectChip], true);
        this.updateCurrentChipDisplay(this.chipList?.[this.currentSelectChip]?.name || "0");
    }

    protected destroyChips() {
        this.chipList?.forEach((chip) => chip.destroy());
        this.chips.removeAllChildren();
        this.chipList = [];
    }

    private createChipNode(value: number): Node {
        return this.createBigChip(value);
    }

    private createBigChip(value: number): Node {
        const chipNode = instantiate(this.chipPrefab);
        if (chipNode) {
            const chip = chipNode.getComponent(Chip);
            chip.setColor(this.getChipColor(value));
            chip.setValue(value);
            const index = this.chipValues.findIndex((chipValue) => chipValue === +value);
            chip.setType(this.getChipDisplayType(index));
            // Note: chip.setValue() should automatically set the node name
            // but let's ensure it matches the original behavior
            chipNode.name = value.toString();
            return chipNode;
        }

        return null;
    }

    public onClickChip(target: Component) {
        this.playSoundClick();
        const bet = target.node.name;
        this.setSelectChip(bet);
        
        // Auto-collapse behavior (optional)
        if (this.autoCollapseOnSelect) {
            this.collapse();
        }
    }

    @handle(SlidingChipHandler.SetSelectChip)
    protected setSelectChip(bet: string) {
        let index = 0;
        for (; index < this.chipList.length; index++) {
            if (this.chipList[index].name === bet) {
                break;
            }
        }

        this.updatePlayerSelectionChip(index);
        return { selectedChip: index };
    }

    @render(SlidingChipStore, (store) => store.isResetScrollViewOffset)
    needResetScrollViewOffset() {
        // For vertical, use scrollToPercentVertical instead
        this.snappedScrollView.scrollView.scrollToPercentVertical(0, 0.1, true);
    }

    @render(Chips.ChipStore, (store) => store.chipValuesByStakeLevel, { fireImmediately: false })
    updateChipValues(chipValuesByStakeLevel: number[]) {
        // init
        this.chipValues = chipValuesByStakeLevel;
        this.createChips();
        this.updateChips();
        this.isCreatedChips = true;
    }

    @handle(SlidingChipHandler.UpdateChips)
    updateChips() {
        this.snappedScrollView.initCalculatedPercent();
        this.snappedScrollView.scrollTo(this.currentSelectChip);
    }

    public createSmallChip(bet: number, scale = 0.29, showValue = false): Node {
        if (bet === 0) {
            const node = this.createLowValueChip();
            node.angle = random(0, 360);
            node.scale = v3(this.smallChipScale, this.smallChipScale, this.smallChipScale);

            return node;
        }
        const chip = this.createBigChip(bet);
        if (chip) {
            const chipView = chip.getComponent(Chip);
            chipView.handleSmallChip(showValue);
            chip.scale = v3(scale, scale, scale);
        }

        return chip;
    }

    protected createLowValueChip() {
        const node = new Node();
        node.layer = Layers.Enum.UI_2D;
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.RAW;
        sprite.trim = false;
        sprite.spriteFrame = this.lowValueChipSprite;

        return node;
    }

    public createStartNodeInfo(startNode: Node, bet: number) {
        let worldPos: Vec3;
        let node = startNode;
        if (startNode) {
            worldPos = startNode.parent.getComponent(UITransform).convertToWorldSpaceAR(startNode.position);
        } else {
            let chip = this.getChipNode(bet);
            if (!chip) {
                const chips = this.chips.children.filter((child) => +child.name < bet).sort((b, a) => +a.name - +b.name);
                chip = chips[0];
            }
            const localPosition = v3(0, chip.getComponent(UITransform).height / 2, 0).add(chip.position);
            worldPos = chip.parent.getComponent(UITransform).convertToWorldSpaceAR(localPosition);
            node = this.node;
        }

        return { node, worldPos };
    }

    private getChipNode(bet: number): Node {
        return this.chips?.children?.find((child) => child.name === bet.toString());
    }

    // NEW VERTICAL-SPECIFIC METHODS

    /**
     * Toggle expansion/collapse of the chip list
     */
    public onToggleExpansion() {
        this.playSoundClick();
        this.isExpanded = !this.isExpanded;
        
        if (this.isExpanded) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    /**
     * Expand the chip list
     */
    public expand() {
        this.isExpanded = true;
        this.expandableNode?.expand();
        this.updateArrowVisibility(this.currentSelectChip);
    }

    /**
     * Collapse the chip list
     */
    public collapse() {
        this.isExpanded = false;
        this.expandableNode?.collapse();
        this.updateArrowVisibility(this.currentSelectChip);
    }

    /**
     * Update the current chip display to show the selected chip
     */
    private updateCurrentChipDisplay(chipValue: string) {
        if (!this.currentChipDisplay || !chipValue) return;

        const value = parseInt(chipValue);
        const chipComponent = this.currentChipDisplay.getComponent(Chip);
        
        if (chipComponent) {
            chipComponent.setColor(this.getChipColor(value));
            chipComponent.setValue(value);
            const index = this.chipValues.findIndex((v) => v === value);
            chipComponent.setType(this.getChipDisplayType(index));
        }
    }

    /**
     * Get the current expansion state
     */
    public getIsExpanded(): boolean {
        return this.isExpanded;
    }

    /**
     * Set expansion state programmatically
     */
    public setExpanded(expanded: boolean) {
        if (expanded !== this.isExpanded) {
            this.onToggleExpansion();
        }
    }
}