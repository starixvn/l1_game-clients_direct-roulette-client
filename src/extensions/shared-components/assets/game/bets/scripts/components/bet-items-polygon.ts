import {
    Camera,
    Color,
    EventTouch,
    Intersection2D,
    Node,
    PolygonCollider2D,
    UIRenderer,
    Vec2,
    Vec3,
    _decorator,
    instantiate,
    v3,
} from "cc";
import { EDITOR } from "cc/env";
import BetItem from "./bet-item";
import { BetItems } from "./bet-items";
const { ccclass, property } = _decorator;

@ccclass
export class BetItemsPolygon extends BetItems {
    @property
    enableFixSingleCamera3D = false;

    @property(Node)
    debugSample: Node = null;

    onLoad() {
        super.onLoad();
        this.node.on(Node.EventType.TOUCH_END, this.handleBetItemClick, this);
    }

    protected start(): void {
        this.drawDebug();
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.handleBetItemClick, this);
        super.onDestroy();
    }

    drawDebug() {
        if (!this.debugSample) {
            return;
        }
        const colliders = this.node.children.map((item) => this.getCollider(item));
        colliders.forEach((collider) => {
            if (collider) {
                collider.worldPoints.forEach((worldPoint) => {
                    this.drawDebugNode(worldPoint);
                });
            }
        });
    }

    getCollider(node: Node) {
        const colliders = node.getComponentsInChildren(PolygonCollider2D);
        if (colliders.length === 0) {
            return null;
        }

        return colliders[0];
    }

    private drawDebugNode(worldPoint: Readonly<Vec2>, isRed = false) {
        if (!this.debugSample) {
            return;
        }
        const node = instantiate(this.debugSample);
        this.node.addChild(node);
        node.active = true;
        node.setWorldPosition(v3(worldPoint.x, worldPoint.y, 0));
        node.getComponent(UIRenderer).color = isRed ? Color.RED : Color.GREEN;
    }

    checkCollider(location: Vec2, collider: PolygonCollider2D) {
        return Intersection2D.pointInPolygon(location, collider.worldPoints);
    }

    handleBetItemClick(event: EventTouch) {
        let location = event.getUILocation();

        if (this.enableFixSingleCamera3D) {
            location = event.getLocation();

            const v3WorldPt = new Vec3();
            // Convert Screen Space into World Space.
            Vec3.set(v3WorldPt, location.x, location.y, 0); // vec3 screen pos

            const camera = this._getRenderScene().cameras[0];
            // HACK: temporarily change to OTHOR to fix touch
            if (!EDITOR) {
                camera.projectionType = Camera.ProjectionType.ORTHO;
            }
            camera.screenToWorld(v3WorldPt, v3WorldPt);
            if (!EDITOR) {
                camera.projectionType = Camera.ProjectionType.PERSPECTIVE;
            }
            Vec2.set(location, v3WorldPt.x, v3WorldPt.y);
        }

        const betItem = this.node.children.find((item) => {
            const collider = this.getCollider(item);
            if (!collider) {
                return false;
            }
            return this.checkCollider(location, collider);
        });

        if (!betItem) {
            return;
        }
        betItem.getComponent(BetItem)?.callBet();
    }
}
