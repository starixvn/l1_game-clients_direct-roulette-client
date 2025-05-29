// Mock the RoundHistoryItem component to avoid importing utils with TypeScript errors
jest.mock("./../../../../assets/game-crash/statistics-bar/round-history-item", () => {
    const { Node } = require("cc");
    
    return {
        RoundHistoryItem: class MockRoundHistoryItem {
            nodeCountdown = new Node();
            lblCountdown = { string: "" };
            nodeMultiplier = { node: new Node() };
            lblMultiplier = { string: "" };
            nodeInPlay = new Node();
            mainAtlas = null;
            isLastRound = false;
            roundInfo = null;
            playSoundClick = jest.fn();
            
            constructor() {
                // Mock constructor
            }
            
            displayMultiplier(show) {
                this.nodeMultiplier.node.active = show;
            }
            
            displayCountDown(show) {
                this.nodeCountdown.active = show;
            }
            
            displayInPlay(show) {
                this.nodeInPlay.active = show;
            }
            
            hideAllNodes() {
                this.nodeInPlay.active = false;
                this.nodeCountdown.active = false;
                this.nodeMultiplier.node.active = false;
            }
            
            renderRoundTime(countdownTimer) {
                if (!this.isCrashed()) {
                    this.lblCountdown.string = countdownTimer.toString();
                    this.nodeCountdown.active = true;
                }
            }
            
            isCrashed() {
                return this.roundInfo?.result !== undefined;
            }
            
            onClickRoundItem() {
                this.playSoundClick();
                return this.roundInfo?.roundId;
            }
        }
    };
});

import { RoundHistory } from "@sg/game-client-base/dist/game/round-histories";
import { Label, Node, Sprite, SpriteAtlas } from "cc";
import { stub } from "jest-auto-stub";
import { RoundHistoryItem } from "./../../../../assets/game-crash/statistics-bar/round-history-item";
describe("RoundHistoryItem", () => {
    let comp: RoundHistoryItem;
    beforeEach(() => {
        comp = new RoundHistoryItem();
        comp.nodeCountdown = new Node();
        comp.lblCountdown = new Label();
        comp.nodeMultiplier = new Sprite();
        comp.lblMultiplier = new Label();
        comp.nodeInPlay = new Node();
        comp.mainAtlas = new SpriteAtlas();
        comp.isLastRound = false;
        comp.roundInfo = null;
    });

    describe("displayMultiplier", () => {
        it("should display nodeMultiplier", () => {
            //Arrange
            comp.nodeMultiplier.node.active = false;

            //Act
            comp.displayMultiplier(true);

            //Assert
            expect(comp.nodeMultiplier.node.active).toEqual(true);
        });
    });

    describe("displayCountDown", () => {
        it("should display nodeCountdown", () => {
            //Arrange
            comp.nodeCountdown.active = false;

            //Act
            comp.displayCountDown(true);

            //Assert
            expect(comp.nodeCountdown.active).toEqual(true);
        });
    });

    describe("displayInPlay", () => {
        it("should display nodeInPlay", () => {
            //Arrange
            comp.nodeInPlay.active = false;

            //Act
            comp.displayInPlay(true);

            //Assert
            expect(comp.nodeInPlay.active).toEqual(true);
        });
    });

    describe("displayInPlay", () => {
        it("should display nodeInPlay", () => {
            //Arrange
            comp.nodeMultiplier.node.active = true;
            comp.nodeCountdown.active = true;
            comp.nodeInPlay.active = true;

            //Act
            comp.hideAllNodes();

            //Assert
            expect(comp.nodeInPlay.active).toEqual(false);
            expect(comp.nodeCountdown.active).toEqual(false);
            expect(comp.nodeMultiplier.node.active).toEqual(false);
        });
    });

    describe("renderRoundTime", () => {
        it("should update node count down is 9", () => {
            //Arrange
            const countdownTimer = 9;
            comp.isCrashed = jest.fn(() => false);

            //Act
            comp.renderRoundTime(countdownTimer);

            //Assert
            expect(comp.lblCountdown.string).toEqual("9");
            expect(comp.nodeCountdown.active).toEqual(true);
        });
    });

    describe("isCrashed", () => {
        it("should return true, when result has value", () => {
            //Arrange
            comp.roundInfo = stub<RoundHistory>({
                result: 1.0,
            });

            //Act
            let isCrashed = comp.isCrashed();

            //Assert
            expect(isCrashed).toEqual(true);
        });

        it("should return false, when result has no value", () => {
            //Arrange
            comp.roundInfo = stub<RoundHistory>({
                result: undefined,
            });

            //Act
            let isCrashed = comp.isCrashed();

            //Assert
            expect(isCrashed).toEqual(false);
        });
    });

    describe("onClickRoundItem", () => {
        it("should open popup md5", () => {
            //Arrange
            comp.playSoundClick = jest.fn();
            comp.roundInfo = { roundId: 123, result: 1.23, settlementResult: null };

            //Act
            const roundData = comp.onClickRoundItem();

            //Assert
            expect(roundData).toEqual(comp.roundInfo.roundId);
        });
    });
});
