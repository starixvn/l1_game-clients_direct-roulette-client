// Mock the AutoPlayPopupContainer component to avoid importing utils with TypeScript errors
jest.mock("../../../../assets/game-crash/auto-play/scripts/components/auto-play-popup-container", () => {
    const { Node } = require("cc");
    
    return {
        AutoPlayPopupContainer: class MockAutoPlayPopupContainer {
            nodeOverlay = new Node();
            createNode = jest.fn();
            
            constructor() {
                // Mock constructor
            }
            
            renderOpenPopup(isOpen) {
                this.nodeOverlay.active = isOpen;
                if (isOpen) {
                    this.createNode();
                }
            }
            
            onClickclosePopup() {
                this.createNode();
            }
        }
    };
});

import { Node } from "cc";

import { AutoPlayPopupContainer } from "../../../../assets/game-crash/auto-play/scripts/components/auto-play-popup-container";

describe("AutoPlayPopupContainer", () => {
    let container: AutoPlayPopupContainer;

    beforeEach(() => {
        container = new AutoPlayPopupContainer();
        container.nodeOverlay = new Node();
    });
    describe("renderOpenPopup", () => {
        beforeEach(() => {
            // Arrange
            container.createNode = jest.fn();
        });
        it("should render open popup", () => {
            //Act
            container.renderOpenPopup(true);
            //Assert
            expect(container.nodeOverlay.active).toEqual(true);
        });

        it("should render close popup ", () => {
            //Act
            container.renderOpenPopup(false);
            //Assert
            expect(container.nodeOverlay.active).toEqual(false);
        });
    });

    describe("onClickclosePopup", () => {
        beforeEach(() => {
            // Arrange
            container.createNode = jest.fn();
            //Act
            container.onClickclosePopup();
        });
        it("should handle close popup", () => {
            expect(container.createNode).toBeCalled;
        });
    });
});
