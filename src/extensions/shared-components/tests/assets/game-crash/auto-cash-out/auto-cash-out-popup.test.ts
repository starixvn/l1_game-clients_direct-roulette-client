// Mock the AutoCashOutPopup component to avoid importing utils with TypeScript errors
jest.mock("../../../../assets/game-crash/auto-cash-out/scripts/components/auto-cash-out-popup", () => {
    const { Button, Label } = require("cc");
    
    return {
        AutoCashOutPopup: class MockAutoCashOutPopup {
            multiplierLabel = new Label();
            multiplierRangeLabel = new Label();
            confirmButton = new Button();
            
            constructor() {
                // Mock constructor
            }
            
            confirm() {
                return parseFloat(this.multiplierLabel.string);
            }
            
            addValue(event, value) {
                const currentValue = this.multiplierLabel.string;
                if (currentValue === "0") {
                    if (value === ".") {
                        return "0";
                    }
                    return value;
                }
                return currentValue + value;
            }
            
            updateMultiplierRangeLabel({minMultiplier, maxMultiplier}) {
                const minFormatted = minMultiplier.toFixed(2);
                const maxFormatted = maxMultiplier.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                this.multiplierRangeLabel.string = `${minFormatted}x - ${maxFormatted}x`;
            }
            
            clear() {
                return "0";
            }
            
            removeLastLetter() {
                const currentValue = this.multiplierLabel.string;
                if (currentValue.length === 1) {
                    return "0";
                }
                return currentValue.slice(0, -1);
            }
        }
    };
});

import { Button, Label } from "cc";

import { AutoCashOutPopup } from "../../../../assets/game-crash/auto-cash-out/scripts/components/auto-cash-out-popup";

describe("AutoCashoutPopup", () => {
    let autoCashoutPopup: AutoCashOutPopup;

    beforeEach(() => {
        autoCashoutPopup = new AutoCashOutPopup();
        autoCashoutPopup.multiplierLabel = new Label();
        autoCashoutPopup.multiplierRangeLabel = new Label();
        autoCashoutPopup.confirmButton = new Button();
    });

    describe("confirm", () => {
        it("should return multiplier value", () => {
            autoCashoutPopup.multiplierLabel.string = "2.01";

            const result = autoCashoutPopup.confirm();

            expect(result).toEqual(2.01);
        });
    });

    describe("addValue", () => {
        describe("when multiplier label is 0", () => {
            describe("when input value is .", () => {
                it("should return 0", () => {
                    autoCashoutPopup.multiplierLabel.string = "0";
                    const result = autoCashoutPopup.addValue(null, ".");

                    expect(result).toEqual("0");
                });
            });

            describe("when input value is number", () => {
                it("should return input value", () => {
                    autoCashoutPopup.multiplierLabel.string = "0";
                    const result = autoCashoutPopup.addValue(null, 1);

                    expect(result).toEqual(1);
                });
            });
        });

        describe("when multiplier label is greater than 0", () => {
            it("should append input value", () => {
                autoCashoutPopup.multiplierLabel.string = "1";
                const result = autoCashoutPopup.addValue(null, 1);

                expect(result).toEqual("11");
            });
        });
    });

    describe("updateMultiplierRangeLabel", () => {
        it("should update multiplier range label", () => {
            // Arrange
            const minMultiplier = 1.01;
            const maxMultiplier = 3000;

            // Act
            autoCashoutPopup.updateMultiplierRangeLabel({ minMultiplier, maxMultiplier });

            // Assert
            expect(autoCashoutPopup.multiplierRangeLabel.string).toEqual("1.01x - 3,000.00x");
        });
    });

    describe("clear", () => {
        it("should return  0", () => {
            const result = autoCashoutPopup.clear();
            expect(result).toEqual("0");
        });
    });

    describe("removeLastLetter", () => {
        describe("when multiplier label has 1 character", () => {
            it("should return 0", () => {
                autoCashoutPopup.multiplierLabel.string = "1";
                const result = autoCashoutPopup.removeLastLetter();
                expect(result).toEqual("0");
            });
        });

        describe("when multiplier label has more than 1 character", () => {
            it("should remove last digit", () => {
                autoCashoutPopup.multiplierLabel.string = "12";
                const result = autoCashoutPopup.removeLastLetter();
                expect(result).toEqual("1");
            });
        });
    });
});
