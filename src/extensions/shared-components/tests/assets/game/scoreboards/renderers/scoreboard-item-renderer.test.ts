import { ScoreboardItemRenderer } from "db://shared-components/game/scoreboards/scripts/renderers/scoreboard-item-renderer";

describe(ScoreboardItemRenderer.name, () => {
    let component: ScoreboardItemRenderer;

    beforeEach(() => {
        component = new ScoreboardItemRenderer();
    });

    describe("render", () => {
        describe("when called", () => {
            it("should active the node", () => {
                // Arrange
                component.node.active = false;

                // Act
                component.render();

                // Assert
                expect(component.node.active).toBeTruthy();
            });
        });
    });

    describe("reset", () => {
        describe("when called", () => {
            it("should inactive the node", () => {
                // Arrange
                component.node.active = true;

                // Act
                component.reset();

                // Assert
                expect(component.node.active).toBeFalsy();
            });
        });
    });
});
