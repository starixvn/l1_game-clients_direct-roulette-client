import { Canvas, Node, UITransform, Vec3, director, game, screen } from "cc";
import { Identifier } from "./identifier";

export function getIdentifiers() {
    return director.getScene().getComponentsInChildren(Identifier);
}

export function getIdentifier(id: string) {
    return getIdentifiers().find((identifier) => identifier.id === id);
}

export function getMainCamera() {
    return director.getScene().getComponentInChildren(Canvas).cameraComponent;
}

export function click(node: Node) {
    const camera = getMainCamera();
    const ui = node.getComponent(UITransform);
    const world = ui.convertToWorldSpaceAR(Vec3.ZERO);
    const { x, y } = camera.worldToScreen(world);
    const location = {
        clientX: x / screen.devicePixelRatio,
        clientY: (screen.windowSize.height - y) / screen.devicePixelRatio,
    };

    const mouseDown = new MouseEvent("mousedown", location);
    const mouseUp = new MouseEvent("mouseup", location);

    game.canvas.dispatchEvent(mouseDown);
    game.canvas.dispatchEvent(mouseUp);
}
