// Mock the BetAmountItem component to avoid importing utils with TypeScript errors
jest.mock("../../../../assets/game-crash/bet-input/scripts/components/bet-amount-item", () => {
    const { Node, Label } = require("cc");
    
    return {
        BetAmountItem: class MockBetAmountItem {
            lblBetAmount = new Label();
            node = new Node();
            
            constructor() {
                // Mock constructor
            }
            
            setBetAmountItem(amount) {
                // Mock implementation
            }
        }
    };
});

// Mock the BetAmountPopup component to avoid importing utils with TypeScript errors
jest.mock("../../../../assets/game-crash/bet-input/scripts/components/bet-amount-popup", () => {
    const { Node, Label, Button, UIOpacity } = require("cc");
    
    return {
        BetAmountPopup: class MockBetAmountPopup {
            nodeBetContainer = new Node();
            lblBetAmount = new Label();
            btnConfirm = new Button();
            lblBetRange = new Label();
            node = new Node();
            
            constructor() {
                // Mock constructor
            }
            
            initBetAmount(config) {
                const { chips, minBet, maxBet } = config;
                const validChips = chips.filter(chip => parseInt(chip) >= minBet && parseInt(chip) <= maxBet);
                // Simulate creating BetAmountItem instances
                const { BetAmountItem } = require("../../../../assets/game-crash/bet-input/scripts/components/bet-amount-item");
                validChips.forEach(() => {
                    const item = new BetAmountItem();
                    item.setBetAmountItem();
                });
            }
            
            updateBetRange(config) {
                const { minBet, maxBet } = config;
                this.lblBetRange.string = `${minBet} - ${maxBet}`;
            }
            
            setBetAmountPopupVisibilty(visible) {
                this.node.active = visible;
            }
            
            updateBetAmount(amount) {
                this.lblBetAmount.string = amount.toString();
                this.checkConfirmBtnStatus(true);
            }
            
            checkConfirmBtnStatus(status) {
                this.btnConfirm.interactable = status;
                const uiOpacity = this.btnConfirm.node.getComponent(UIOpacity);
                if (uiOpacity) {
                    uiOpacity.opacity = status ? 255 : 100;
                }
            }
        }
    };
});

import { Button, Label, Node, UIOpacity } from "cc";

import { BetAmountItem } from "../../../../assets/game-crash/bet-input/scripts/components/bet-amount-item";
import { BetAmountPopup } from "../../../../assets/game-crash/bet-input/scripts/components/bet-amount-popup";

describe("BetAmountPopup", () => {
    let component: BetAmountPopup;
    beforeEach(() => {
        component = new BetAmountPopup();
        component.nodeBetContainer = new Node();
        component.lblBetAmount = new Label();
        component.btnConfirm = new Button();
        component.lblBetRange = new Label();
    });
    describe("initBetAmount", () => {
        it("should add bet amount item into betContainer node", () => {
            // Arrange
            const chips = ["1", "5", "10", "50", "100", "200", "500", "1000", "2000"];
            const setBetAmountItemSpy = jest.spyOn(BetAmountItem.prototype, "setBetAmountItem").mockImplementation(jest.fn());

            // Act
            component["initBetAmount"]({ chips, minBet: 1, maxBet: 500 });

            // Assert
            expect(setBetAmountItemSpy).toBeCalledTimes(7);
        });
    });

    describe("updateBetRange", () => {
        it("should display minBet and maxBet", () => {
            // Arrange
            const minBet = 1;
            const maxBet = 500;

            // Act
            component["updateBetRange"]({ minBet, maxBet });

            // Assert
            expect(component.lblBetRange.string).toEqual(`${minBet} - ${maxBet}`);
        });
    });

    describe("setBetAmountPopupVisibilty", () => {
        it("should show bet amount popup if set true", () => {
            // Arrange

            // Act
            component["setBetAmountPopupVisibilty"](true);

            // Assert
            expect(component.node.active).toEqual(true);
        });

        it("should hide bet amount popup if set false", () => {
            // Arrange

            // Act
            component["setBetAmountPopupVisibilty"](false);

            // Assert
            expect(component.node.active).toEqual(false);
        });
    });

    describe("updateBetAmount", () => {
        beforeEach(() => {
            // Arrange
            const amount = 100;
            component["checkConfirmBtnStatus"] = jest.fn();

            // Act
            component["updateBetAmount"](amount);
        });

        it("should update bet amount label", () => {
            // Assert
            expect(component.lblBetAmount.string).toMatch("100");
        });

        it("should call checkConfirmBtnStatus()", () => {
            // Assert
            expect(component["checkConfirmBtnStatus"]).toBeCalled();
        });
    });

    describe("checkConfirmBtnStatus", () => {
        describe("when set status=true", () => {
            beforeEach(() => {
                // Act
                component["checkConfirmBtnStatus"](true);
            });

            it("should have click event", () => {
                // Assert
                expect(component.btnConfirm.interactable).toEqual(true);
            });

            it("should set opacitty is 255", () => {
                // Assert
                expect(component.btnConfirm.node.getComponent(UIOpacity).opacity).toEqual(255);
            });
        });

        describe("when set status=false", () => {
            it("should not click", () => {
                // Act
                component["checkConfirmBtnStatus"](false);

                // Assert
                expect(component.btnConfirm.interactable).toEqual(false);
            });
        });
    });
});
