import { _decorator, Component } from "cc";
import { ScoreboardItemTieCriteria } from "../models/scoreboard-item-enum";
import { ScoreboardItemImage } from "../models/scoreboard-item-image";
import { ScoreboardItemState, ScoreboardItemStateCriteria } from "../models/scoreboard-item-state";
import { ScoreboardItemRenderer } from "../renderers/scoreboard-item-renderer";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardItem extends Component {
    @property([ScoreboardItemRenderer])
    renderers: ScoreboardItemRenderer[] = [];

    @property([ScoreboardItemImage])
    images: ScoreboardItemImage[] = [];

    _state: ScoreboardItemState = null;

    @property(ScoreboardItemState)
    get state() {
        return this._state;
    }

    set state(value: ScoreboardItemState) {
        this._state = value;

        this.render();
    }

    render() {
        if (this.isValidState()) {
            this.renderers.forEach(this.reset.bind(this));
            this.renderers.forEach(this.executeRender.bind(this));
        }
    }

    onFocusInEditor(): void {
        const renderers = [...this.getComponentsInChildren(ScoreboardItemRenderer)];

        if (renderers.length !== this.renderers.length) {
            this.renderers = renderers;
        }
    }

    protected reset(renderer: ScoreboardItemRenderer) {
        renderer.reset();
    }

    protected executeRender(renderer: ScoreboardItemRenderer) {
        if (this.isMatchState(this.state, renderer.forState)) {
            const images = this.images.filter((image) => this.isMatchCriteria(image.forState, renderer.forState));

            renderer.render(this.state, images, this);
        }
    }

    protected isMatchState(state: ScoreboardItemState, criteria: ScoreboardItemStateCriteria) {
        const isMatchTie =
            (criteria.tie === ScoreboardItemTieCriteria.ZERO && state.tie === 0) ||
            (criteria.tie === ScoreboardItemTieCriteria.POSITIVE && state.tie > 0) ||
            criteria.tie === ScoreboardItemTieCriteria.ANY;

        return state.status === criteria.status && isMatchTie;
    }

    protected isMatchCriteria(a: ScoreboardItemStateCriteria, b: ScoreboardItemStateCriteria) {
        return a.status === b.status && a.tie === b.tie;
    }

    protected isValidState() {
        return !!this.state;
    }
}
