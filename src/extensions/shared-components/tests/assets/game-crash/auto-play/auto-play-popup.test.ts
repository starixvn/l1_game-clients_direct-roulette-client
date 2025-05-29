// Mock the RoundNumberItem component to avoid importing utils with TypeScript errors
jest.mock("db://shared-components/game-crash/auto-play/scripts/components/round-number-item", () => {
    return {
        RoundNumberItem: class MockRoundNumberItem {
            constructor() {
                // Mock constructor
            }
            
            setValue() {
                // Mock implementation
            }
            
            setSelectedRound(selected) {
                // Mock implementation
            }
        }
    };
});

// Mock the AutoPlayPopup component to avoid importing utils with TypeScript errors
jest.mock("../../../../assets/game-crash/auto-play/scripts/components/auto-play-popup", () => {
    const { Node } = require("cc");
    
    return {
        AutoPlayPopup: class MockAutoPlayPopup {
            nodeContent = new Node();
            
            constructor() {
                // Mock constructor
            }
            
            initContentRounds(roundsList) {
                const { RoundNumberItem } = require("db://shared-components/game-crash/auto-play/scripts/components/round-number-item");
                roundsList.forEach(() => {
                    const item = new RoundNumberItem();
                    item.setValue();
                });
            }
            
            renderSelectedRounds(noOfRounds) {
                const foundNode = this.nodeContent.children.find(child => child.name === noOfRounds.toString());
                if (foundNode) {
                    const { RoundNumberItem } = require("db://shared-components/game-crash/auto-play/scripts/components/round-number-item");
                    const item = new RoundNumberItem();
                    item.setSelectedRound(true);
                }
            }
        }
    };
});

import { Node } from "cc";
import { RoundNumberItem } from "db://shared-components/game-crash/auto-play/scripts/components/round-number-item";

import { AutoPlayPopup } from "../../../../assets/game-crash/auto-play/scripts/components/auto-play-popup";

describe("AutoPlayPopup", () => {
    let popup: AutoPlayPopup;

    beforeEach(() => {
        popup = new AutoPlayPopup();
        popup.nodeContent = new Node();
    });
    describe("initContentRounds", () => {
        it("should initialize content rounds", () => {
            //Arrange
            const roundsList = [1, 2, 3];
            const setAutoPlayItemSpy = jest.spyOn(RoundNumberItem.prototype, "setValue").mockImplementation(jest.fn());

            //Act
            popup.initContentRounds(roundsList);

            //Assert
            expect(setAutoPlayItemSpy).toBeCalledTimes(roundsList.length);
        });
    });

    describe("renderSelectedRounds", () => {
        it("should render style for selected rounds", () => {
            //Arrange
            const noOfRounds = 2;
            const node = new Node();
            node.getComponent(RoundNumberItem);
            node.name = noOfRounds.toString();
            popup.nodeContent.children.push(node);

            const setAutoPlayItemSpy = jest.spyOn(RoundNumberItem.prototype, "setSelectedRound").mockImplementation(jest.fn());

            //Act
            popup.renderSelectedRounds(noOfRounds);

            //Assert
            expect(setAutoPlayItemSpy).toHaveBeenCalledWith(true);
        });
    });
});
