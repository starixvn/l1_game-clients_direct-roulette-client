import gc from "@sg/game-client-base";
import { _decorator, Label, Layout, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import PaginationItem from "./pagination-item";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { BetHistory } = gc;

@ccclass("Pagination")
export default class Pagination extends ObserverComponent {
    @property(Node)
    nodeFirst: Node = null;

    @property(Node)
    nodePrevious: Node = null;

    @property(Node)
    nodeNext: Node = null;

    @property(Node)
    nodeLast: Node = null;

    @property(PaginationItem)
    pages: PaginationItem[] = [];

    protected pageButtons = 5;
    protected control: any = null;
    protected totalPages = 0;
    protected currentPage = 1;
    protected distanceYetChaos = Math.round(this.pageButtons / 2);
    protected distanceNumberCenter = Math.floor(this.pageButtons / 2);

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    handleFirstPage() {
        this.currentPage = 1;
        this.fetchData();
    }

    handleLastPage() {
        this.currentPage = this.totalPages;
        this.fetchData();
    }
    hanldePreviousPage() {
        this.currentPage--;
        this.fetchData();
    }

    hanldeNextPage() {
        this.currentPage++;
        this.fetchData();
    }

    hanldePage(event: any) {
        const pageIndex = parseInt(event.currentTarget.getComponentsInChildren(Label)[0].string);
        if (pageIndex === this.currentPage) {
            return;
        }

        this.currentPage = pageIndex;
        this.fetchData();
    }

    @handle(BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler, (handler, pageNumber: number) => handler.handle(pageNumber))
    fetchData() {
        this.playSoundClick();
        return this.currentPage;
    }

    @render(BetHistory.BetHistoryStore, (store) => store.betHistoryModel)
    setData(model: gc.BetHistory.BetHistoryModel) {
        if (!model) {
            return;
        }

        this.currentPage = model.page;
        this.totalPages = Math.ceil(model.total / model.pageSize);

        this.updateLayout();
    }

    updateArrowButtonsVisibility() {
        this.nodeFirst.active = this.currentPage > 2;
        this.nodeLast.active = this.currentPage < this.totalPages - 1;

        this.nodePrevious.active = this.currentPage > 1;
        this.nodeNext.active = this.currentPage < this.totalPages;
    }

    updateLayout() {
        if (this.totalPages === 1) {
            this.node.active = false;
            return;
        }

        const startedIndex = this.getStartedPageIndex();

        this.pages.forEach((page, index) => {
            const pageNumber = startedIndex + index;
            page.updateHighlight(pageNumber === this.currentPage, pageNumber);
            page.node.active = index < this.totalPages;
        });

        this.updateArrowButtonsVisibility();
        this.updateLayout1();
    }

    updateLayout1() {
        const layout = this.node.getComponent(Layout);
        layout.enabled = true;
        layout.updateLayout();
        layout.enabled = false;
    }

    getStartedPageIndex() {
        switch (true) {
            case this.currentPage <= 3:
                return 1;
            case this.currentPage > Math.round(this.pageButtons / 2) &&
                this.currentPage < this.totalPages - Math.round(this.pageButtons / 2):
                return this.currentPage - Math.round(this.pageButtons / 2);
            default:
                return Math.max(0, this.totalPages - this.pageButtons) + 1;
        }
    }
}
