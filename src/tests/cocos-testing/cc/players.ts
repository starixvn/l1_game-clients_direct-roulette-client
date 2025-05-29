export class Layers {
    /**
     * @en All layers in an Enum
     * @zh 以 Enum 形式存在的所有层列表
     */
    static Enum = {
        NONE: 0,
        IGNORE_RAYCAST: 1,
        GIZMOS: 2,
        EDITOR: 3,
        UI_3D: 4,
        SCENE_GIZMO: 5,
        UI_2D: 6,
        PROFILER: 7,
        DEFAULT: 8,
        ALL: 9,
    };
    /**
     * @en All layers in [[BitMask]] type
     * @zh 包含所有层的 [[BitMask]]
     */
    static BitMask = {
        NONE: 0,
        IGNORE_RAYCAST: 1,
        GIZMOS: 2,
        EDITOR: 3,
        UI_3D: 4,
        SCENE_GIZMO: 5,
        UI_2D: 6,
        PROFILER: 7,
        DEFAULT: 8,
        ALL: 9,
    };

    addLayer = jest.fn();
}
