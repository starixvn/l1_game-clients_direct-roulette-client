import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";

describe(ScoreboardDataConverter.name, () => {
    let converter: ScoreboardDataConverter;

    beforeEach(() => {
        converter = new ScoreboardDataConverter();

        converter.properties = [{ key: "A", value: "a" }];
    });

    describe("convert", () => {
        describe("when the input is an array", () => {
            it("should return a new array of round result", () => {
                // Act
                const actual = converter.convert([{ settlementResult: { round: true } }]);

                // Assert
                expect(actual).toStrictEqual([{ round: true }]);
            });
        });

        describe("when the input is an object", () => {
            it("should return a new object of round result", () => {
                // Act
                const actual = converter.convert({ settlementResult: { round: true } });

                // Assert
                expect(actual).toStrictEqual({ round: true });
            });
        });
    });

    ["keyOfA", "tieKey", "blinkKey"].forEach((property) => {
        describe(`when accessed property ${property}`, () => {
            it("should call getProperty method", () => {
                // Arrange
                jest.spyOn(converter, "getProperty");

                // Act
                converter[property];

                // Assert
                expect(converter.getProperty).toBeCalledWith(property);
            });
        });
    });

    describe("createRound", () => {
        describe("when called", () => {
            it("should return a round with predefined properties", () => {
                // Act
                const actual = converter.createRound();

                // Assert
                expect(actual).toStrictEqual({ settlementResult: { a: false } });
            });
        });
    });

    describe("getProperty", () => {
        describe("when called", () => {
            it("should return value of predefined property", () => {
                // Act
                const actual = converter.getProperty("A");

                // Assert
                expect(actual).toBe("a");
            });
        });
    });
});
