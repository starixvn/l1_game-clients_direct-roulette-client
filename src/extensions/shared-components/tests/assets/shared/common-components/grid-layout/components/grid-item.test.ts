import { UITransform } from "cc";
import { GridItem } from "../../../../../../assets/shared/common-components/grid-layout/scripts/components/grid-item";
import { GridItemSettings } from "../../../../../../assets/shared/common-components/grid-layout/scripts/settings/grid-item-settings";

describe(GridItem.name, () => {
    let gridItem: GridItem<unknown>;
    let setting: GridItemSettings = {
        prefab: null,
        size: 20,
    };
    let uiTransform: UITransform;

    beforeEach(() => {
        gridItem = new GridItem();
        uiTransform = new UITransform();

        jest.spyOn(gridItem.node, "getComponent").mockReturnValue(uiTransform);
    });

    describe("updateSize", () => {
        describe("when called", () => {
            it("should get the UITransform component from node", () => {
                // Act
                gridItem.updateSize(setting);

                // Assert
                expect(gridItem.node.getComponent).toBeCalledWith(UITransform);
            });

            it("should update the content size", () => {
                // Act
                gridItem.updateSize(setting);

                // Assert
                expect(uiTransform.setContentSize).toBeCalledWith(setting.size, setting.size);
            });
        });
    });

    describe("render", () => {
        describe("when called", () => {
            it("should update size", () => {
                // Arrange
                jest.spyOn(gridItem, "updateSize");

                // Act
                gridItem.render(setting);

                // Assert
                expect(gridItem.updateSize).toBeCalledWith(setting);
            });
        });
    });
});
