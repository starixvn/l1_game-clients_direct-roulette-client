import { Scoreboard } from "db://shared-components/game/scoreboards/scripts/components/scoreboard";
import { ScoreboardAlgorithm } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-algorithm";
import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";
import { ScoreboardGridItem } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-grid-item";
import { GridLayout } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout";

describe("Scoreboard", () => {
    let component: Scoreboard;
    let converter: ScoreboardDataConverter;
    let algorithm: ScoreboardAlgorithm;
    let grid: GridLayout;

    beforeEach(() => {
        component = new Scoreboard();

        converter = { convert: jest.fn((x) => x) } as any;
        algorithm = { apply: jest.fn((x) => x) } as any;
        grid = { render: jest.fn() } as any;

        component.converter = converter;
        component.algorithm = algorithm;
        component["grid"] = grid;
    });

    describe("onFocusInEditor", () => {
        describe("when called", () => {
            it("should get components from node", () => {
                // Arrange
                const grid = component.node.getComponent(GridLayout);
                const converter = component.node.getComponent(ScoreboardDataConverter);
                const algorithm = component.node.getComponent(ScoreboardAlgorithm);

                // Act
                component.onFocusInEditor();

                // Assert
                expect(component["grid"]).toEqual(grid);
                expect(component["converter"]).toEqual(converter);
                expect(component["algorithm"]).toEqual(algorithm);
            });
        });
    });

    describe("render", () => {
        describe("when called", () => {
            it("should convert input", () => {
                // Act
                component.render([1, 2]);

                // Assert
                expect(converter.convert).toBeCalledWith([1, 2]);
            });

            it("should apply the algorithm", () => {
                // Act
                component.render([1, 2]);

                // Assert
                expect(algorithm.apply).toBeCalledWith([1, 2]);
            });

            it("should render the grid layout", () => {
                // Act
                component.render([1, 2]);

                // Assert
                expect(grid.render).toBeCalledWith(ScoreboardGridItem, [1, 2]);
            });
        });
    });
});
