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
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { SlidingChipHandler } from "../handlers/sliding-chip-handler";
import { SlidingChipStore } from "../stores/sliding-chip-store";

import Chip, { ChipDisplayType } from "./chip";
import { SnapScrollView } from "./snap-scroll-view";

const { render, handle } = Observer;
const { Chips, Rounds, ChipSetting } = gc;

const { ccclass, property } = _decorator;

@ccclass
export default class SlidingChip extends ObserverComponent {
    @property(Node)
    chips: Node = null;

    @property(SpriteAtlas)
    chipAltas: SpriteAtlas = null;

    @property(SnapScrollView)
    snappedScrollView: SnapScrollView = null;

    @property(Node)
    leftButton: Node = null;

    @property(Node)
    rightButton: Node = null;

    @property
    displaySize = 6;

    @property
    movingStep = 1;

    @property(Prefab)
    chipPrefab: Prefab = null;

    @property(SpriteFrame)
    lowValueChipSprite: SpriteFrame = null;

    public chipValues: number[] = [];
    protected smallChipScale = 0.29;
    protected chipList: Node[] = [];
    private disabledBetChips = false;
    protected chipSetting: gc.ChipSetting.TChipSetting;

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
        this.setLeftButtonStatus(false);
        this.snappedScrollView.actionScrollEnded = () => {
            this.updateSelectChip();
        };
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

    private updateArrowVisibility(selectChip: number) {
        this.setLeftButtonStatus(true);
        this.setRightButtonStatus(true);

        if (selectChip <= 0) {
            this.setLeftButtonStatus(false);
        } else if (selectChip >= this.chipList.length - 1) {
            this.setRightButtonStatus(false);
        }
    }

    @handle(SlidingChipHandler.UpdateCurrentBet)
    updateCurrentBet(bet: string) {
        return { bet };
    }

    protected setLeftButtonStatus(isShowLeftArrow: boolean) {
        this.leftButton.active = isShowLeftArrow && !this.disabledBetChips;
    }

    protected setRightButtonStatus(isShowRightArrow: boolean) {
        this.rightButton.active = isShowRightArrow && !this.disabledBetChips;
    }

    @render(SlidingChipStore, (store) => store.currentChip, { fireImmediately: false })
    public setCurrentBet(currentBet: string) {
        this.updateSelectedBet(currentBet);
    }

    protected updateSelectedBet(targetName: string) {
        this.chipList?.forEach((chip) => {
            Tween.stopAllByTarget(chip);
            const highlight = chip.name === targetName;
            this.highlightChip(chip, highlight);
        });
    }

    protected highlightChip(chip: Node, highlight: boolean) {
        if (chip) {
            const activeNode = chip.getChildByName("active");
            activeNode.active = highlight;
            chip.setSiblingIndex(highlight ? this.chipList.length + 1 : 0);
            const scaleChip = highlight ? 1.1 : 1;
            const posY = highlight ? 12 : 0;
            tween(chip)
                .to(0.2, {
                    scale: v3(scaleChip, scaleChip, scaleChip),
                    position: v3(chip.position.x, posY),
                })
                .start();
        }
    }

    @handle(SlidingChipHandler.ClickArrow, (handler, payload: { chipMovingStep: number }) => handler.handlePrev(payload))
    public onPrevious() {
        this.playSoundClick();
        return { chipMovingStep: this.movingStep };
    }

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
        const min = this.snappedScrollView.getMinDisplay();
        if (selectChip <= min) {
            this.snappedScrollView.scrollTo(selectChip);
        } else if (selectChip >= min + this.displaySize - 1) {
            this.snappedScrollView.scrollTo(selectChip - this.displaySize + 2);
        }

        this.handleBet(selectChip);
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
            return chipNode;
        }

        return null;
    }

    public onClickChip(target: Component) {
        this.playSoundClick();
        const bet = target.node.name;
        this.setSelectChip(bet);
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
        this.snappedScrollView.scrollView.scrollToPercentHorizontal(0, 0.1, true);
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
}
