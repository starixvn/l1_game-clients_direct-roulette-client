import { _decorator, Component, Node, Vec2, Vec3, Size, UITransform, input, Input, Collider2D, Widget } from 'cc';
import { IRouletteBetInfo, RouletteBetType, IBetChoices } from '../roulette-choices';
import RouletteUtils from '../roulette-utils';
import { RouletteNumber } from './roulette-number';

const { ccclass, property } = _decorator;

@ccclass('RouletteBoard')
export class RouletteBoard extends Component {
    @property(Node)
    touchArea: Node = null;

    @property(Node)
    gridStartNode: Node = null;

    @property(Node)
    chipContainer: Node = null;

    @property(Node)
    otherChipContainer: Node = null;

    @property(Node)
    numberContainer: Node = null;

    @property(Node)
    number0ColliderNode: Node = null; // Drag the number 0 collider node here

    middleCellOffset = 12;

    private cellSize: Size = new Size();
    private rouletteNumbers: RouletteNumber[] = [];

    private betChoices: IBetChoices = {};
    private otherBetChoices: IBetChoices = {};

    public callback = {
        selected: (betInfo: IRouletteBetInfo) => {}
    };

    onLoad() {
        const gridTransform = this.gridStartNode.getComponent(UITransform);
        const gridWidget = this.gridStartNode.getComponent(Widget);
        
        this.cellSize = new Size(gridTransform.width, gridTransform.height);
        this.middleCellOffset = gridWidget ? gridWidget.left : 12;
        // this.initGroupBetItems();
        this.rouletteNumbers = this.numberContainer.children.map((child) => child.getComponent(RouletteNumber));
        
        this.touchArea.on(Node.EventType.MOUSE_ENTER, this.onTouchMove, this);
        this.touchArea.on(Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.touchArea.on(Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);

        console.log('🎯 RouletteBoard initialized - Vertical layout (3x12), Cell size:', this.cellSize.width, 'x', this.cellSize.height);
    }

    onDestroy() {
        this.touchArea.off(Node.EventType.MOUSE_ENTER, this.onTouchMove, this);
        this.touchArea.off(Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.touchArea.off(Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onTouchCancel(e) {
        this.clearHighlight();
    }

    onTouchMove(e) {
        // Convert Vec2 mouse position to Vec3 (required for Cocos Creator v3)
        const mousePosition = new Vec3(e.getLocation().x, e.getLocation().y, 0);
        
        // Get local coordinate using UITransform component
        const localLocation = this.touchArea.getComponent(UITransform).convertToNodeSpaceAR(mousePosition);
        
        // Calculate relative position from grid start
        const gridPosition = this.gridStartNode.getPosition();
        
        console.log("gridPosition type:", typeof gridPosition, gridPosition);
        console.log("localLocation type:", typeof localLocation, localLocation);

        // debugger;
        
        // Try manual subtraction instead of .subtract() method
        const location = new Vec3(
            Math.abs(localLocation.x - gridPosition.x),
            Math.abs(localLocation.y - gridPosition.y),
            0
        );

        console.log("localLocation", "x: " + localLocation.x, "y: " + localLocation.y);
        console.log("gridStartNode", "x: " + this.gridStartNode.getPosition().x, "y: " + this.gridStartNode.getPosition().y);
        console.log("location", "x: " + location.x, "y: " + location.y);

        if (location.x < 0 && location.y < 0) {
            this.clearHighlight();
            return;
        }

        const betInfo = this.getBetInfo(new Vec2(location.x, location.y));
        this.internalHighlight(true, betInfo.numbers);
    }

    internalHighlight(highlight, numbers) {
        if (highlight) {
            this.highlightNumbers(numbers);
            //this.showBetDetailTips();
        } else {
            this.clearHighlight();
        }
    }

    highlightNumbers(numbers: number[]) {
        this.rouletteNumbers.forEach((number) => {
            const numberValue = parseInt(number.node.name);
            if (numbers.includes(numberValue)) {
                number.showHighlight();
            } else {
                number.clearHighlight();
            }
        });
    }

    clearHighlight() {
        this.rouletteNumbers.forEach((number) => {
            number.clearHighlight();
        });
    }

    getBetInfo(location: Vec2): IRouletteBetInfo {
        const col = Math.floor(location.x / this.cellSize.width);
        const row = Math.floor(location.y / this.cellSize.height);

        console.log("col: ", col, "row: ", row);

        const offsetX = location.x - col * this.cellSize.width;
        const offsetY = location.y - row * this.cellSize.height;

        const colArr = [col];
        let rowArr = [row];
        
        // Edge detection for multi-number bets
        if (offsetX < this.middleCellOffset) {
            colArr.push(col - 1);
        } else if (offsetX > this.cellSize.width - this.middleCellOffset) {
            colArr.push(col + 1);
        }

        if (offsetY < this.middleCellOffset) {
            rowArr.push(row - 1);
        } else if (offsetY > this.cellSize.height - this.middleCellOffset) {
            rowArr.push(row + 1);
        }

        let selectNumbers = this.getSelectNumbersOnBetInfo(colArr, rowArr);
        selectNumbers = [...new Set(selectNumbers)].sort((a, b) => a - b);
        const count = selectNumbers.length;
        let type: RouletteBetType;

        switch (count) {
            case 6:
                type = RouletteBetType.Line;
                break;
            case 4:
                type = RouletteBetType.Corner;
                break;
            case 3:
                type = RouletteBetType.Triangle;
                break;
            case 2:
                type = RouletteBetType.Split;
                break;
            default:
                type = RouletteBetType.StraightUp;
                break;
        }

        return {
            type: type,
            numbers: selectNumbers
        };
    }

    getSelectNumbersOnBetInfo(colArr: number[], rowArr: number[]) {
        const selectNumbers = [];
        colArr.forEach((colElement) => {
            rowArr.forEach((rowElement) => {
                const element = this.getNumber(colElement, rowElement);
                if (element !== -1) {
                    selectNumbers.push(element);
                }
            });
        });

        return selectNumbers;
    }

    getNumber(col: number, row: number): number {
        
        if (row < 0 || col < 0) {
            return -1;
        }
        
        // Clamp to valid range for vertical layout (3 columns, 12 rows)
        if (col > 2 || row > 11) {
            return -1;
        }

        // Vertical layout formula: numbers increase down each column
        // [1] [2] [3]   <- row 0
        // [4] [5] [6]   <- row 1  
        // [7] [8] [9]   <- row 2
        // Formula: row * 3 + col + 1
        const number = row * 3 + col + 1;
        
        return number;
    }
} 