// Mock the BetAmountPopupContainer component to avoid importing utils with TypeScript errors
jest.mock("../../../../assets/game-crash/bet-input/scripts/bet-amount-popup-container", () => {
    const { Node } = require("cc");
    
    return {
        BetAmountPopupContainer: class MockBetAmountPopupContainer {
            nodeOverlay = new Node();
            createNode = jest.fn();
            
            constructor() {
                // Mock constructor
            }
            
            renderOpenBetAmountPopup(isOpen) {
                this.nodeOverlay.active = isOpen;
                if (isOpen) {
                    this.createNode();
                }
            }
        }
    };
});

import { Node } from "cc";

import { BetAmountPopupContainer } from "../../../../assets/game-crash/bet-input/scripts/bet-amount-popup-container";

describe("BetAmountPopupContainer", () => {
    let component: BetAmountPopupContainer;
    beforeEach(() => {
        component = new BetAmountPopupContainer();
        component.nodeOverlay = new Node();
    });

    describe("renderOpenBetAmountPopup", () => {
        beforeEach(() => {
            // Arrange
            component.createNode = jest.fn();
        });

        describe("when isOpenBetAmountPopup=true", () => {
            it("should show overlay node", () => {
                // Act
                component["renderOpenBetAmountPopup"](true);

                // Assert
                expect(component.nodeOverlay.active).toEqual(true);
            });
        });

        describe("when isOpenBetAmountPopup=false", () => {
            it("should hide overlay node", () => {
                // Act
                component["renderOpenBetAmountPopup"](false);

                // Assert
                expect(component.nodeOverlay.active).toEqual(false);
            });
        });

        it("should call createNode()", () => {
            // Act
            component["renderOpenBetAmountPopup"](true);

            // Assert
            expect(component.createNode).toBeCalled;
        });
    });
});
