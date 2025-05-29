import { _decorator, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class CategoryItem extends Component {
    @property
    category = "";
}
