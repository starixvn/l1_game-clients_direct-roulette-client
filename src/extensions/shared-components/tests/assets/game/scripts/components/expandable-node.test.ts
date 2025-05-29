import { Node, Tween, tween, UIOpacity } from "cc";

import { ExpandableNode } from "../../../../../assets/shared/common-components/expandable-node/scripts/expandable-node";

describe("ExpandableNode", () => {
    let expandableNode: ExpandableNode;

    beforeEach(() => {
        expandableNode = new ExpandableNode();
        expandableNode.expandableNode = new Node();
        expandableNode.tapToCollapseNode = new Node();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("onClickExpand", () => {
        beforeEach(() => {
            expandableNode.expand = jest.fn();
            expandableNode.collapse = jest.fn();
        });
        it("should call expand when expanded is false", () => {
            // Arrange
            expandableNode["expanded"] = false;

            // Act
            expandableNode.onClickExpand();

            // Assert
            expect(expandableNode.expand).toBeCalled();
        });

        it("should call collapse when expanded is true", () => {
            // Arrange
            expandableNode["expanded"] = true;

            // Act
            expandableNode.onClickExpand();

            // Assert
            expect(expandableNode.collapse).toBeCalled();
        });
    });

    describe("onLoad", () => {
        beforeEach(() => {
            expandableNode.expand = jest.fn();
            expandableNode.collapse = jest.fn();
        });

        it("should grant for expandableOpacity", () => {
            // Arrange
            const expandableOpacity = expandableNode.expandableNode.getComponent(UIOpacity);

            // Act
            expandableNode.onLoad();

            // Assert
            expect(expandableNode["expandableOpacity"]).toEqual(expandableOpacity);
        });

        it("should call expand when defaultExpand is true", () => {
            // Arrange
            expandableNode.defaultExpand = true;

            // Act
            expandableNode.onLoad();

            // Assert
            expect(expandableNode.expand).toBeCalled();
        });

        it("should call collapse when defaultExpand is false", () => {
            // Arrange
            expandableNode.defaultExpand = false;

            // Act
            expandableNode.onLoad();

            // Assert
            expect(expandableNode.collapse).toBeCalledWith(false);
        });
    });

    describe("collapse", () => {
        beforeEach(() => {
            expandableNode.tweenCollapse = jest.fn();
        });

        it("should not call tweenCollapse, when animated false", () => {
            // Arrange
            expandableNode["expandableOpacity"] = new UIOpacity();

            // Act
            expandableNode.collapse(false);

            // Assert
            expect(expandableNode["expanded"]).toBe(false);
            expect(expandableNode.tapToCollapseNode.active).toBe(false);
            expect(expandableNode["expandableOpacity"].opacity).toBe(1);
            expect(expandableNode.expandableNode.scale).toEqual(expandableNode["collapseScale"]);
            expect(expandableNode.tweenCollapse).not.toBeCalled();
        });

        it("should call tweenCollapse, when animated true", () => {
            // Arrange
            expandableNode["expandableOpacity"] = new UIOpacity();

            // Act
            expandableNode.collapse(true);

            // Assert
            expect(expandableNode["expanded"]).toBe(false);
            expect(expandableNode.tapToCollapseNode.active).toBe(false);
            expect(expandableNode.tweenCollapse).toBeCalled();
        });
    });

    describe("expand", () => {
        beforeEach(() => {
            expandableNode.tweenExpand = jest.fn();
        });

        it("should call tweenExpand", () => {
            // Arrange

            // Act
            expandableNode.expand();

            // Assert
            expect(expandableNode["expanded"]).toBe(true);
            expect(expandableNode.tapToCollapseNode.active).toBe(true);
            expect(expandableNode.tweenExpand).toBeCalled();
        });
    });

    describe("tweenExpand", () => {
        beforeEach(() => {
            expandableNode["expandableOpacity"] = new UIOpacity();
        });

        it("should call stopAllByTarget then call tween", () => {
            // Arrange
            // Act
            expandableNode.tweenExpand();

            // Assert
            expect(Tween.stopAllByTarget).toBeCalledWith(expandableNode.expandableNode);
            expect(Tween.stopAllByTarget).toBeCalledWith(expandableNode["expandableOpacity"]);
        });
    });

    describe("tweenCollapse", () => {
        beforeEach(() => {
            expandableNode["expandableOpacity"] = new UIOpacity();
        });

        it("should call stopAllByTarget then call tween", () => {
            // Arrange

            // Act
            expandableNode.tweenCollapse();

            // Assert
            expect(Tween.stopAllByTarget).toBeCalledWith(expandableNode.expandableNode);
            expect(Tween.stopAllByTarget).toBeCalledWith(expandableNode["expandableOpacity"]);
            expect(tween).toBeCalledWith(expandableNode.expandableNode);
            expect(tween).toBeCalledWith(expandableNode["expandableOpacity"]);
        });
    });
});
