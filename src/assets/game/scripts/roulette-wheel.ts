import { _decorator, sp, Node, Skeleton, v3, tween } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import gc from "@sg/game-client-base";
import { ResultNumber } from "./result-number";
import { each, filter, has, random, round, delay, fill, isNil, range, times, isNaN } from "lodash-es";

const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

enum WheelAnimation {
    WHEEL_IDLE = "Wheel Idle",
    WHEEL_IN = "Wheel In",
    WHEEL_LOOP_TRANSITION = "Wheel Loop Transition",
    WHEEL_LOOP = "Wheel Loop",
    BALL_IDLE = "Ball Idle",
    BALL_IN = "Ball In",
    BALL_LOOP_TRANSITION = "Ball Loop Transition",
    BALL_LOOP = "Ball Loop",
    BALL_HIT_OUT_LOWER = "Ball Hit Out ",
    BALL_NO_HIT_OUT = "Ball No Hit Out ",
    BALL_HIT_OUT_UPPER = "Ball Hit Out Upper ",
    WHEEL_HIT_OUT_NAME = "Wheel Hit Out ",
    BALL_STOP_TARGET_SECTOR_1_FORWARD = "Ball Stop c ",
    BALL_STOP_TARGET_SECTOR_2_FORWARD = "Ball Stop e ",
    BALL_STOP_TARGET_SECTOR_0_1 = "Ball Stop d ",
    BALL_STOP_TARGET_SECTOR_0_2 = "Ball Stop No Hit ",
    BALL_SKIP = "Ball Skip",
    WHEEL_STOP_TRANSITION = "Wheel Stop Transition",
    BALL_POST_COLLISION_TRANSITION_LOWER_FORWARD = "Ball Post Collision Transition ",
    BALL_POST_COLLISION_TRANSITION_UPPER_FORWARD = "Ball-Post-Collission-Transition-Upper-Forward-",
    BALL_POST_COLLISION_TRANSITION_LOWER_BACKWARD = "Ball-Post-Collission-Transition-Backward ",
}

@ccclass
export class RouletteWheel extends ObserverComponent {
    @property(sp.Skeleton)
    animation: sp.Skeleton = null;

    @property(ResultNumber)
    resultNumber: ResultNumber = null;

    wheelTrack = 0;
    ballTrack = 1;
    timeScale = 0;
    initBallRotation = 0;

    rotateBallBone: any;
    isFromRestore = false;
    resultReceived = false;
    sectorsNumber: number;
    sectorStartAngle: number;
    sectorInitialAngle: number;
    numberRotationDegree: number;
    numberLocalIndex: number;
    startAngleDegrees: number;
    wheelNumbersIndices: number[];
    wheelNumbersRotations: number[] = [];
    currentNumberColorVO: any;
    numbersColorsVOs: any[] = [];
    landingAnimationGroups: any[] = [];
    landingAnimationGroup: any;

    fullRotationDegrees = 360;
    MIN_DEGREE = 0;
    MAX_DEGREE = 180;
    WHEEL_DEGREE_STEP = 45;
    BALL_HIT_OUT_DEGREE_STEP = 45;

    onLoad() {
        this.initWheel();
        this.resultNumber.hide();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playStoppableSFX(id))
    playStoppableSFX(id: string) {
        return id;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.stopStoppableSFX(id))
    stopStoppableSFX(id: string) {
        return id;
    }

    showResultNumber(result: number) {
        this.resultNumber.setNumber(result);
        this.resultNumber.show();

        const node = this.resultNumber.node;
        node.setScale(v3(0, 0, 0));

        tween(node)
            .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .start();
    }

    hideResultNumber() {
        const node = this.resultNumber.node;
        tween(node)
            .to(0.5, { scale: v3(0, 0, 0) }, { easing: "backIn" })
            .call(() => this.resultNumber.hide())
            .start();
    }

    showResult(result: number, onComplete: () => void) {
        console.log("--------showResult");
        this.prepareWheelSpinAnimation();

        const t = { resultNumber: result + 1 };
        console.log("--------onWheelUpdateResultNumber");
        this.onWheelUpdateResultNumber(t);

        tween(this.node)
            .delay(9)
            .call(() => {
                this.showResultNumber(result);
                onComplete();
            })
            .start();
    }

    setResult(result: number) {
        const lastResult = result;
        this.numberRotationDegree = this.wheelNumbersRotations[lastResult];
        this.startIdleAnimation();
    }

    onSkip() {
        const e = this.getCurrentWheelDegree();
        this.forceBallStopAnimation(e);
    }

    onSpinClick() {
        this.prepareWheelSpinAnimation();
    }

    pauseAnimation() {
        this.animation.timeScale = 0;
    }

    resumeAnimation() {
        this.animation.timeScale = this.timeScale;
    }

    convertTo360(t) {
        return t < 0 ? this.fullRotationDegrees + t : t;
    }

    getCurrentWheelDegree() {
        let t;
        this.pauseAnimation();
        const e = this.animation.getState().getCurrent(this.wheelTrack);
        const i = this.getRotationDataFromTrack(e);
        const n = e.getAnimationTime();
        let o = i.angle - i.frames[1];

        return (
            0 === o && (o += this.fullRotationDegrees),
            (o = this.convertTo360(o)),
            (t = (n / i.frameTime) * o + i.frames[1]) > this.fullRotationDegrees / 2 && (t -= this.fullRotationDegrees),
            this.resumeAnimation(),
            t
        );
    }

    getRotationDataFromTrack(t) {
        const e: any = {};
        if (!isNil(t)) {
            const i = t.animation;
            const o = filter(i.timelines, (t) => {
                return t instanceof sp.spine.RotateTimeline;
            })[0];
            if (!isNil(o)) {
                const r = o.frames.length >> 1;
                const s = t.getAnimationTime();
                const a = this.binarySearch(o.frames, s, sp.spine.RotateTimeline.ENTRIES);
                (e.name = i.name),
                    (e.frames = o.frames),
                    (e.frameIndex = a),
                    (e.frameTime = o.frames[a]),
                    (e.angle = o.frames[a + 1]),
                    (e.size = r);
            }
        }
        return e;
    }

    private binarySearch(values, target, step) {
        if (step === void 0) {
            step = 1;
        }
        var low = 0;
        var high = values.length / step - 2;
        if (high == 0) return step;
        var current = high >>> 1;
        while (true) {
            if (values[(current + 1) * step] <= target) low = current + 1;
            else high = current;
            if (low == high) return (low + 1) * step;
            current = (low + high) >>> 1;
        }
    }

    getRotationDataFromAnimation(t) {
        const e: any = {},
            i = this.getAnimationRotationTimeline(t);
        const o = i.frames.length >> 1,
            s = this.binarySearch(i.frames, 0, sp.spine.RotateTimeline.ENTRIES);

        (e.name = t), (e.frames = i.frames), (e.frameIndex = s), (e.frameTime = i.frames[s]), (e.angle = i.frames[s + 1]), (e.size = o);
        return e;
    }

    getAnimationRotationTimeline(t) {
        const i = this.getAnimation(t);
        return filter(i.timelines, (t) => {
            return t instanceof sp.spine.RotateTimeline;
        })[0];
    }

    getAnimation(t) {
        return this.animation.findAnimation(t);
    }

    updateRotationTimeline(t, e) {
        const i = this.getAnimationRotationTimeline(t);
        each(e, (t, e) => {
            const n = e << 1;
            i.frames[n + 1] = t;
        });
    }

    adjustAnimationRotationTimeline(t, e) {
        const i = this.getRotationDataFromAnimation(t);
        if (has(i, "size")) {
            const o = this.getRotationFrameSteps(i.frames, i.size),
                r = this.getWheelDegreesArray(e, i.size, o);
            this.updateRotationTimeline(t, r);
        }
    }

    getWheelDegreesArray(t, e, i) {
        let o = this,
            r = new Array(e),
            s = t;
        return (
            fill(r, 0),
            each(range(e), (t) => {
                (r[t] = s), (s = o.getNextWheelDegreeValue(s, i[t]));
            }),
            r
        );
    }

    getRotationFrameSteps(t, e) {
        let i,
            o = [],
            r = filter(t, (t, e) => {
                return e % 2 != 0;
            });
        return (
            times(e - 1, (t) => {
                (i = r[t + 1] - r[t]) < 0 && (i += 360), o.push(i);
            }),
            o
        );
    }

    getNextWheelDegreeValue(e, i) {
        let n = NaN;
        if (e + i >= this.MAX_DEGREE) {
            const o = e + i - this.MAX_DEGREE;
            n = o > 0 ? -1 * (this.MAX_DEGREE - o) : this.MAX_DEGREE;
        } else {
            n = e + i;
        }

        return n;
    }

    getHitAnimationId(t) {
        let e = this.convertTo360(t),
            i = this.numberRotationDegree - e;
        return (i = this.convertTo360(i)), Math.ceil(i / this.BALL_HIT_OUT_DEGREE_STEP);
    }

    setWheelContactZone(t, e) {
        return (
            (t += e) <= 0 && (t += this.sectorsNumber),
            1 == t || 3 == t || Math.round(random(true)) ? (t += this.sectorsNumber) : (t += 0),
            t
        );
    }

    prepareBallHitAnimation(t, e) {
        const state = this.animation.getState();
        let i, n, o;
        let r = this.getHitAnimationId(t);

        r = this.setWheelContactZone(r, this.landingAnimationGroup.hitAnimationOffset);
        o = r % 2 ? Math.ceil(r / 2) - 1 : Math.ceil(r / 2);
        n = this.landingAnimationGroup.hitAnimation + o;
        i = WheelAnimation.WHEEL_HIT_OUT_NAME + Math.ceil(r / 2);

        if (this.animation.findAnimation(i)) {
            this.adjustAnimationRotationTimeline(i, t);
            const s = state.setAnimation(this.wheelTrack, i, false);
            const a = state.setAnimation(this.ballTrack, n, false);
            a.timeScale = (a.animation.duration / s.animation.duration) * s.timeScale;
            e.animationId = o;
            e.ballTrackEntry = a;
        }
    }

    runBallHitNonCollisionAnimationGroup1(t) {
        const state = this.animation.getState();
        const i: any = {};
        this.prepareBallHitAnimation(t, i);

        if (!isNil(i.ballTrackEntry)) {
            state.setListener({
                complete: () => {
                    this.pauseAnimation();
                    const n = this.getCurrentWheelDegree();
                    this.setBallStopAnimDataSector0(n, i.animationId);
                    state.setEmptyAnimation(this.ballTrack, 0);
                    this.resumeAnimation();
                    this.stopBallAnimation(n);
                },
                start: () => {},
                event: () => {},
                dispose: () => {},
                end: () => {},
                interrupt: () => {},
            });
        }
    }

    runBallHitCollisionAnimationGroup1(t) {
        const state = this.animation.getState();
        const i: any = {};
        this.prepareBallHitAnimation(t, i);

        if (!isNil(i.ballTrackEntry)) {
            i.ballTrackEntry.listener = {
                complete: () => {
                    this.pauseAnimation();
                    const n = this.getCurrentWheelDegree();
                    state.setEmptyAnimation(this.ballTrack, 0);
                    this.startBallPostCollisionTransitionAnimationGroup1(n, i.animationId);
                    this.resumeAnimation();
                },
            };
        }
    }

    runBallHitCollisionAnimationGroup2(t) {
        const state = this.animation.getState();
        const i: any = {};
        this.prepareBallHitAnimation(t, i);

        if (!isNil(i.ballTrackEntry)) {
            i.ballTrackEntry.listener = {
                complete: () => {
                    this.pauseAnimation();
                    const n = this.getCurrentWheelDegree();
                    state.setEmptyAnimation(this.ballTrack, 0);
                    this.startBallPostCollisionTransitionAnimationGroup2(n, i.animationId);
                    this.resumeAnimation();
                },
            };
        }
    }

    runBallHitCollisionAnimationGroup3(t) {
        const state = this.animation.getState();
        const i: any = {};
        this.prepareBallHitAnimation(t, i);

        if (!isNil(i.ballTrackEntry)) {
            i.ballTrackEntry.listener = {
                complete: () => {
                    this.pauseAnimation();
                    const n = this.getCurrentWheelDegree();
                    state.setEmptyAnimation(this.ballTrack, 0);
                    this.startBallPostCollisionTransitionAnimationGroup3(n, i.animationId);
                    this.resumeAnimation();
                },
            };
        }
    }

    startBallPostCollisionTransitionAnimationGroup1(t, e) {
        const n: any = {};
        this.prepareBallPostCollisionTransitionAnimation(t, e, n),
            isNil(n.ballTrackEntry) ||
                (n.ballTrackEntry.listener.complete = (t) => {
                    this.pauseAnimation();
                    const n = this.getCurrentWheelDegree();
                    this.animation.getState().setEmptyAnimation(this.ballTrack, 0),
                        this.setBallStopAnimDataSector1Forward(n, e),
                        this.resumeAnimation(),
                        this.stopBallAnimation(n);
                });
    }

    startBallPostCollisionTransitionAnimationGroup2(t, e) {
        const n: any = {};
        this.prepareBallPostCollisionTransitionAnimation(t, e, n),
            isNil(n.ballTrackEntry) ||
                (n.ballTrackEntry.listener.complete = (t) => {
                    this.pauseAnimation();
                    const n = this.getCurrentWheelDegree();
                    this.animation.getState().setEmptyAnimation(this.ballTrack, 0),
                        this.setBallStopAnimDataSector0(n, e),
                        this.resumeAnimation(),
                        this.stopBallAnimation(n);
                });
    }

    startBallPostCollisionTransitionAnimationGroup3(t, e) {
        const n: any = {};
        this.prepareBallPostCollisionTransitionAnimation(t, e, n),
            isNil(n.ballTrackEntry) ||
                (n.ballTrackEntry.listener.complete = (t) => {
                    this.pauseAnimation();
                    const n = this.getCurrentWheelDegree();
                    this.animation.getState().setEmptyAnimation(this.ballTrack, 0),
                        this.setBallStopAnimDataSector2Forward(n, e),
                        this.resumeAnimation(),
                        this.stopBallAnimation(n);
                });
    }

    startBallTransitionAnimation() {
        console.log("--------startBallTransitionAnimation");
        this.animation.setAnimation(this.ballTrack, WheelAnimation.BALL_LOOP_TRANSITION, false).listener = {
            complete: () => {
                console.log("--------startBallTransitionAnimation complete");
                this.pauseAnimation();
                const i = this.getCurrentWheelDegree();
                this.resumeAnimation();
                this.startBallLanding(i);
            },
            start: () => {
                console.log("--------startBallTransitionAnimation start");
            },
            interrupt: () => {
                console.log("--------startBallTransitionAnimation interrupt");
            },
            end: () => {
                console.log("--------startBallTransitionAnimation end");
            },
            dispose: () => {
                console.log("--------startBallTransitionAnimation dispose");
            },
            event: () => {
                console.log("--------startBallTransitionAnimation event");
            },
        };
    }

    prepareBallPostCollisionTransitionAnimation(t, e, i) {
        const animationName = WheelAnimation.WHEEL_HIT_OUT_NAME + this.landingAnimationGroup.transitionAnimationOffset;
        const state = this.animation.getState();

        if (!isNaN(t)) {
            this.adjustAnimationRotationTimeline(animationName, t);
        }

        state.setAnimation(this.wheelTrack, animationName, false);

        const transitionAnim = this.landingAnimationGroup.transitionAnimation + e;
        const trackEntry = state.addAnimation(this.ballTrack, transitionAnim, false, 0);
        i.ballTrackEntry = trackEntry;

        trackEntry.listener = {
            start: () => {
                console.log("--------prepareBallPostCollisionTransitionAnimation start");
                this.playStoppableSFX("ball_jumping_hit");
            },
            complete: () => {
                console.log("--------prepareBallPostCollisionTransitionAnimation complete");
            },
            event: () => {
                console.log("--------prepareBallPostCollisionTransitionAnimation event");
            },
            dispose: () => {
                console.log("--------prepareBallPostCollisionTransitionAnimation dispose");
            },
            end: () => {
                console.log("--------prepareBallPostCollisionTransitionAnimation end");
            },
            interrupt: () => {
                console.log("--------prepareBallPostCollisionTransitionAnimation interrupt");
            },
        };
    }

    initWheel() {
        this.timeScale = this.animation.timeScale;
        this.landingAnimationGroups = [
            {
                hitAnimation: WheelAnimation.BALL_NO_HIT_OUT,
                transitionAnimation: null,
                stopAnimation: WheelAnimation.BALL_STOP_TARGET_SECTOR_0_2,
                hitAnimationOffset: 0,
                transitionAnimationOffset: NaN,
            },
            {
                hitAnimation: WheelAnimation.BALL_HIT_OUT_LOWER,
                transitionAnimation: WheelAnimation.BALL_POST_COLLISION_TRANSITION_LOWER_FORWARD,
                stopAnimation: WheelAnimation.BALL_STOP_TARGET_SECTOR_1_FORWARD,
                hitAnimationOffset: -4,
                transitionAnimationOffset: 2,
            },
            {
                hitAnimation: WheelAnimation.BALL_HIT_OUT_LOWER,
                transitionAnimation: WheelAnimation.BALL_POST_COLLISION_TRANSITION_LOWER_BACKWARD,
                stopAnimation: WheelAnimation.BALL_STOP_TARGET_SECTOR_0_1,
                hitAnimationOffset: -2,
                transitionAnimationOffset: 2,
            },
            {
                hitAnimation: WheelAnimation.BALL_HIT_OUT_UPPER,
                transitionAnimation: WheelAnimation.BALL_POST_COLLISION_TRANSITION_UPPER_FORWARD,
                stopAnimation: WheelAnimation.BALL_STOP_TARGET_SECTOR_2_FORWARD,
                hitAnimationOffset: -4,
                transitionAnimationOffset: 1,
            },
        ];
        this.wheelNumbersIndices = [
            0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12,
            35, 3, 26,
        ];
        this.numbersColorsVOs = [
            { id: -1, value: " ", color: "empty" },
            { id: 0, value: "0", color: "green" },
            { id: 1, value: "00", color: "green" },
            { id: 2, value: "1", color: "red" },
            { id: 3, value: "2", color: "black" },
            { id: 4, value: "3", color: "red" },
            { id: 5, value: "4", color: "black" },
            { id: 6, value: "5", color: "red" },
            { id: 7, value: "6", color: "black" },
            { id: 8, value: "7", color: "red" },
            { id: 9, value: "8", color: "black" },
            { id: 10, value: "9", color: "red" },
            { id: 11, value: "10", color: "black" },
            { id: 12, value: "11", color: "black" },
            { id: 13, value: "12", color: "red" },
            { id: 14, value: "13", color: "black" },
            { id: 15, value: "14", color: "red" },
            { id: 16, value: "15", color: "black" },
            { id: 17, value: "16", color: "red" },
            { id: 18, value: "17", color: "black" },
            { id: 19, value: "18", color: "red" },
            { id: 20, value: "19", color: "red" },
            { id: 21, value: "20", color: "black" },
            { id: 22, value: "21", color: "red" },
            { id: 23, value: "22", color: "black" },
            { id: 24, value: "23", color: "red" },
            { id: 25, value: "24", color: "black" },
            { id: 26, value: "25", color: "red" },
            { id: 27, value: "26", color: "black" },
            { id: 28, value: "27", color: "red" },
            { id: 29, value: "28", color: "black" },
            { id: 30, value: "29", color: "black" },
            { id: 31, value: "30", color: "red" },
            { id: 32, value: "31", color: "black" },
            { id: 33, value: "32", color: "red" },
            { id: 34, value: "33", color: "black" },
            { id: 35, value: "34", color: "red" },
            { id: 36, value: "35", color: "black" },
            { id: 37, value: "36", color: "red" },
        ];

        this.startAngleDegrees = this.fullRotationDegrees / this.wheelNumbersIndices.length;
        each(this.wheelNumbersIndices, (t, e) => {
            this.wheelNumbersRotations[t] = this.startAngleDegrees * (e + 1);
        });
        this.sectorsNumber = this.fullRotationDegrees / this.WHEEL_DEGREE_STEP;
        this.initWheelSpineAnimation();
    }

    initWheelSpineAnimation() {
        this.rotateBallBone = this.animation.findBone("Rotate Ball");
        this.animation.setToSetupPose();

        const state = this.animation.getState();

        state.setListener({
            start: (trackEntry) => {
                if (trackEntry.animation.name === WheelAnimation.BALL_LOOP) {
                    this.playStoppableSFX("ball_rolling");
                }
            },
            event: (trackEntry, event) => {
                if (event.data.name === "Animation-Progress") {
                    this.applyStopAnimationRotationStep();
                }
                if (event.data.name === "start_wheel" && has(event.data, "stringValue")) {
                    this.playStoppableSFX(event.data.stringValue);
                }
            },
            complete: () => {},
            dispose: () => {},
            end: () => {},
            interrupt: () => {},
        });
    }

    applyStopAnimationRotationStep() {
        const t = (this.sectorInitialAngle - this.sectorStartAngle) / 3;
        this.rotateBallBone.rotation += t;
    }

    onWheelPositionBallOnNumber(t) {
        this.isFromRestore = t.isFromRestore;
        const i = t.lastNumber;
        if (i > -1) {
            const n = this.getWheelNumber(i);
            this.numberRotationDegree = this.wheelNumbersRotations[n];
        } else {
            this.numberRotationDegree = this.initBallRotation;
        }

        let o = !1;
        has(t, "showWheel") && (o = t.showWheel),
            o &&
                this.resetWheelAnimation().then(() => {
                    this.startIdleAnimation();
                    this.onWheelShow();
                });
    }

    startIdleAnimation() {
        const state = this.animation.getState();
        const t = state.getCurrent(this.wheelTrack);
        if (!isNil(t)) {
            const e = this.getCurrentWheelDegree();
            this.adjustAnimationRotationTimeline(WheelAnimation.WHEEL_IDLE, e);
        }
        state.setAnimation(this.wheelTrack, WheelAnimation.WHEEL_IDLE, true);
        state.setAnimation(this.ballTrack, WheelAnimation.BALL_IDLE, true);
        this.rotateBallBone.rotation = -this.numberRotationDegree;
        if (this.isFromRestore) {
            this.isFromRestore = false;
        }
    }

    onWheelShow() {}

    setBallStopAnimDataSector0(t, e) {
        const i = Math.ceil(this.numberRotationDegree / this.BALL_HIT_OUT_DEGREE_STEP);
        this.sectorStartAngle = this.numberRotationDegree;
        this.numberLocalIndex = 1;
        let n = this.convertTo360(t),
            o = e * this.BALL_HIT_OUT_DEGREE_STEP - (this.fullRotationDegrees - n);
        for (
            o < 0 && (o += this.fullRotationDegrees),
                o < this.BALL_HIT_OUT_DEGREE_STEP && 8 == i && (o += this.fullRotationDegrees),
                this.sectorInitialAngle = o;
            this.sectorStartAngle + this.startAngleDegrees < o;

        ) {
            this.sectorStartAngle += this.startAngleDegrees;
            this.numberLocalIndex++;
        }
    }

    setBallStopAnimDataSector1Forward(t, e) {
        const i = Math.ceil(this.numberRotationDegree / this.BALL_HIT_OUT_DEGREE_STEP);
        (this.sectorStartAngle = this.numberRotationDegree), (this.numberLocalIndex = 1);
        let n = this.convertTo360(t),
            o = (e + 1) * this.BALL_HIT_OUT_DEGREE_STEP - (this.fullRotationDegrees - n);
        for (
            o < 0 && (o += this.fullRotationDegrees),
                o > this.fullRotationDegrees - this.BALL_HIT_OUT_DEGREE_STEP && 1 == i && (o -= this.fullRotationDegrees),
                this.sectorInitialAngle = o;
            this.sectorStartAngle - this.startAngleDegrees >= o;

        ) {
            this.sectorStartAngle -= this.startAngleDegrees;
            this.numberLocalIndex++;
        }
    }

    setBallStopAnimDataSector2Forward(t, e) {
        const i = Math.ceil(this.numberRotationDegree / this.BALL_HIT_OUT_DEGREE_STEP);
        (this.sectorStartAngle = this.numberRotationDegree - this.BALL_HIT_OUT_DEGREE_STEP),
            (this.sectorStartAngle = this.convertTo360(this.sectorStartAngle)),
            (this.numberLocalIndex = 1);
        let n = this.convertTo360(t),
            o = (e + 1) * this.BALL_HIT_OUT_DEGREE_STEP - (this.fullRotationDegrees - n);
        for (
            o < 0 && (o += this.fullRotationDegrees),
                o > this.fullRotationDegrees - this.BALL_HIT_OUT_DEGREE_STEP && 2 == i && (o -= this.fullRotationDegrees),
                this.sectorInitialAngle = o;
            this.sectorStartAngle - this.startAngleDegrees >= o;

        ) {
            this.sectorStartAngle -= this.startAngleDegrees;
            this.numberLocalIndex++;
        }
    }

    onWheelUpdateResultNumber(t) {
        const resultNumber = t.resultNumber;
        if (resultNumber === -1) {
            return;
        }

        const wheelNumber = this.getWheelNumber(resultNumber);
        this.numberRotationDegree = this.wheelNumbersRotations[wheelNumber];
        this.resultReceived = true;
        console.log("--------onWheelUpdateResultNumber", resultNumber);
        this.currentNumberColorVO = this.getNumberColorVO(resultNumber);
    }

    getWheelNumber(t) {
        const e = this.getNumberColorVO(t);
        console.log("--------getWheelNumber", e);
        return Number(e.value);
    }

    getNumberColorVO(t) {
        let e = void 0;
        return (
            each(this.numbersColorsVOs, (i, n) => {
                if (i.id == t) {
                    e = i;
                    return !1;
                }
            }),
            e
        );
    }

    resetWheelAnimation() {
        return new Promise<void>((resolve) => {
            this.rotateBallBone.setToSetupPose();
            resolve();
        });
    }

    stopBallAnimation(t) {
        const state = this.animation.getState();
        this.adjustAnimationRotationTimeline(WheelAnimation.WHEEL_STOP_TRANSITION, t);
        const i = state.setAnimation(this.wheelTrack, WheelAnimation.WHEEL_STOP_TRANSITION, false);
        const n = this.landingAnimationGroup.stopAnimation + this.numberLocalIndex;
        const trackEntry = state.setAnimation(this.ballTrack, n, false);

        trackEntry.listener = {
            start: () => {
                console.log("--------stopBallAnimation start");
                this.stopStoppableSFX("ball_rolling");
                if (this.landingAnimationGroup.stopAnimation === WheelAnimation.BALL_STOP_TARGET_SECTOR_0_2) {
                    this.playStoppableSFX("ball_jumping_normal");
                }
                this.rotateBallBone.rotation = -this.sectorInitialAngle;
            },
            complete: () => {
                console.log("--------stopBallAnimation complete");
                this.resultReceived = false;
            },
            interrupt: () => {
                console.log("--------stopBallAnimation interrupt");
            },
            end: () => {
                console.log("--------stopBallAnimation end");
            },
            dispose: () => {
                console.log("--------stopBallAnimation dispose");
            },
            event: () => {
                console.log("--------stopBallAnimation event");
            },
        };

        i.listener = {
            complete: () => {
                console.log("--------stopBallAnimation  WheelAnimation start");
                this.pauseAnimation();
                const i = this.getCurrentWheelDegree();
                this.adjustAnimationRotationTimeline(WheelAnimation.WHEEL_IDLE, i);
                state.setAnimation(this.wheelTrack, WheelAnimation.WHEEL_IDLE, true);
                this.resumeAnimation();
            },
            start: () => {
                console.log("--------stopBallAnimation  WheelAnimation start");
            },
            interrupt: () => {
                console.log("--------stopBallAnimation  WheelAnimation interrupt");
            },
            end: () => {
                console.log("--------stopBallAnimation  WheelAnimation end");
            },
            dispose: () => {
                console.log("--------stopBallAnimation  WheelAnimation dispose");
            },
            event: () => {
                console.log("--------stopBallAnimation  WheelAnimation event");
            },
        };
    }

    forceBallStopAnimation(t) {
        const state = this.animation.getState();
        if (!isNaN(t)) {
            this.adjustAnimationRotationTimeline(WheelAnimation.WHEEL_IDLE, t);
        }
        state.setAnimation(this.wheelTrack, WheelAnimation.WHEEL_IDLE, true);
        state.setEmptyAnimation(this.ballTrack, 0);
        const trackEntry = state.addAnimation(this.ballTrack, WheelAnimation.BALL_SKIP, false, 0);

        trackEntry.listener = {
            start: () => {
                console.log("--------forceBallStopAnimation start");
                this.stopStoppableSFX("ball_rolling");
                this.rotateBallBone.rotation = -this.numberRotationDegree;
                this.resultReceived = false;
            },
            complete: () => {
                console.log("--------forceBallStopAnimation complete");
            },
            interrupt: () => {
                console.log("--------forceBallStopAnimation interrupt");
            },
            end: () => {
                console.log("--------forceBallStopAnimation end");
            },
            dispose: () => {
                console.log("--------forceBallStopAnimation dispose");
            },
            event: () => {
                console.log("--------forceBallStopAnimation event");
            },
        };
    }

    onWheelStartSpinAnimation(t) {
        let i = !1;
        if ((has(t, "showWheel") && (i = t.showWheel), i)) {
            this.isFromRestore && this.rotateBallBone.setToSetupPose();
            const n = this.animation.getCurrent(this.wheelTrack);
            (isNil(n) || n.animation.name !== WheelAnimation.WHEEL_IDLE) && (this.pauseAnimation(), this.startIdleAnimation()),
                this.resumeAnimation(),
                delay(() => {
                    return this.onWheelShow();
                }, 0);
        } else {
            this.prepareWheelSpinAnimation();
        }
    }

    prepareWheelSpinAnimation() {
        console.log("--------prepareWheelSpinAnimation");
        let currentDegree = NaN;

        this.pauseAnimation();
        currentDegree = this.getCurrentWheelDegree();

        this.resetWheelAnimation().then(() => {
            if (!isNaN(currentDegree)) {
                this.adjustAnimationRotationTimeline(WheelAnimation.WHEEL_LOOP, currentDegree);
                this.resumeAnimation();
                console.log("--------prepareWheelSpinAnimation startBallAnimation");
                this.startBallAnimation();
            }
        });
    }

    startBallAnimation() {
        this.animation.setAnimation(this.wheelTrack, WheelAnimation.WHEEL_LOOP, true);
        const trackEntry = this.animation.setAnimation(this.ballTrack, WheelAnimation.BALL_LOOP, true);

        console.log("--------startBallAnimation setListener");

        trackEntry.listener = {
            complete: () => {
                if (this.resultReceived) {
                    this.startBallTransitionAnimation();
                }
            },
            start: () => {
                console.log("--------startBallAnimation  WheelAnimation start");
            },
            interrupt: () => {
                console.log("--------startBallAnimation  WheelAnimation interrupt");
            },
            end: () => {
                console.log("--------startBallAnimation  WheelAnimation end");
            },
            dispose: () => {
                console.log("--------startBallAnimation  WheelAnimation dispose");
            },
            event: () => {
                console.log("--------startBallAnimation  WheelAnimation event");
            },
        };
    }

    startBallLanding(t) {
        const landingType = random(0, 3);
        this.landingAnimationGroup = this.landingAnimationGroups[landingType];
        switch (landingType) {
            case 0:
                this.runBallHitNonCollisionAnimationGroup1(t);
                break;
            case 1:
                this.runBallHitCollisionAnimationGroup1(t);
                break;
            case 2:
                this.runBallHitCollisionAnimationGroup2(t);
                break;
            case 3:
                this.runBallHitCollisionAnimationGroup3(t);
                break;
        }
    }
}
