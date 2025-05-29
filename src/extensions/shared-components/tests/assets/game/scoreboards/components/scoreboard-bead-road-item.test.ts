import { Node } from "cc";
import { ScoreboardBeadRoadItem } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-bead-road-item";
import { ScoreboardItemStatus } from "db://shared-components/game/scoreboards/scripts/models/scoreboard-item-enum";

describe(ScoreboardBeadRoadItem.name, () => {
    let component: ScoreboardBeadRoadItem<unknown>;
    const converter = {
        keyOfA: "a",
        tieKey: "tie",
    };
    const container = {
        getComponent: jest.fn().mockReturnValue(converter),
    } as any as Node;

    beforeEach(() => {
        component = new ScoreboardBeadRoadItem();
    });

    describe("createState", () => {
        describe("when called", () => {
            test.each([
                [{ a: undefined }, { status: ScoreboardItemStatus.NONE, tie: 0 }],
                [
                    { tie: 2, a: true },
                    { status: ScoreboardItemStatus.NONE, tie: 1 },
                ],
                [
                    { tie: 0, a: true },
                    { status: ScoreboardItemStatus.A, tie: 0 },
                ],
                [
                    { tie: 0, a: false },
                    { status: ScoreboardItemStatus.B, tie: 0 },
                ],
            ])("should return as expected", (data: unknown, expected) => {
                // Act
                const state = component.createState(null, data, container);

                // Assert
                expect(state).toStrictEqual(expected);
            });
        });
    });
});
