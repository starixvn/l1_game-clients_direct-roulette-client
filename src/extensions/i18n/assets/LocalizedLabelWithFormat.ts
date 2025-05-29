import { _decorator, Enum, error, Label } from "cc";

import * as i18n from "./LanguageData";
import { LocalizedLabel } from "./LocalizedLabel";

const { ccclass, property, executeInEditMode } = _decorator;

export enum FormationHandler {
    NONE,
    UPPER,
    LOWER,
    TITLE,
}

@ccclass("LocalizedLabelWithFormat")
@executeInEditMode
export default class LocalizedLabelWithFormat extends LocalizedLabel {
    @property({ visible: false })
    format: FormationHandler = FormationHandler.UPPER;

    @property
    prefix = "";

    @property
    suffix = "";

    @property({ displayName: "Format", type: Enum(FormationHandler), visible: true })
    get _format() {
        return this.format;
    }
    set _format(chosenFormat: FormationHandler) {
        this.format = chosenFormat;
        this.updateLabel();
    }

    updateLabel() {
        if (!this.label) {
            this.label = this.node.getComponent(Label);

            if (!this.label) {
                error("Failed to update localized label, label component is invalid!");
                return;
            }
        }
        let localizedString = i18n.t(this.key);
        if (localizedString) {
            localizedString = this.handleFormat(localizedString);
            this.label.string = `${this.prefix}${localizedString}${this.suffix}`;
        }
    }

    handleFormat(value: string) {
        const data = [
            {
                condition: this.format === FormationHandler.LOWER,
                handle: this.lowerCase,
            },
            {
                condition: this.format === FormationHandler.UPPER,
                handle: this.upperCase,
            },
            {
                condition: this.format === FormationHandler.TITLE,
                handle: this.titleCase,
            },
        ];
        const handler = data.filter((passed) => passed.condition);
        return handler.length ? handler[0].handle(value) : value;
    }

    titleCase(value: string) {
        return value
            .split("\n")
            .map((line) =>
                line
                    .split(" ")
                    .map((word) =>
                        /^\d/.test(word) // Check if the word starts with a number
                            ? word
                            : word
                                  .split("-")
                                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                                  .join("-")
                    )
                    .join(" ")
            )
            .join("\n");
    }

    upperCase(value: string) {
        return value.toUpperCase();
    }

    lowerCase(value: string) {
        return value.toLowerCase();
    }
}
