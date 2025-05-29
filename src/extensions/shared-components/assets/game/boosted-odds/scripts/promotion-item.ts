import { _decorator, Button, color, Label, LabelShadow, Node } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { handle } = Observer;
const { Translator } = gc;
const { property, ccclass } = _decorator;

const dict = {
    vi: "vi-VN",
    en: "en-US",
    th: "th-TH",
    id: "id-ID",
    zh_cn: "zh-CN",
    zh_tw: "zh-TW",
};

@ccclass("PromotionItem")
export default class PromotionItem extends ObserverComponent {
    @property(Label)
    title: Label | null = null;

    @property(Label)
    message: Label | null = null;

    @property(Button)
    joinButton: Button | null = null;

    @property(Node)
    bgDisable: Node | null = null;

    @property(Node)
    content: Node | null = null;

    setData(data: gc.Notification.PromotionModel) {
        const lang = dict[Translator.getLanguageId()] || "en";

        this.title.string = data.title[lang];
        this.title.node.getComponent(LabelShadow).enabled = true;
        this.message.string = data.messages[lang];

        this.joinButton.interactable = data.isActive;
        this.bgDisable.active = !data.isActive;

        const text = this.joinButton.node.getChildByName("text");
        text.getComponent(Label).color = data.isActive ? color(209, 42, 33) : color(83, 78, 78);
        this.joinButton.node.on("click", () => this.onClickJoinGame(data.gameId));
    }

    @handle(gc.App.AppHandlers.BackToOperatorLobby, (handler, gameId: number) => handler.handleOpenGame(gameId))
    onClickJoinGame(gameId: number) {
        this.showLoadingIcon();
        return gameId;
    }

    @handle(gc.Notification.BoostedOddsStore, (store) => store.setIsLoadingIcon(true))
    showLoadingIcon() {}
}
