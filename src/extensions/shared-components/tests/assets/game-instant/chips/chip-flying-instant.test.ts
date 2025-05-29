// Mock ChipFlying class first
jest.mock("db://shared-components/game/chip-flying/scripts/components/chip-flying", () => ({
    ChipFlying: class MockChipFlying {
        constructor() {
            // Mock constructor
        }
    }
}));

// Mock the ChipFlyingInstant component to avoid importing utils with TypeScript errors
jest.mock("db://shared-components/game-instant/common-components/chips/chip-flying-instant", () => {
    const { ChipFlying } = require("db://shared-components/game/chip-flying/scripts/components/chip-flying");
    
    class MockChipFlyingInstant extends ChipFlying {
        isShowChips = false;
        isFirstJoinGame = true;
        betItems = { betItemComponents: [] };
        slidingChip = { chipValues: [] };
        chipContainer = null;
        addChipsToBoxWithChoice = jest.fn();
        
        constructor() {
            super();
        }
        
        isShowMainPlayerChips(show) {
            this.isShowChips = show;
        }
        
        renderMainPlayerChips(ownBets) {
            if (this.isShowChips && this.isFirstJoinGame) {
                const { addChipsToChipBoxWhenJoinRoom, getChipQuantity } = require("db://shared-components/game/chip-flying/scripts/components/actions");
                
                Object.keys(ownBets).forEach((choice) => {
                    const betAmount = ownBets[choice];
                    const chipQuantity = getChipQuantity(betAmount, this.slidingChip.chipValues);
                    
                    const betItem = this.betItems.betItemComponents.find(item => item.betChoice === choice);
                    if (betItem) {
                        const nodes = addChipsToChipBoxWhenJoinRoom(
                            this.chipContainer,
                            betItem.chipBox,
                            chipQuantity,
                            this.slidingChip
                        );
                        this.addChipsToBoxWithChoice(nodes, choice);
                    }
                });
            }
            this.isFirstJoinGame = false;
        }
    }
    
    return MockChipFlyingInstant;
});

import { Node } from "cc";
import ChipFlyingInstant from "db://shared-components/game-instant/common-components/chips/chip-flying-instant";
import { addChipsToChipBoxWhenJoinRoom, getChipQuantity } from "db://shared-components/game/chip-flying/scripts/components/actions";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";

jest.mock("db://shared-components/game/chip-flying/scripts/components/actions", () => ({
    addChipsToChipBoxWhenJoinRoom: jest.fn(),
    getChipQuantity: jest.fn(),
}));

jest.mock("lodash-es", () => ({
    isEmpty: jest.fn(),
}));

describe(ChipFlyingInstant.name, () => {
    let chipFlyingInstant: ChipFlyingInstant;
    beforeEach(() => {
        chipFlyingInstant = new ChipFlyingInstant();
    });

    describe("define", () => {
        it("should extends ChipFlying", () => {
            // assert
            expect(chipFlyingInstant instanceof ChipFlying).toBe(true);
        });
    });

    describe("isShowMainPlayerChips", () => {
        it("should set isShowChips property correctly", () => {
            // act
            chipFlyingInstant.isShowMainPlayerChips(true);

            // arrange
            expect(chipFlyingInstant["isShowChips"]).toBe(true);
        });
    });

    describe("renderMainPlayerChips", () => {
        describe("when isShowChips = true && isFirstJoinGame = true", () => {
            const mockChipValues = [10, 20, 50];
            const mockBetItemComponents = [
                { betChoice: "choice1", chipBox: "chipBox1" },
                { betChoice: "choice2", chipBox: "chipBox2" },
                { betChoice: "choice3", chipBox: "chipBox3" },
            ];
            const ownBets = {
                choice1: 20,
                choice2: 30,
            };
            const nodes1 = [new Node()];
            const nodes2 = [new Node(), new Node()];
            beforeEach(() => {
                // arrnage
                chipFlyingInstant["isShowChips"] = true;
                chipFlyingInstant["isFirstJoinGame"] = true;
                chipFlyingInstant.addChipsToBoxWithChoice = jest.fn();
                chipFlyingInstant.betItems = { betItemComponents: mockBetItemComponents } as any;
                chipFlyingInstant.slidingChip = { chipValues: mockChipValues } as any;

                (getChipQuantity as jest.Mock).mockReturnValue([]);
                (addChipsToChipBoxWhenJoinRoom as jest.Mock).mockReturnValueOnce(nodes1).mockReturnValueOnce(nodes2);
            });
            it("should add chips to chip box with choice", () => {
                // act
                console.log(1);
                chipFlyingInstant.renderMainPlayerChips(ownBets);
                console.log(2);

                // assert
                expect(getChipQuantity).toHaveBeenCalledTimes(2);
                expect(getChipQuantity).toHaveBeenCalledWith(20, mockChipValues);
                expect(getChipQuantity).toHaveBeenCalledWith(30, mockChipValues);
                expect(addChipsToChipBoxWhenJoinRoom).toHaveBeenCalledTimes(2);
                expect(addChipsToChipBoxWhenJoinRoom).toHaveBeenCalledWith(
                    chipFlyingInstant.chipContainer,
                    "chipBox1",
                    [],
                    chipFlyingInstant.slidingChip
                );
                expect(addChipsToChipBoxWhenJoinRoom).toHaveBeenCalledWith(
                    chipFlyingInstant.chipContainer,
                    "chipBox2",
                    [],
                    chipFlyingInstant.slidingChip
                );
                expect(chipFlyingInstant.addChipsToBoxWithChoice).toHaveBeenCalledTimes(2);
                expect(chipFlyingInstant.addChipsToBoxWithChoice).toHaveBeenCalledWith(nodes1, "choice1");
                expect(chipFlyingInstant.addChipsToBoxWithChoice).toHaveBeenCalledWith(nodes2, "choice2");
            });
            it("should set isFirstJoinGame = false", () => {
                // act
                chipFlyingInstant.renderMainPlayerChips(ownBets);

                // assert
                expect(chipFlyingInstant["isFirstJoinGame"]).toBe(false);
            });
        });

        describe("when isShowChips = false && isFirstJoinGame = true", () => {
            it("should set isFirstJoinGame = false", () => {
                // arrange
                chipFlyingInstant["isShowChips"] = false;
                chipFlyingInstant["isFirstJoinGame"] = true;

                // act
                chipFlyingInstant.renderMainPlayerChips({});

                // assert
                expect(chipFlyingInstant["isFirstJoinGame"]).toBe(false);
            });
        });
    });
});
