type OS = {
    UNKNOWN: "Unknown";
    IOS: "iOS";
    ANDROID: "Android";
    WINDOWS: "Windows";
    LINUX: "Linux";
    OSX: "OS X";
    OHOS: "OHOS";
    OPENHARMONY: "OpenHarmony";
};

type Sys = {
    isBrowser: boolean;
    os: OS[keyof OS];
    OS: OS;
};

export const sys: Sys = {
    isBrowser: typeof window !== "undefined",
    os: "Unknown",
    OS: {
        UNKNOWN: "Unknown",

        IOS: "iOS",

        ANDROID: "Android",

        WINDOWS: "Windows",

        LINUX: "Linux",

        OSX: "OS X",

        OHOS: "OHOS",

        OPENHARMONY: "OpenHarmony",
    },
};
