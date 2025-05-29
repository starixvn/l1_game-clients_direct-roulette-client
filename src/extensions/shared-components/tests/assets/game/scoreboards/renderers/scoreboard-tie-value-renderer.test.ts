import { Label } from "cc";
import { ScoreboardItemStatus } from "db://shared-components/game/scoreboards/scripts/models/scoreboard-item-enum";
import { ScoreboardItemState } from "db://shared-components/game/scoreboards/scripts/models/scoreboard-item-state";
import { ScoreboardTieValueRenderer } from "db://shared-components/game/scoreboards/scripts/renderers/scoreboard-tie-value-renderer";

describe("ScoreboardTieValueRenderer", () => {
    let component: ScoreboardTieValueRenderer;

    beforeEach(() => {
        component = new ScoreboardTieValueRenderer();
    });

    describe("canRender", () => {
        describe("when exists valid input", () => {
            it("should return true", () => {
                // Act
                const actual = component.canRender({ tie: 2 } as any);

                // Assert
                expect(actual).toBeTruthy();
            });
        });
    });

    describe("reset", () => {
        it("should update label value", () => {
            // Arrange
            const label = component.node.getComponent(Label);

            // Act
            component.reset();

            // Assert
            expect(label.string).toBe("");
        });
    });

    describe("render", () => {
        const state: ScoreboardItemState = {
            status: ScoreboardItemStatus.A,
            tie: 1,
        };
        let label: Label;

        beforeEach(() => {
            label = component.node.getComponent(Label);
            component.canRender = jest.fn().mockReturnValue(true);
        });

        describe("and can not render", () => {
            it("should do nothing", () => {
                // Arrange
                label.string = "";
                (component.canRender as jest.Mock).mockReturnValue(false);

                // Act
                component.render(state);

                // Assert
                expect(label.string).toEqual("");
            });
        });

        it("should check status", () => {
            // Act
            component.render(state);

            // Assert
            expect(component.canRender).toBeCalled();
        });

        it("should update label", () => {
            // Act
            component.render(state);

            // Assert
            expect(label.string).toBe("1");
        });
    });
});
