import { Node, UITransform, Vec3, tween, v3 } from "cc";
import { random } from "lodash-es";

export namespace FlyChipUtils {
    export const getRandomPositionChip = (chip: Node, box: Node): Vec3 => {
        if (chip && box) {
            const chipBoundingBox = chip.getComponent(UITransform).getBoundingBox();
            const xDest = random(
                Math.floor(chip.getComponent(UITransform).width / 4),
                Math.floor(box.getComponent(UITransform).width - chipBoundingBox.width / 2) + 1
            );
            const yDest = random(
                Math.floor(chip.getComponent(UITransform).height / 4),
                Math.floor(box.getComponent(UITransform).height - chipBoundingBox.height / 2) + 1
            );
            return v3(xDest, yDest);
        }

        return v3(0, 0);
    };

    export const moveChipThenDestroy = (chip: Node, destBoxInChipBoxSpacePosition: Vec3, chipFlyingTime: number) => {
        chip &&
            tween(chip)
                .then(moveChipTo(chip, destBoxInChipBoxSpacePosition, chipFlyingTime))
                .delay(0.5 * chipFlyingTime)
                .call(() => chip.destroy())
                .start();
    };

    export const moveChipTo = (chip: Node, randomPosition: Vec3, flyingDuration: number, onComplete?: () => void) => {
        return tween(chip)
            .to(flyingDuration, { position: v3(randomPosition.x, randomPosition.y, 0) }, { easing: "sineOut" })
            .call(() => {
                onComplete && onComplete();
            })
            .start();
    };
}
