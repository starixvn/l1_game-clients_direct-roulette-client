import { _decorator, Component, Node, Toggle } from "cc";
import { CategoryEvent } from "./category-events";
import CategoryItem from "./category-item";

const { ccclass, property } = _decorator;

@ccclass
export default class CategoryController extends Component {
    @property(Node)
    container: Node = null;

    _items: Node[] = [];
    _toggles: Toggle[] = [];

    categories: string[] = [];
    allCategories: string[] = [];

    get toggles(): Toggle[] {
        if (this._toggles.length === 0) {
            this._toggles = this.getComponentsInChildren(Toggle);
        }
        return this._toggles;
    }

    extraFilter = (item: Node) => true;

    onToggleCategoryChanged(toggle: Toggle) {
        const categoryItem = toggle.getComponent(CategoryItem);
        const isChecked = toggle.isChecked;

        this.changeCategory(categoryItem.category, isChecked);
    }

    setAllCategories(categories: string[]) {
        this.allCategories = categories;
    }

    initCategories(storageCategories: string[]) {
        this.categories = storageCategories;

        this.toggles.forEach((toggle) => {
            const item = toggle.getComponent(CategoryItem);
            if (this.categories.includes(item.category)) {
                toggle.setIsCheckedWithoutNotify(true);
            }
        });
        this.updateItemVisibility();
    }

    changeCategory(category: string, checked: boolean) {
        if (checked) {
            this.categories.push(category);
            this.removeDuplicateCategory();
        } else {
            const index = this.categories.indexOf(category);
            this.categories.splice(index, 1);
        }

        this.node.emit(CategoryEvent.Changed, this.categories);
        this.updateVisibility();
    }

    updateVisibility() {
        this.updateItemVisibility();
    }

    changeExtraFilter(filter: (item: Node) => boolean) {
        if (filter) {
            this.extraFilter = filter;
        } else {
            this.extraFilter = () => true;
        }
        this.updateVisibility();
    }

    private removeDuplicateCategory() {
        this.categories = this.categories.filter(
            (iterator, index, categories) => categories?.findIndex((category) => category === iterator) === index
        );
    }

    private updateItemVisibility() {
        const categories = this.categories.length > 0 ? this.categories : this.allCategories;
        const items = this.container.children;
        items.forEach((item) => {
            const comps = item.getComponents(CategoryItem);
            item.active = comps.some((comp) => categories.includes(comp.category) && this.extraFilter(item));
        });
    }
}
