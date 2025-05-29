import gc from "@sg/game-client-base";
import { AudioSource, Component, EditBox, EventKeyboard, Input, KeyCode, Label, Node, _decorator, input, sys } from "cc";
import Observer from "observer";
const { Translator } = gc;

const { ccclass, property } = _decorator;
const { observer, handle } = Observer;
const { Shared, Auth } = gc;

declare global {
    interface Window {
        skipFullscreen: boolean;
    }
}

@ccclass("SignName")
@observer
export class SignName extends Component {
    @property(EditBox)
    username: EditBox = null;

    @property(Label)
    lblErrorMessage: Label = null;

    @property(Node)
    dialogNode: Node = null;

    @property(AudioSource)
    soundClick: AudioSource = null;

    onLoad(): void {
        window.skipFullscreen = true;
    }

    onEnable() {
        sys.isBrowser && this.addEvent();
        this.generateName();
    }

    onDestroy() {
        window.skipFullscreen = false;
    }

    onDisable() {
        sys.isBrowser && this.removeEvent();
        this.clean();
    }

    onEditClick() {
        this.soundClick.play();
        this.username.focus();
    }
    onGenerateNameClick() {
        this.soundClick.play();
        this.generateName();
    }

    generateName() {
        this.username.string = Shared.utils.NameGenerator.generateName();
        this.usernameTextChanged();
    }

    addEvent() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.username.node.on("keydown", this.keyHandle, !1);
        this.username.node.on("text-changed", this.usernameTextChanged, this);
    }

    removeEvent() {
        this.username.node.off("keydown", this.keyHandle, !1);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.username.node.off("text-changed", this.usernameTextChanged, this);
    }

    keyHandle(event) {
        const { keyCode } = event;

        if (keyCode === KeyCode.TAB) {
            this.changeNextFocusEditBox();
        } else if (keyCode === KeyCode.ENTER) {
            this.onSignNameClick();
        }

        if (event.preventDefault) {
            event.preventDefault();
        }
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.TAB:
                this.changeNextFocusEditBox();
                break;
            case KeyCode.ENTER:
                this.onSignNameClick();
        }
    }

    changeNextFocusEditBox() {
        this.username.focus();
    }

    clean() {
        this.username.string = "";
    }

    onSignNameClick() {
        if (this.validateUsername(this.username.string)) {
            this.lblErrorMessage.string = Translator.commonTranslate("name_invalid");
        } else {
            this.handleSignName(this.username.string);
        }
    }

    usernameTextChanged() {
        if (this.validateUsername(this.username.string)) {
            this.lblErrorMessage.string = Translator.commonTranslate("name_invalid");
        } else {
            this.lblErrorMessage.string = "";
        }
    }

    validateUsername(username: string) {
        const regex = new RegExp("^[a-zA-Z0-9]+$");
        return username.length > 14 || username.length < 3 || username.match(regex) === null;
    }

    @handle(Auth.AuthHandlers.Authorize, (handle, username: string) => handle.handleSignName(username))
    handleSignName(username: string) {
        return username;
    }
}
