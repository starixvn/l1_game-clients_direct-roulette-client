import { ScoreboardBeadRoadAlgorithm } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-bead-road-algorithm";
import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";
import { GridLayout } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout";
import { GridLayoutSettings } from "db://shared-components/shared/common-components/grid-layout/scripts/settings/grid-layout-settings";

describe("ScoreboardBeadRoadAlgorithm", () => {
    let component: ScoreboardBeadRoadAlgorithm;
    let converter: ScoreboardDataConverter;
    const settings: GridLayoutSettings = {
        row: 1,
        column: 1,
    } as GridLayoutSettings;
    let rounds: unknown[];

    beforeEach(() => {
        rounds = [{ result: { a: true } }, { result: { a: false } }];
        component = new ScoreboardBeadRoadAlgorithm();
        converter = {
            createRound: jest.fn().mockReturnValue({ result: { empty: true } }),
            resultKey: "result",
            keyOfA: "a",
        } as any;

        component["converter"] = converter;
        component["grid"] = { settings } as GridLayout;
    });

    describe("apply", () => {
        describe("when called", () => {
            it("should add empty points", () => {
                // Arrange
                jest.spyOn(component, "addEmptyPoints");

                // Act
                component.apply(rounds);

                // Assert
                expect(component.addEmptyPoints).toBeCalledWith(rounds, 1);
            });

            it("should return data as expected", () => {
                // Arrange
                jest.spyOn(component, "addEmptyPoints").mockImplementation((x) => x.push(0));

                // Act
                const actual = component.apply(rounds);

                // Assert
                expect(actual).toStrictEqual(rounds);
            });
        });
    });

    describe("addEmptyPoints", () => {
        describe("when the current length is greater than the maximum", () => {
            it("should do nothing", () => {
                // Act
                component.addEmptyPoints(rounds, 1);

                // Assert
                expect(converter.createRound).toBeCalledTimes(0);
            });
        });

        describe("when the current length is less than the maximum", () => {
            it("should create a new round", () => {
                // Act
                component.addEmptyPoints(rounds, 3);

                // Assert
                expect(converter.createRound).toBeCalledTimes(1);
            });
        });
    });

    describe("onFocusInEditor", () => {
        describe("when called", () => {
            it("should get ScoreboardDataConverter and GridLayout component", () => {
                // Arrange
                const converter = component.node.getComponent(ScoreboardDataConverter);
                const grid = component.node.getComponent(GridLayout);

                // Act
                component.onFocusInEditor();

                // Assert
                expect(component["converter"]).toEqual(converter);
                expect(component["grid"]).toEqual(grid);
            });
        });
    });
});
