import { Node } from "cc";
import { ScoreboardBigRoadItem } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-big-road-item";
import { ScoreboardItemStatus } from "db://shared-components/game/scoreboards/scripts/models/scoreboard-item-enum";

describe(ScoreboardBigRoadItem.name, () => {
    let component: ScoreboardBigRoadItem<unknown>;
    const converter = {
        keyOfA: "a",
        tieKey: "tie",
        blinkKey: "blink",
    };
    const container = {
        getComponent: jest.fn().mockReturnValue(converter),
    } as any as Node;

    beforeEach(() => {
        component = new ScoreboardBigRoadItem();
    });

    describe("createState", () => {
        describe("when called", () => {
            test.each([
                [{ data: [{ blink: true }] }, { status: ScoreboardItemStatus.BLINK, tie: 0 }],
                [{ data: [] }, { status: ScoreboardItemStatus.NONE, tie: 0 }],
                [{ data: [{ tie: true }] }, { status: ScoreboardItemStatus.NONE, tie: 1 }],
                [
                    { status: true, data: [{ a: true }, { tie: true }] },
                    { status: ScoreboardItemStatus.A, tie: 1 },
                ],
                [
                    { status: false, data: [{ a: false }] },
                    { status: ScoreboardItemStatus.B, tie: 0 },
                ],
            ])("should return as expected", (data: any, expected) => {
                // Act
                const state = component.createState(null, data, container);

                // Assert
                expect(state).toStrictEqual(expected);
            });
        });
    });
});
