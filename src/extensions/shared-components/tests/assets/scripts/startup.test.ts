import {
    App,
    Auth,
    Configs,
    IContainerOptions,
    Player,
    buildObserverContainer,
    getContainer,
    Notification,
    ConnectSite,
    ChipSetting,
} from "@sg/game-client-base";
import mobx from "mobx";
import { configure } from "observer";
import { getSharedContainer, startGame } from "../../../assets/shared/scripts/startup";

jest.mock("@sg/game-client-base");
jest.mock("mobx");

describe(startGame.name, () => {
    const options: IContainerOptions = { disabledFeatures: ["a"] };
    const siteConfigs: Configs.SiteConfigs = {
        systemType: "",
        ssl: false,
        serverDomainMapper: {},
        subDomain: "",
        env: "Test",
        sentryUrl: "sentryUrl",
        subGuideDomain: "",
        enableMsgpackParserAllGames: false,
        enableMsgpackParserOnNotification: false,
        websocket: {
            proxyPath: "",
            route: "",
        },
        mainObserverNamespace: "",
    };
    describe("when called", () => {
        it("should get container from game client base", () => {
            // Act
            startGame("namespace", options, siteConfigs);

            // Assert
            expect(getContainer).toBeCalledWith(options);
        });

        it("should build observer container", () => {
            // Arrange
            (getContainer as jest.Mock).mockReturnValueOnce({ container: true });

            // Act
            startGame("namespace", options, siteConfigs);

            // Assert
            expect(buildObserverContainer).toBeCalledWith({ container: true });
        });

        it("should configure the observer", () => {
            // Arrange
            (buildObserverContainer as jest.Mock).mockReturnValueOnce({ container: true });

            // Act
            startGame("namespace", options, siteConfigs);

            // Assert
            expect(configure).toBeCalledWith({ namespace: { mobx, container: { container: true } } });
        });

        it("should return the container", () => {
            // Arrange
            const expected = { container: true };
            (getContainer as jest.Mock).mockReturnValueOnce(expected);

            // Act
            const actual = startGame("namespace", options, siteConfigs);

            // Assert
            expect(actual).toStrictEqual(expected);
        });
    });
});

describe(getSharedContainer.name, () => {
    const configs: Configs.SiteConfigs = {
        enableMsgpackParserAllGames: true,
        env: "env",
        enableMsgpackParserOnNotification: true,
        serverDomainMapper: {},
        ssl: true,
        subDomain: "sub",
        subGuideDomain: "guide",
        systemType: "type",
        websocket: { proxyPath: "/", route: "route" },
        mainObserverNamespace: "",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("when called", () => {
        it("should get container from game client base", () => {
            // Act
            getSharedContainer(configs);

            // Assert
            expect(getContainer).toBeCalledWith(
                expect.objectContaining({
                    enabledFeatures: [
                        Player.FEATURE_NAME,
                        Auth.FEATURE_NAME,
                        App.FEATURE_NAME,
                        Notification.FEATURE_NAME,
                        ConnectSite.FEATURE_NAME,
                        ChipSetting.FEATURE_NAME,
                        "game-configuration",
                    ],
                    onContainerCreated: expect.any(Function),
                })
            );
        });

        it("should return the container", () => {
            // Arrange
            const expected = { container: true };
            (getContainer as jest.Mock).mockReturnValueOnce(expected);

            // Act
            const actual = getSharedContainer(configs);

            // Assert
            expect(actual).toStrictEqual(expected);
        });

        describe("and after the container is created", () => {
            it("should bind the site config to the container", () => {
                // Arrange
                const toConstantValue = jest.fn();
                const bind = jest.fn().mockReturnValue({ toConstantValue });
                const container = { bind };
                (getContainer as jest.Mock).mockImplementationOnce((options) => {
                    options.onContainerCreated(container);
                });

                // Act
                getSharedContainer(configs);

                // Assert
                expect(bind).toBeCalledWith(Configs.SiteConfigs);
                expect(toConstantValue).toBeCalledWith(configs);
            });
        });
    });
});
