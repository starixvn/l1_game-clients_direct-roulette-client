import { _decorator, instantiate, Node, Prefab, Toggle } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "../../../shared/utils/utils";
import CategoryController from "./category/category-controller";
import { CategoryEvent } from "./category/category-events";
import CategoryItem from "./category/category-item";
import GatewayGameItem from "./gateway-game-item";
import { GatewayPanelStore } from "./gateway-panel-store";
import { GameDataBase } from "./models/game-data-base";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("GatewayPanel")
export class GatewayPanel extends ObserverComponent {
    @property(Prefab)
    protected gamePrefab: Prefab = null;

    @property(Node)
    protected container: Node = null;

    @property(Toggle)
    toggleAll: Toggle = null;

    @property(Toggle)
    toggleGoodRoad: Toggle = null;

    @property(CategoryController)
    categoryController: CategoryController = null;

    @property(Node)
    nodeScrollView: Node = null;

    @property(Node)
    nodeEmptyList: Node = null;

    @property(Prefab)
    settingPrefab: Prefab = null;

    goodRoads: number[] = [];
    dataGames = {};
    gameInfo = {};

    isShowAll = true;
    didRenderAllGamesFilter = false;
    didInitItems = false;
    orderGameIds: number[] = [];

    @render(GatewayPanelStore, (store) => store.defaultOpenAllGameFilter)
    renderAllGamesFilter(allGamesFilter: boolean) {
        if (this.didRenderAllGamesFilter) {
            return;
        }
        this.didRenderAllGamesFilter = true;
        if (allGamesFilter) {
            this.toggleAll.setIsCheckedWithoutNotify(true);
        } else {
            this.toggleGoodRoad.setIsCheckedWithoutNotify(true);
        }
        this.updateTabChanged(allGamesFilter);
    }

    @render(GatewayPanelStore, (store) => store.orderGameIds)
    async renderOrderGameIds(orderGameIds: number[]) {
        this.orderGameIds = orderGameIds;
    }

    @render(GatewayPanelStore, (store) => store.goodRoads)
    renderGoodRoadIds(goodRoads: number[]) {
        this.goodRoads = goodRoads;
        this.categoryController.updateVisibility();

        this.checkEmptyListVisibility();
        this.updateSiblingIndex();
    }

    @render(GatewayPanelStore, (store) => store.categoryFilter)
    renderCategoryFilter(categoryFilter: string[]) {
        const comp = this.getComponentInChildren(CategoryController);
        if (comp) {
            comp.initCategories(categoryFilter);
        }

        this.initItemsWithCategory(categoryFilter);
        this.updateSiblingIndex();
    }

    async initItemsWithCategory(categoryFilter: string[]) {
        if (this.didInitItems) {
            return;
        }
        this.didInitItems = true;
        try {
            this.container.destroyAllChildren();
            const info = this.gameInfo;

            const firstGameIds =
                this.goodRoads.length > 0
                    ? this.orderGameIds.filter((gameId) => this.goodRoads.includes(gameId))
                    : this.orderGameIds.filter((gameId) => {
                          const { categories } = info[gameId];
                          return categories.some((category) => categoryFilter.includes(category));
                      });

            const otherGameIds = this.orderGameIds.filter((gameId) => !firstGameIds.includes(gameId));
            for (const gameId of [...firstGameIds, ...otherGameIds]) {
                const node = this.createItemForGameId(+gameId);
                this.container.addChild(node);
                this.categoryController.updateVisibility();
                await AnimationUtils.delayTime(0.1);
            }
        } catch (e) {}
    }

    updateSiblingIndex() {
        const orderIds = this.isShowAll || this.goodRoads.length === 0 ? this.orderGameIds : this.goodRoads;
        // const layout = this.container.getComponent(Layout);
        // layout.enabled = false;
        orderIds.forEach((gameId, index) => {
            const gameItem = this.container.getChildByName(`${gameId}`);
            if (gameItem) {
                gameItem.setSiblingIndex(index);
            }
        });
        // layout.enabled = true;
    }

    onClickSetting() {
        const node = instantiate(this.settingPrefab);
        this.node.addChild(node);
    }

    checkEmptyListVisibility() {
        const existData = this.isShowAll || this.goodRoads.length > 0;

        this.nodeScrollView.active = existData;
        this.nodeEmptyList.active = !existData;
    }

    onDestroy(): void {
        this.dataGames = {};
        super.onDestroy();
    }

    private createItemForGameId(gameId: number) {
        const info = this.gameInfo;
        const node = instantiate(this.gamePrefab);
        node.setSiblingIndex(this.orderGameIds.indexOf(gameId));

        node.name = `${gameId}`;

        const item = node.getComponent(GatewayGameItem);
        const { gameName, categories } = info[gameId];
        const gameData: GameDataBase = this.dataGames[gameId];
        item.init({ gameId: +gameId, gameName, gameData });

        categories.forEach((category) => {
            const comp = item.addComponent(CategoryItem);
            comp.category = category;
        });

        return node;
    }

    initItems(dataGames, info: { [gameId: number]: { gameName: string; categories: string[] } }) {
        this.dataGames = dataGames;
        this.gameInfo = info;
        let allCatogories = [];
        Object.keys(info).forEach((gameId) => {
            const { categories } = info[gameId];
            allCatogories.push(...categories);
        });

        allCatogories = allCatogories.filter(
            (iterator, index, categories) => categories?.findIndex((category) => category === iterator) === index
        );

        const comp = this.getComponentInChildren(CategoryController);
        if (comp) {
            comp.node.on(CategoryEvent.Changed, this.saveCategoryFilter.bind(this), this);
            comp.setAllCategories(allCatogories);
        }
    }

    @handle(GatewayPanelStore, (store, categories: string[]) => store.saveCategoryFilter(categories))
    saveCategoryFilterToStore(categories: string[]) {
        return categories;
    }

    @handle(GatewayPanelStore, (store, enable: boolean) => store.saveAllGamesFilter(enable))
    onTabChanged(toggle: Toggle) {
        const isAll = toggle.node.name === "all";
        this.updateTabChanged(isAll);
        return this.isShowAll;
    }

    private updateTabChanged(isAll: boolean) {
        this.isShowAll = isAll;
        if (isAll) {
            this.categoryController.changeExtraFilter(null);
        } else {
            const goodRoadFilter = (item: Node) => {
                const gameId = +item.name;
                return this.goodRoads.includes(gameId);
            };
            this.categoryController.changeExtraFilter(goodRoadFilter);
        }

        this.checkEmptyListVisibility();
        this.updateSiblingIndex();
    }

    saveCategoryFilter(categories: string[]) {
        this.saveCategoryFilterToStore([...categories]);
    }
}
