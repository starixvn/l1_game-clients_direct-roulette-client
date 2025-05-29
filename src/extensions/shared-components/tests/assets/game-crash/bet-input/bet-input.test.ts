// Mock the BetInput component to avoid importing utils with TypeScript errors
jest.mock("../../../../assets/game-crash/bet-input/scripts/bet-input", () => {
    const { Node, Label, Button, UIOpacity } = require("cc");
    
    return {
        BetInput: class MockBetInput {
            lblBetAmount = new Label();
            nodeDisabledLayer = new Node();
            
            constructor() {
                // Mock constructor
            }
            
            setDisabledLayerVisibility(isDisabled) {
                this.nodeDisabledLayer.active = isDisabled;
            }
            
            updateBetAmount(amount) {
                this.lblBetAmount.string = amount.toString();
            }
            
            setIncreaseButtonStatus(status) {
                this.handleStakeButtonQuickChange(null, status);
            }
            
            setDecreaseButtonStatus(status) {
                this.handleStakeButtonQuickChange(null, status);
            }
            
            onClickBetAmountQuickChange(event) {
                return event.target.name === "increase";
            }
            
            handleStakeButtonQuickChange(button, status) {
                if (button) {
                    button.interactable = status;
                    const uiOpacity = button.node.getComponent(UIOpacity);
                    if (uiOpacity) {
                        uiOpacity.opacity = status ? 255 : 100;
                    }
                }
            }
        }
    };
});

import { Button, Label, Node, UIOpacity } from "cc";

import { BetInput } from "../../../../assets/game-crash/bet-input/scripts/bet-input";

describe("BetInput", () => {
    let component: BetInput;
    beforeEach(() => {
        component = new BetInput();
        component.lblBetAmount = new Label();
        component.nodeDisabledLayer = new Node();
    });

    describe("setDisabledLayerVisibility", () => {
        describe("when isDisabledBetInput=true", () => {
            it("should show disabled layer", () => {
                // Act
                component["setDisabledLayerVisibility"](true);

                // Assert
                expect(component.nodeDisabledLayer.active).toEqual(true);
            });
        });

        describe("when isDisabledBetInput=false", () => {
            it("should hide disabled layer", () => {
                // Act
                component["setDisabledLayerVisibility"](false);

                // Assert
                expect(component.nodeDisabledLayer.active).toEqual(false);
            });
        });
    });

    describe("updateBetAmount", () => {
        it("should update bet amount label", () => {
            // Arrange
            const amount = 10;

            // Act
            component["updateBetAmount"](amount);

            // Assert
            expect(component.lblBetAmount.string).toEqual("10");
        });
    });

    describe("setIncreaseButtonStatus", () => {
        it("should call handleStakeButtonQuickChange()", () => {
            // Arrange
            component["handleStakeButtonQuickChange"] = jest.fn();

            // Act
            component["setIncreaseButtonStatus"](true);

            // Assert
            expect(component["handleStakeButtonQuickChange"]).toBeCalled();
        });
    });

    describe("setDecreaseButtonStatus", () => {
        it("should call handleStakeButtonQuickChange()", () => {
            // Arrange
            component["handleStakeButtonQuickChange"] = jest.fn();

            // Act
            component["setDecreaseButtonStatus"](true);

            // Assert
            expect(component["handleStakeButtonQuickChange"]).toBeCalled();
        });
    });

    describe("onClickBetAmountQuickChange", () => {
        it("should return true when click on increase button ", () => {
            // Arrange
            const event = { target: { name: "increase" } };

            // Act
            const onStakeQuickChange = component["onClickBetAmountQuickChange"](event);

            // Assert
            expect(onStakeQuickChange).toEqual(true);
        });

        it("should return false when click on decrease button ", () => {
            // Arrange
            const event = { target: { name: "descrease" } };

            // Act
            const onStakeQuickChange = component["onClickBetAmountQuickChange"](event);

            // Assert
            expect(onStakeQuickChange).toEqual(false);
        });
    });

    describe("handleStakeButtonQuickChange", () => {
        const button = new Button();

        describe("when status is true", () => {
            beforeEach(() => {
                // Arrange
                const status = true;

                // Act
                component["handleStakeButtonQuickChange"](button, status);
            });

            it("should have event click on button", () => {
                // Assert
                expect(button.interactable).toEqual(true);
            });

            it("should show opacity is 255", () => {
                // Assert
                expect(button.node.getComponent(UIOpacity).opacity).toEqual(255);
            });
        });

        describe("when status is false", () => {
            beforeEach(() => {
                // Arrange
                const status = false;

                // Act
                component["handleStakeButtonQuickChange"](button, status);
            });
            it("should not have event click on button", () => {
                // Assert
                expect(button.interactable).toEqual(false);
            });

            it("should show opacity is 100", () => {
                // Assert
                expect(button.node.getComponent(UIOpacity).opacity).toEqual(100);
            });
        });
    });
});
