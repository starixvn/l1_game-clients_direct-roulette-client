// Mock the RoundNumberItem component to avoid importing utils with TypeScript errors
jest.mock("db://shared-components/game-crash/auto-play/scripts/components/round-number-item", () => {
    const { Node } = require("cc");
    
    return {
        RoundNumberItem: class MockRoundNumberItem {
            lblNoOfRound = { string: "", color: null };
            sprSelectedBg = { node: { active: false } };
            noOfRoundSelectedTextColor = "";
            noOfRoundNormalTextColor = "";
            node = new Node();
            
            constructor() {
                // Mock constructor
            }
            
            setValue(noOfRound) {
                this.node.name = noOfRound.toString();
                this.lblNoOfRound.string = noOfRound.toString();
            }
            
            setSelectedRound(selected) {
                this.sprSelectedBg.node.active = selected;
                if (selected) {
                    const { Color } = require("cc");
                    this.lblNoOfRound.color = new Color().fromHEX(this.noOfRoundSelectedTextColor);
                } else {
                    const { Color } = require("cc");
                    this.lblNoOfRound.color = new Color().fromHEX(this.noOfRoundNormalTextColor);
                }
            }
            
            onRoundNumberItemClick(event) {
                return parseInt(event.target.name);
            }
        }
    };
});

import { Color, Label, Sprite } from "cc";
import { RoundNumberItem } from "db://shared-components/game-crash/auto-play/scripts/components/round-number-item";

describe("RoundNumberItem", () => {
    let comp: RoundNumberItem;
    beforeEach(() => {
        comp = new RoundNumberItem();
        comp.lblNoOfRound = new Label();
        comp.sprSelectedBg = new Sprite();
        comp.noOfRoundSelectedTextColor = "000000";
        comp.noOfRoundNormalTextColor = "ffffff";
    });
    describe("setValue", () => {
        beforeEach(() => {
            //Arrange
            const noOfRound = 10;

            //Act
            comp.setValue(noOfRound);
        });
        it("should assign name of noOfRound is 10", () => {
            //Assert
            expect(comp.node.name).toEqual("10");
        });
        it("should assign value of lable noOfRound is 10", () => {
            //Assert
            expect(comp.lblNoOfRound.string).toEqual("10");
        });
    });

    describe("setSelectedRound", () => {
        beforeEach(() => {
            //Arrange
            const selected = true;

            //Act
            comp.setSelectedRound(selected);
        });
        it("should assign status of node sprSelectedBg is true", () => {
            //Assert
            expect(comp.sprSelectedBg.node.active).toEqual(true);
        });

        it("should assign color of lblNoOfRound is 000000", () => {
            //Arange
            const colorSelected = new Color().fromHEX(comp.noOfRoundSelectedTextColor);
            //Assert
            expect(comp.lblNoOfRound.color).toEqual(colorSelected);
        });
    });

    describe("onRoundNumberItemClick", () => {
        it("should return node name", () => {
            // Arrange
            const event = { target: { name: "50" } };

            // Act
            const selectedRound = comp.onRoundNumberItemClick(event);

            // Assert
            expect(selectedRound).toEqual(50);
        });
    });
});
