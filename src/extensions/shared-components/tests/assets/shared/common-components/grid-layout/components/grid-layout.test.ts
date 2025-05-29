import { Layout, ScrollView, instantiate } from "cc";
import { GridItem } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-item";
import { GridItemSettings } from "db://shared-components/shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { GridLayoutSettings } from "db://shared-components/shared/common-components/grid-layout/scripts/settings/grid-layout-settings";
import { GridLayout } from "../../../../../../assets/shared/common-components/grid-layout/scripts/components/grid-layout";

class FakeItem extends GridItem<number> {}

describe(GridLayout.name, () => {
    let grid: GridLayout;
    let fakeItem: FakeItem;
    const gridLayoutSettings: GridLayoutSettings = {
        column: 1,
        direction: Layout.AxisDirection.HORIZONTAL,
        row: 1,
        itemPrefab: null,
        itemSize: 10,
        scrollable: true,
        scrollToEnd: true,
    };
    const itemSettings: GridItemSettings = {
        prefab: null,
        size: 10,
    };

    beforeEach(() => {
        fakeItem = new FakeItem();
        grid = new GridLayout();

        grid.layout = new Layout();
        grid.scrollView = new ScrollView();
        grid.settings = gridLayoutSettings;
        grid.itemSettings = itemSettings;

        // @ts-ignore
        grid.layout.node.children = [fakeItem];
    });

    describe("content", () => {
        it("should return node of layout component", () => {
            // Assert
            expect(grid.content).toStrictEqual(grid.layout.node);
        });
    });

    describe("render", () => {
        describe("when input length is less than current", () => {
            it("should remove unused nodes", () => {
                // Act
                grid.render(FakeItem, []);

                // Assert
                expect(fakeItem.destroy).toBeCalled();
            });
        });

        describe("when input length is greater than current", () => {
            let render;
            beforeEach(() => {
                render = jest.fn();

                grid["getItemComponent"] = jest.fn().mockReturnValue({ render });
            });

            it("should create prefab instances", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(instantiate).toBeCalledWith(itemSettings.prefab);
            });

            it("should render items", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(render).toBeCalledWith(itemSettings, 2, grid.node, 1);
            });

            it("should add new node to container", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(render).toBeCalledWith(itemSettings, 2, grid.node, 1);
            });

            it("should re-render the existing nodes", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(render).toBeCalledWith(itemSettings, 1, grid.node, 0);
            });
        });

        it("should update layout", () => {
            // Act
            grid.render(FakeItem, []);

            // Assert
            expect(grid.layout.updateLayout).toBeCalled();
        });
    });
});
