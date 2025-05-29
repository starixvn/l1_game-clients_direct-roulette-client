import {
    _decorator,
    Component,
    Node,
    Camera,
    RenderTexture,
    ImageAsset,
    view,
    Size,
    Texture2D,
    SpriteFrame,
    Sprite,
    UITransform,
    sys,
    log,
    error,
    Button,
    assetManager,
    instantiate,
    Vec3,
    Label,
    native,
} from "cc";
import { Canvas2Image } from "./canvas-to-image";
const { ccclass, property } = _decorator;

@ccclass("ScreenshotMultipleNodes2D")
export class ScreenshotMultipleNodes2D extends Component {
    @property(Camera)
    copyCamera: Camera = null!;

    // @property(Node)
    targetNode: Node = null!;

    @property(Button)
    downloaderBtn: Button = null!;

    @property(Node)
    copyNode: Node = null!;

    @property({
        type: [Node],
        displayName: "Target Nodes Array",
    })
    targetNodes: Node[] = [];

    @property(Label)
    tips: Label = null!;

    rt: RenderTexture = null;

    _canvas: HTMLCanvasElement = null!;

    // _buffer: ArrayBufferView = null!;

    canvas2image: Canvas2Image = null!;

    isDoneScreenShot: boolean = false;

    start() {
        this.canvas2image = Canvas2Image.getInstance();
    }

    processItemsSequentially(index = 0) {
        if (index >= this.targetNodes.length) {
            return Promise.resolve("All items processed successfully");
        }

        console.log(`---------------------`);
        console.log(`items ${[index]}`);

        return this.screenShotSingleScreenShot(index)
            .then(() => {
                return this.processItemsSequentially(index + 1);
            })
            .catch((error) => {
                console.error(`Error processing item ${index}:`, error);
                return Promise.reject(error);
            });
    }

    screenShotSingleScreenShot(index: number) {
        return new Promise((resolve, reject) => {
            try {
                const targetNode = this.targetNodes[index];

                const rt = new RenderTexture();
                rt.reset({
                    width: view.getVisibleSize().width,
                    height: view.getVisibleSize().height,
                });

                this.copyCamera.targetTexture = rt;

                this.scheduleOnce(() => {
                    this.copyRenderTex(targetNode, rt);
                    resolve(`Success for item ${index}`);
                    console.log("screenShotSingleScreenShot done");
                }, 2);
            } catch (error) {
                console.error("Error in Level screenShotSingleScreenShot:", error);
                reject("Error in Level screenShotSingleScreenShot");
            }
        });
        //         const targetNode = this.targetNodes[index];
        //         const rt = new RenderTexture();
        //         rt.reset({
        //             width: view.getVisibleSize().width,
        //             height: view.getVisibleSize().height,
        //         });
        //         this.copyCamera.targetTexture = this.rt;
        //         this.copyRenderTex(targetNode, rt);
        //         resolve(`Success for item ${index}`);
        //         console.log("screenShotSingleScreenShot done");
        //     } catch (error) {
        //         console.error("Error in promise chain:", error);
        //         reject("Error in Level screenShotSingleScreenShot");
        //     }

        //     // this.levelOne()
        //     //     // .then((_buffer) => {
        //     //     //     this.levelTwo(_buffer);
        //     //     // })
        //     //     .then(() => {
        //     //         this.targetNode = this.targetNodes[index];
        //     //         this.rt = new RenderTexture();
        //     //         this.rt.reset({
        //     //             width: view.getVisibleSize().width,
        //     //             height: view.getVisibleSize().height,
        //     //         });
        //     //         this.copyCamera.targetTexture = this.rt;
        //     //         this.capture();
        //     //         resolve(`Success for item ${index}`);
        //     //         console.log("screenShotSingleScreenShot done");
        //     //     })
        //     //     .catch((error) => {
        //     //         console.error("Error in promise chain:", error);
        //     //         reject("Error in Level screenShotSingleScreenShot");
        //     //     });
        // });
    }

    copyRenderTex(targetNode: Node, rt) {
        var width = targetNode.getComponent(UITransform).width;
        var height = targetNode.getComponent(UITransform).height;
        var worldPos = targetNode.getWorldPosition();
        const _buffer = rt.readPixels(Math.round(worldPos.x), Math.round(worldPos.y), width, height);

        // this.showImage(width, height, _buffer);
        this.savaAsImage(width, height, _buffer, targetNode.name);
    }

    showImage(width: number, height: number, _buffer: any) {
        let img = new ImageAsset();

        img.reset({
            _data: _buffer,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false,
        });

        let texture = new Texture2D();
        texture.image = img;
        let sf = new SpriteFrame();
        sf.texture = texture;
        sf.packable = false;

        this.copyNode!.getComponent(Sprite).spriteFrame = sf;
        this.copyNode!.getComponent(Sprite).spriteFrame.flipUVY = true;
        this.copyNode?.getComponent(UITransform)?.setContentSize(new Size(width, height));

        this.downloaderBtn.node.active = true;
        this.tips.string = `Screenshot Successful`;
    }

    savaAsImage(width: number, height: number, arrayBuffer: any, fileName: string) {
        console.log(`width: ${width}; height: ${height}; time:${Date.now()}`);
        this.clearCanvas();

        if (!this._canvas) {
            this._canvas = document.createElement("canvas");
            this._canvas.width = width;
            this._canvas.height = height;
        } else {
        }

        let ctx = this._canvas.getContext("2d")!;
        let rowBytes = width * 4;

        for (let row = 0; row < height; row++) {
            let sRow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = sRow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = arrayBuffer[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }

        //@ts-ignore
        this.canvas2image.saveAsPNG(this._canvas, width, height, fileName);
        this.tips.string = `Save picture successfully`;
    }

    clearCanvas() {
        this._canvas = null;
    }

    onSaveImageBtnClicked() {
        this.processItemsSequentially()
            .then((message) => {
                console.log(message);
            })
            .catch((error) => {
                console.error("Error processing items:", error);
            });
    }
}
