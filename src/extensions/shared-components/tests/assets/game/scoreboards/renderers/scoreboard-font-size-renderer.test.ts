import { Label, Node, UITransform } from "cc";
import { ScoreboardFontSizeRenderer } from "db://shared-components/game/scoreboards/scripts/renderers/scoreboard-font-size-renderer";

describe("ScoreboardFontSizeRenderer", () => {
    let component: ScoreboardFontSizeRenderer;

    beforeEach(() => {
        component = new ScoreboardFontSizeRenderer();
        component.node.parent = new Node();
    });

    describe("render", () => {
        beforeEach(() => {
            component.canRender = jest.fn().mockReturnValue(true);
        });

        it("should check status", () => {
            // Act
            component.render();

            // Assert
            expect(component.canRender).toBeCalled();
        });

        it("should update font size", () => {
            // Arrange
            const uiTransform = component.node.parent.getComponent(UITransform);
            uiTransform.width = 26;
            const label = component.node.getComponent(Label);
            label.fontSize = 40;

            // Act
            component.render();

            // Assert
            expect(label.fontSize).toEqual(20);
        });

        describe("and can not render", () => {
            it("should do nothing", () => {
                // Arrange
                (component.canRender as jest.Mock).mockReturnValue(false);
                const label = component.node.getComponent(Label);
                label.fontSize = 40;

                // Act
                component.render();

                // Assert
                expect(label.fontSize).toEqual(40);
            });
        });
    });

    describe("canRender", () => {
        describe("when exists UITransform and Label component", () => {
            it("should return true", () => {
                // Arrange

                // Act
                const actual = component.canRender();

                // Assert
                expect(actual).toBeTruthy();
            });
        });
    });
});
