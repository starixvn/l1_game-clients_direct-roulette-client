import {
    BigRoadConverter,
    ScoreboardBigRoadAlgorithm,
} from "db://shared-components/game/scoreboards/scripts/components/scoreboard-big-road-algorithm";
import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";
import { GridLayout } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout";

jest.mock("sc-scoreboards", () => ({
    Converter: class {},
    BigRoadScoreboard: class {
        initialize = jest.fn();

        rows = jest.fn(() => []);
    },
    GoodRoadColumnLengthDetectorDetector: class {
        constructor() {}
    },
}));

describe("ScoreboardBigRoadAlgorithm", () => {
    let algorithm: ScoreboardBigRoadAlgorithm;
    let grid: GridLayout;

    beforeEach(() => {
        algorithm = new ScoreboardBigRoadAlgorithm();
        grid = {
            settings: {
                row: 1,
                column: 1,
            } as any,
        } as any;

        algorithm["grid"] = grid;
    });

    describe("onFocusInEditor", () => {
        it("should get ScoreboardDataConverter and GridLayout component", () => {
            const converter = algorithm.node.getComponent(ScoreboardDataConverter);
            const grid = algorithm.node.getComponent(GridLayout);

            // Act
            algorithm.onFocusInEditor();

            // Assert
            expect(algorithm["converter"]).toEqual(converter);
            expect(algorithm["grid"]).toEqual(grid);
        });
    });

    describe("apply", () => {
        describe("when called", () => {
            it("should initialize the big road algorithm", () => {
                // Act
                algorithm.apply([]);

                // Assert
                expect(algorithm["bigRoad"].initialize).toBeCalledWith([]);
            });

            it("should return as expected", () => {
                // Act
                const points = algorithm.apply([]);

                // Assert
                expect(points).toStrictEqual([
                    {
                        data: [],
                        index: -1,
                        parentColumn: -1,
                        status: undefined,
                        x: 0,
                        y: 3,
                    },
                ]);
            });
        });
    });
});

describe(BigRoadConverter.name, () => {
    const converter = new BigRoadConverter({ keyOfA: "a", tieKey: "tie" });

    describe("positiveKey", () => {
        describe("when called", () => {
            it("should return a", () => {
                // Act
                const actual = converter["positiveKey"]();

                // Assert
                expect(actual).toBe("a");
            });
        });
    });

    describe("specialKey", () => {
        describe("when called", () => {
            it("should return tie", () => {
                // Act
                const actual = converter["specialKey"]();

                // Assert
                expect(actual).toBe("tie");
            });
        });
    });
});
