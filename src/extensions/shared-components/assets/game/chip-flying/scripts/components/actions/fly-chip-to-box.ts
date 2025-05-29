import gc from "@sg/game-client-base";
import { Node, UITransform } from "cc";
import { AroundTablePlayerBet } from "../../../../around-table-player/scripts/components/around-table-player-bet";
import { HiddenPlayersBet } from "../../../../hidden-players/scripts/components/hidden-players-bet";
import SlidingChip from "../../../../sliding-chip/scripts/components/sliding-chip";
import { FlyChipUtils } from "../../../../sliding-chip/scripts/utils/fly-chip-utils";
import { IMainPlayerChip } from "../chip-flying";

type TChips = {
    [value: number]: number;
};

export const placeChipToChipBox = (
    chipContainer: Node,
    slidingChip: SlidingChip,
    mainPlayerChip: IMainPlayerChip,
    startNode: Node,
    onComplete: () => void,
    isHiddenPlayer = false
) => {
    const containerTransform = chipContainer.getComponent(UITransform);
    const { chipBox, chipValue } = mainPlayerChip;
    const chipBoxTransform = chipBox.getComponent(UITransform);
    const flyingDuration = startNode === null ? SlidingChip.mainPlayerChipFlyingTime : SlidingChip.chipFlyingTime;
    const chipPosition = containerTransform.convertToNodeSpaceAR(slidingChip.createStartNodeInfo(startNode, chipValue).worldPos);
    const chipNode = slidingChip.createSmallChip(chipValue);
    chipNode.position = chipPosition;
    const randomPosition = containerTransform.convertToNodeSpaceAR(
        chipBoxTransform.convertToWorldSpaceAR(FlyChipUtils.getRandomPositionChip(chipNode, chipBox))
    );

    chipContainer.addChild(chipNode);

    if (!chipNode.activeInHierarchy) {
        chipNode.position = randomPosition;
    } else {
        chipNode && FlyChipUtils.moveChipTo(chipNode, randomPosition, flyingDuration, onComplete);
        handleAnimWhenPlayerBet(isHiddenPlayer, startNode);
    }

    return chipNode;
};

const handleAnimWhenPlayerBet = (isHiddenPlayer: boolean, startNode: Node) => {
    if (startNode) {
        if (isHiddenPlayer) {
            startNode.getComponent(HiddenPlayersBet).animScaleOut();
            return;
        }
        startNode?.parent?.getComponent(AroundTablePlayerBet)?.animMoveBet();
    }
};

export const addChipsToChipBoxWhenJoinRoom = (
    chipContainer: Node,
    chipBox: Node,
    chipGroup: gc.Chips.IChipGroup,
    slidingChip: SlidingChip
) => {
    if (!chipGroup) {
        return [];
    }

    const chipNodes = [];
    const chipValues = Object.keys(chipGroup);
    chipValues.forEach((chipValue) => {
        const chipCountOfBet = chipGroup[chipValue];
        const convertValues = getChipQuantity(+chipValue, slidingChip.chipValues);
        for (let i = 0; i < chipCountOfBet; i++) {
            const nodes = addChipsByChipsData(slidingChip, convertValues, chipBox, chipContainer);
            chipNodes.push(...nodes);
        }
    });
    return chipNodes;
};

export const getChipQuantity = (bet: number, options: number[]): TChips => {
    const list = [...options].reverse();
    const chipValue = calculateChipValue(list, bet);
    const chips = chipValue.chips;

    if (chipValue.chipTotal > 0) {
        chips[0] = 1;
    }

    return chips;
};

const calculateChipValue = (list: number[], total: number) => {
    const chips = {};
    let chipTotal = total;
    list.forEach((value) => {
        const count = Math.floor(chipTotal / value);
        chips[value] = count;
        chipTotal = chipTotal % value;
    });

    return { chips, chipTotal };
};

const addChipsByChipsData = (slidingChip: SlidingChip, chips: TChips, chipsBox: Node, chipContainer: Node) => {
    const chipNodes = [];
    Object.keys(chips).forEach((chipValue) => {
        const count = chips[chipValue];
        const containerTransform = chipContainer.getComponent(UITransform);
        const chipBoxTransform = chipsBox.getComponent(UITransform);
        for (let i = 0; i < count; i++) {
            const chip = slidingChip.createSmallChip(+chipValue);
            const chipBoxLocalPosition = FlyChipUtils.getRandomPositionChip(chip, chipsBox);
            chip.position = containerTransform.convertToNodeSpaceAR(chipBoxTransform.convertToWorldSpaceAR(chipBoxLocalPosition));
            chipContainer.addChild(chip);
            chipNodes.push(chip);
        }
    });

    return chipNodes;
};
