import gc from "@sg/game-client-base";
import { Node, UITransform, instantiate } from "cc";
import BetItem from "../../../../bets/scripts/components/bet-item";
import SlidingChip from "../../../../sliding-chip/scripts/components/sliding-chip";
import { FlyChipUtils } from "../../../../sliding-chip/scripts/utils";
import { ChipFlying, IChipFlyingInfo } from "../chip-flying";

export namespace ActionChipFlying {
    export const dealerGetChips = (dealerChipBox: Node, lostBetItems: BetItem[], chipFlying: ChipFlying) => {
        lostBetItems.forEach((item: BetItem) => {
            const chipNodes = chipFlying.getChipsByChoice(item.betChoice);
            moveChips(chipFlying.chipContainer, chipNodes, dealerChipBox);
        });
    };

    const moveChips = (chipContainer: Node, chipNodes: Node[], destBox: Node) => {
        const chipContainerTransform = chipContainer.getComponent(UITransform);
        const destBoxPosition = destBox.parent.getComponent(UITransform).convertToWorldSpaceAR(destBox.position);
        const destBoxInChipBoxSpacePosition = chipContainerTransform.convertToNodeSpaceAR(destBoxPosition);

        chipNodes.forEach((chip: Node) => {
            FlyChipUtils.moveChipThenDestroy(chip, destBoxInChipBoxSpacePosition, SlidingChip.chipFlyingTime);
        });
    };

    export const dealerPayChips = (dealerChipBox: Node, winBetItems: BetItem[], chipFlying: ChipFlying) => {
        const chipContainer = chipFlying.chipContainer.getComponent(UITransform);
        winBetItems?.forEach((item: BetItem) => {
            const chipNodes = chipFlying.getChipsByChoice(item.betChoice);
            const payChips = payChipsToWinningBetItem(item.chipBox, dealerChipBox, chipContainer, chipNodes);
            chipFlying.addChipsToBoxWithChoice(payChips, item.betChoice);
        });
    };

    const payChipsToWinningBetItem = (chipBox: Node, dealerChipBox: Node, chipContainer: UITransform, chipNodes: Node[]) => {
        const dealerBoxPosition = dealerChipBox.parent.getComponent(UITransform).convertToWorldSpaceAR(dealerChipBox.position);
        const dealerBoxInChipBoxSpacePosition = chipContainer.convertToNodeSpaceAR(dealerBoxPosition);

        const chipBoxTransform = chipBox.getComponent(UITransform);
        const cloneChipNodes = [];
        chipNodes.forEach((chip: Node) => {
            const cloneChip = instantiate(chip);
            cloneChip.position = dealerBoxInChipBoxSpacePosition;
            chipContainer.node.addChild(cloneChip);

            const randomPosition = chipContainer.convertToNodeSpaceAR(
                chipBoxTransform.convertToWorldSpaceAR(FlyChipUtils.getRandomPositionChip(cloneChip, chipBox))
            );

            FlyChipUtils.moveChipTo(cloneChip, randomPosition, SlidingChip.chipFlyingTime);
            cloneChipNodes.push(cloneChip);
        });
        return cloneChipNodes;
    };

    export const payChipsToMainPlayer = (
        settleStatus: gc.GameServiceMessage.Status,
        chipFlyingInfo: IChipFlyingInfo,
        winBetItems: BetItem[],
        chipFlying: ChipFlying
    ) => {
        const isHiddenPlayers = chipFlyingInfo?.hiddenPlayersNode !== null;

        if (settleStatus?.win) {
            if (isHiddenPlayers) {
                moveChipWithRandomAmountToMainPlayer(settleStatus, chipFlyingInfo, winBetItems, chipFlying);
            } else {
                moveChipWithAmountToMainPlayer(settleStatus, chipFlyingInfo, winBetItems, chipFlying);
            }
        }
    };

    const moveChipWithRandomAmountToMainPlayer = (
        settleStatus: gc.GameServiceMessage.Status,
        chipFlyingInfo: IChipFlyingInfo,
        winBetItems: BetItem[],
        chipFlying: ChipFlying
    ) => {
        const { payChipsDuration, mainPlayerAvatarNode } = chipFlyingInfo;

        if (!mainPlayerAvatarNode) {
            return;
        }

        winBetItems?.forEach((item: BetItem) => {
            if (settleStatus?.winningByChoices[item.betChoice] > 0) {
                const chipNodes = chipFlying.getChipsByChoice(item.betChoice);
                chipFlying.moveChipsWithRandomAmount(chipNodes, mainPlayerAvatarNode, payChipsDuration);
            }
        });
    };

    const moveChipWithAmountToMainPlayer = (
        settleStatus: gc.GameServiceMessage.Status,
        chipFlyingInfo: IChipFlyingInfo,
        winBetItems: BetItem[],
        chipFlying: ChipFlying
    ) => {
        const { mainPlayerAvatarNode } = chipFlyingInfo;

        if (!mainPlayerAvatarNode) {
            return;
        }

        winBetItems?.forEach((item: BetItem) => {
            if (settleStatus?.winningByChoices[item.betChoice]) {
                const chipNodes = chipFlying.getChipsByChoice(item.betChoice);
                moveChips(chipFlying.chipContainer, chipNodes, mainPlayerAvatarNode);
            }
        });
    };

    export const payChipsToHiddenPlayers = (hiddenPlayersNode: Node, winBetItems: BetItem[], chipFlying: ChipFlying) => {
        if (!hiddenPlayersNode) {
            return;
        }

        winBetItems?.forEach((item: BetItem) => {
            const chipNodes = chipFlying.getChipsByChoice(item.betChoice);
            moveChips(chipFlying.chipContainer, chipNodes, hiddenPlayersNode);
        });
    };
}
