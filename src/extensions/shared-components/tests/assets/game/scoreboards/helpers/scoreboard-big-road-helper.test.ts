import { rowToColumns } from "db://shared-components/game/scoreboards/scripts/helpers/scoreboard-big-road-helper";

describe(rowToColumns.name, () => {
    describe("when called", () => {
        it("should convert rows to columns", () => {
            // Act
            const actual = rowToColumns([
                [1, 2],
                [3, 4],
            ]);

            // Assert
            expect(actual).toStrictEqual([1, 3, 2, 4]);
        });
    });
});
