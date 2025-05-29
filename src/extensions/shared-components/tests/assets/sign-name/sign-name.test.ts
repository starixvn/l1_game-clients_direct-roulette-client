import gc from "@sg/game-client-base";
import { AudioSource, EditBox, EventKeyboard, KeyCode, Label, Node } from "cc";
import { SignName } from "db://shared-components/sign-name/scripts/components/sign-name";

const { Shared, Translator } = gc;

describe("SignName", () => {
    let signName: SignName;

    beforeEach(() => {
        signName = new SignName();
        signName.lblErrorMessage = new Label();
        signName.username = new EditBox();
        signName.dialogNode = new Node();
        signName.soundClick = new AudioSource();
    });

    test("should add event listeners on enable", () => {
        // Arrange
        Shared.utils.NameGenerator.generateName = jest.fn();
        const commonTranslateSpy = jest.spyOn(Translator, "commonTranslate");
        commonTranslateSpy.mockReturnValue("");

        // Act
        signName.onEnable();

        // Assert
        expect(Shared.utils.NameGenerator.generateName).toHaveBeenCalled();
        expect(signName.lblErrorMessage.string).toEqual("");
    });

    test("should remove event listeners on disable", () => {
        // Arrange
        signName.removeEvent = jest.fn();

        // Act
        signName.onDisable();

        // Assert
        expect(signName.removeEvent).toBeCalled();
        expect(signName.username.string).toEqual("");
    });

    test("should set skipFullscreen to false on destroy", () => {
        // Act
        signName.onDestroy();

        // Assert
        expect(window.skipFullscreen).toBe(false);
    });

    test("should play sound and focus username on edit click", () => {
        // Arrange
        signName.soundClick.play = jest.fn();
        signName.username.focus = jest.fn();

        // Act
        signName.onEditClick();

        // Assert
        expect(signName.soundClick.play).toHaveBeenCalled();
        expect(signName.username.focus).toHaveBeenCalled();
    });

    test("should play sound and generate name on generate name click", () => {
        // Arrange
        Shared.utils.NameGenerator.generateName = jest.fn();

        // Act
        signName.onGenerateNameClick();

        // Assert
        expect(signName.soundClick.play).toHaveBeenCalled();
        expect(Shared.utils.NameGenerator.generateName).toHaveBeenCalled();
        expect(signName.lblErrorMessage.string).toEqual("");
    });

    test("should change next focus edit box on tab key", () => {
        // Arrange
        signName.changeNextFocusEditBox = jest.fn();
        const mockEvent = {
            keyCode: KeyCode.TAB,
            preventDefault: jest.fn(),
        };

        // Act
        signName.keyHandle(mockEvent);

        // Assert
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(signName.changeNextFocusEditBox).toHaveBeenCalled();
    });

    test("should sign name on enter key", () => {
        // Arrange
        signName.onSignNameClick = jest.fn();
        const mockEvent = {
            keyCode: KeyCode.ENTER,
            preventDefault: jest.fn(),
        };

        // Act
        signName.keyHandle(mockEvent);

        // Assert
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(signName.onSignNameClick).toHaveBeenCalled();
    });

    test("should update error message and dialog node on username text changed", () => {
        // Arrange
        signName.username.string = "123";

        // Act
        signName.usernameTextChanged();

        // Assert
        expect(signName.lblErrorMessage.string).toEqual("");
    });

    describe("onSignNameClick", () => {
        test("onSignNameClick sets error message if username is invalid", () => {
            // Arrange
            signName.username.string = "abc@123";
            const error = "valid username";
            const commonTranslateSpy = jest.spyOn(Translator, "commonTranslate");
            commonTranslateSpy.mockReturnValue(error);

            // Act
            signName.onSignNameClick();

            // Assert
            expect(commonTranslateSpy).toHaveBeenCalledWith("name_invalid");
            expect(signName.lblErrorMessage.string).toEqual(error);
        });

        test("onSignNameClick clears error message if username is valid", () => {
            // Arrange
            signName.username.string = "abc123";
            signName.handleSignName = jest.fn();

            // Act
            signName.onSignNameClick();

            // Assert
            expect(signName.handleSignName).toHaveBeenCalled();
        });
    });

    describe("usernameTextChanged", () => {
        test("usernameTextChanged sets error message if username is invalid", () => {
            // Arrange
            signName.username.string = "abc@123";
            const error = "valid username";
            const commonTranslateSpy = jest.spyOn(Translator, "commonTranslate");
            commonTranslateSpy.mockReturnValue(error);

            // Act
            signName.usernameTextChanged();

            // Assert
            expect(commonTranslateSpy).toHaveBeenCalledWith("name_invalid");
            expect(signName.lblErrorMessage.string).toEqual(error);
        });

        test("usernameTextChanged clears error message if username is valid", () => {
            // Arrange
            signName.username.string = "abc123";

            // Act
            signName.usernameTextChanged();

            // Assert
            expect(signName.lblErrorMessage.string).toBe("");
        });
    });

    describe("validateUsername function", () => {
        const testCases = [
            ["johnDoe123", false],
            ["a", true],
            ["aBcDEFGhIJKLmnop", true],
            ["user_name", true],
            ["validUsername", false],
            ["user-name", true],
            ["1234567890", false],
        ];

        test.each(testCases)("validateUsername(%s) should return %s", (username, expectedResult) => {
            const result = signName.validateUsername(username.toString());
            expect(result).toBe(expectedResult);
        });
    });

    describe("handleSignName function", () => {
        it("should return the same username it receives", () => {
            // Arrange
            const username = "testUsername";

            // Act
            const result = signName.handleSignName(username);

            // Assert
            expect(result).toBe(username);
        });
    });

    describe("onKeyDown method", () => {
        beforeEach(() => {
            signName.onSignNameClick = jest.fn();
        });

        it("should call changeNextFocusEditBox when TAB key is pressed", () => {
            // Arrange
            const focusMock = jest.spyOn(signName.username, "focus");
            const event = { keyCode: KeyCode.TAB } as EventKeyboard;

            // Act
            signName.onKeyDown(event);

            // Assert
            expect(signName.onSignNameClick).toHaveBeenCalledTimes(0);
            expect(focusMock).toHaveBeenCalledTimes(1);
        });

        it("should call onSignNameClick when ENTER key is pressed", () => {
            // Arrange
            signName.changeNextFocusEditBox = jest.fn();
            const event = { keyCode: KeyCode.ENTER } as EventKeyboard;

            // Act
            signName.onKeyDown(event);

            // Assert
            expect(signName.onSignNameClick).toHaveBeenCalledTimes(1);
            expect(signName.changeNextFocusEditBox).toHaveBeenCalledTimes(0);
        });
    });
});
