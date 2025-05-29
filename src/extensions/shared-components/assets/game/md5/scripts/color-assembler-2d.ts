// author: http://lamyoung.com/

import { Component, _decorator, Node, UIRenderer, Color, director, Director, Graphics } from "cc";
const { ccclass, property, executeInEditMode, requireComponent, menu } = _decorator;

@ccclass
@executeInEditMode
@requireComponent(UIRenderer)
@menu("ColorAssembler2D")
export default class ColorAssembler2D extends Component {
    @property
    private _colors: Color[] = [];
    @property({ type: [Color] })
    public get colors() {
        return this._colors;
    }
    public set colors(colors) {
        this._colors = colors;
        this.updateColors();
    }
    onLoad() {
        this.node.on(Node.EventType.SIZE_CHANGED, this.updateColors, this);
    }

    onEnable() {
        director.once(Director.EVENT_AFTER_DRAW, this.updateColors, this);
    }

    onDisable() {
        director.off(Director.EVENT_AFTER_DRAW, this.updateColors, this);
    }

    updateColors() {
        const cmp = this.getComponent(UIRenderer);
        if (!cmp) {
            return;
        }
        const _assembler = cmp["_assembler"];
        if (!(_assembler instanceof cc["Assembler2D"])) {
            return;
        }
        const uintVerts = _assembler._renderData.uintVDatas[0];
        if (!uintVerts) {
            return;
        }
        const color = this.node.getComponent(Graphics).color;
        const floatsPerVert = _assembler.floatsPerVert;
        const colorOffset = _assembler.colorOffset;
        let count = 0;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = (this.colors[count] || color)["_val"];
            count++;
        }
    }
}
// 欢迎关注微信公众号[白玉无冰]

/**
█████████████████████████████████████
█████████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄██▀▄ ▄▄██ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄▀▀▀█▄▀█ █   █ ████
████ █▄▄▄█ █▀ █▀▀▀ ▀▄▄ ▄ █ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ ▀▄█▄▀ █▄▄▄▄▄▄▄████
████▄▄  ▄▀▄▄ ▄▀▄▀▀▄▄▄ █ █ ▀ ▀▄█▄▀████
████▀ ▄  █▄█▀█▄█▀█  ▀▄ █ ▀ ▄▄██▀█████
████ ▄▀▄▄▀▄ █▄▄█▄ ▀▄▀ ▀ ▀ ▀▀▀▄ █▀████
████▀ ██ ▀▄ ▄██ ▄█▀▄ ██▀ ▀ █▄█▄▀█████
████   ▄██▄▀ █▀▄▀▄▀▄▄▄▄ ▀█▀ ▀▀ █▀████
████ █▄ █ ▄ █▀ █▀▄█▄▄▄▄▀▄▄█▄▄▄▄▀█████
████▄█▄█▄█▄█▀ ▄█▄   ▀▄██ ▄▄▄ ▀   ████
████ ▄▄▄▄▄ █▄██ ▄█▀  ▄   █▄█  ▄▀█████
████ █   █ █ ▄█▄ ▀  ▀▀██ ▄▄▄▄ ▄▀ ████
████ █▄▄▄█ █ ▄▄▀ ▄█▄█▄█▄ ▀▄   ▄ █████
████▄▄▄▄▄▄▄█▄██▄▄██▄▄▄█████▄▄█▄██████
█████████████████████████████████████
█████████████████████████████████████
 */
