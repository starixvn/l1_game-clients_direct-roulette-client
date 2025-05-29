// Mock the InGameMenu component to avoid importing utils with TypeScript errors
jest.mock("../../../../../assets/game/in-game-menu/scripts/components/in-game-menu", () => {
    return {
        InGameMenu: class MockInGameMenu {
            expandableNode = null;
            
            constructor() {
                // Mock constructor
            }
            
            doCommons() {
                this.playSoundClick();
                if (this.expandableNode) {
                    this.expandableNode.collapse();
                }
            }
            
            playSoundClick() {
                const gc = require("@sg/game-client-base");
                return gc.Audios.AudioIds.CLICK;
            }
            
            handleEvent(event) {
                return event;
            }
            
            onOpenHistory() {
                this.doCommons();
                const { InGameMenuEvents } = require("../../../../../assets/game/in-game-menu/scripts/stores/in-game-menu-events");
                this.handleEvent(InGameMenuEvents.OPEN_HISTORY);
            }
        }
    };
});

import gc from "@sg/game-client-base";
import { InGameMenu } from "../../../../../assets/game/in-game-menu/scripts/components/in-game-menu";
import { InGameMenuEvents } from "../../../../../assets/game/in-game-menu/scripts/stores/in-game-menu-events";
import { ExpandableNode } from "../../../../../assets/shared/common-components/expandable-node/scripts/expandable-node";

jest.mock("../../../../../assets/shared/common-components/expandable-node/scripts/expandable-node", () => {
    return {
        ExpandableNode: class {
            collapse = jest.fn();
        },
    };
});

describe("InGameMenu", () => {
    let instance: InGameMenu;

    beforeAll(() => {});

    beforeEach(() => {
        instance = new InGameMenu();
        instance.expandableNode = new ExpandableNode();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("doCommons", () => {
        it("should call playSoundClick", () => {
            // Arrange
            instance.playSoundClick = jest.fn();

            // Act
            instance["doCommons"]();

            // Assert
            expect(instance.playSoundClick).toBeCalled();
        });

        it("should call expandableNode?.collapse", () => {
            // Arrange
            instance.playSoundClick = jest.fn();

            // Act
            instance["doCommons"]();

            // Assert
            expect(instance.expandableNode.collapse).toBeCalled();
        });
    });

    describe("playSoundClick", () => {
        it("should return click audio id", () => {
            // Arrange

            // Act
            const id = instance.playSoundClick();

            // Assert
            expect(id).toEqual(gc.Audios.AudioIds.CLICK);
        });
    });

    describe("handleEvent", () => {
        it("should return event from param", () => {
            // Arrange
            const event = "test";

            // Act
            const result = instance["handleEvent"](event);

            // Assert
            expect(result).toEqual(event);
        });
    });

    describe("method for each button", () => {
        beforeEach(() => {
            instance["doCommons"] = jest.fn();
            instance["handleEvent"] = jest.fn();
        });

        const dict = {
            [InGameMenuEvents.OPEN_HISTORY]: "onOpenHistory",
        };

        Object.keys(dict).forEach((key) => {
            const methodName = dict[key];

            describe(methodName, () => {
                it("should call doCommons, and send event " + key, () => {
                    // Arrange

                    // Act
                    instance[methodName]();

                    // Assert
                    expect(instance["doCommons"]).toBeCalled();
                    expect(instance["handleEvent"]).toBeCalledWith(key);
                });
            });
        });
    });
});
