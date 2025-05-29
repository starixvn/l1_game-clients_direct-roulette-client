import { ScoreboardAlgorithm } from "../../../../../assets/game/scoreboards/scripts/components/scoreboard-algorithm";

describe(ScoreboardAlgorithm.name, () => {
    describe("apply", () => {
        describe("when called", () => {
            it("should return input data", () => {
                // Arrange
                const component = new ScoreboardAlgorithm();

                // Act
                const actual = component.apply([1, 2, 3]);

                // Assert
                expect(actual).toStrictEqual([1, 2, 3]);
            });
        });
    });
});
