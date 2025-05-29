import { ScoreboardItem } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-item";
import {
    ScoreboardItemStatus,
    ScoreboardItemTieCriteria,
} from "db://shared-components/game/scoreboards/scripts/models/scoreboard-item-enum";
import { ScoreboardItemRenderer } from "db://shared-components/game/scoreboards/scripts/renderers/scoreboard-item-renderer";

describe(ScoreboardItem.name, () => {
    let component: ScoreboardItem;

    beforeEach(() => {
        component = new ScoreboardItem();
    });

    describe("onFocusInEditor", () => {
        describe("when length of array is difference from current", () => {
            it("should update renderers", () => {
                // Arrange
                (component.getComponentsInChildren as jest.Mock).mockReturnValue([2, 3]);

                // Act
                component.onFocusInEditor();

                // Assert
                expect(component["renderers"]).toStrictEqual([2, 3]);
            });
        });
    });

    describe("reset", () => {
        describe("when called", () => {
            it("should reset renderer", () => {
                // Arrange
                const reset = jest.fn();

                // Act
                component["reset"]({ reset } as any);

                // Assert
                expect(reset).toBeCalled();
            });
        });
    });

    describe("executeRender", () => {
        describe("when match state", () => {
            it("should render the item", () => {
                // Arrange
                const renderer: ScoreboardItemRenderer = {
                    render: jest.fn(),
                    forState: { tie: ScoreboardItemTieCriteria.ANY, status: ScoreboardItemStatus.A },
                } as any;

                component.state = { tie: 1, status: ScoreboardItemStatus.A };

                // Act
                component["executeRender"](renderer);

                // Assert
                expect(renderer.render).toBeCalledWith(component.state, [], component);
            });
        });
    });

    describe("isMatchState", () => {
        describe("when the value of status and tie are matched", () => {
            [
                {
                    state: { tie: 0, status: 1 },
                    criteria: { tie: ScoreboardItemTieCriteria.ZERO, status: 1 },
                },
                {
                    state: { tie: 1, status: 1 },
                    criteria: { tie: ScoreboardItemTieCriteria.POSITIVE, status: 1 },
                },
                {
                    state: { tie: 0, status: 1 },
                    criteria: { tie: ScoreboardItemTieCriteria.ANY, status: 1 },
                },
                {
                    state: { tie: 1, status: 1 },
                    criteria: { tie: ScoreboardItemTieCriteria.ANY, status: 1 },
                },
            ].forEach(({ state, criteria }) => {
                it("should return true", () => {
                    // Act
                    const actual = component["isMatchState"](state, criteria);

                    // Assert
                    expect(actual).toBeTruthy();
                });
            });
        });
    });

    describe("isMatchCriteria", () => {
        describe("when the value of status and tie are matched", () => {
            it("should return true", () => {
                // Arrange
                const a = { tie: 1, status: ScoreboardItemStatus.A };
                const b = { tie: 1, status: ScoreboardItemStatus.A };

                // Act
                const actual = component["isMatchCriteria"](a, b);

                // Assert
                expect(actual).toBeTruthy();
            });
        });
    });
});
