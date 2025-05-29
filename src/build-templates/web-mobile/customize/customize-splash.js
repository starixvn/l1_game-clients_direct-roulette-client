const OPERATORS = {
    SP: {
        name: "SP",
        title: "Saba Play",
        favicon: "favicon_sabaplay.ico",
        cssClass: "sabaplay",
        logo: "./images/logo_sabaplay.webp?v=3",
    },
    VG: {
        name: "VG",
        title: "Vgaming",
        favicon: "favicon_vgaming.ico",
        cssClass: "vg",
        logo: "./images/logo_vgaming.webp?v=3",
    },
    SG: {
        name: "SG",
        title: {
            vi: "Cổng Game SABA",
            default: "SABA.games",
        },
        favicon: "favicon.ico",
        cssClass: "sg",
        logo: "./images/logo_saba.webp?v=3",
    },
    TIP88: {
        name: "TIP88",
        title: "SoiBet",
        favicon: "favicon_tip88.ico",
        cssClass: "tip88",
        logo: "./images/logo_tip88.webp?v=3",
    },
};

const LANGUAGE_MAP = {
    "vi-VN": "vi",
    "en-US": "en",
    "th-TH": "th",
    "id-ID": "id",
    "zh-CN": "zh_cn",
    "zh-TW": "zh_tw",
};

const waitingMessages = {
    en: ["If this is your first visit, downloading may take a while", "Checking and downloading the latest update packages..."],
    vi: ["Lần truy cập đầu tiên, việc tải dữ liệu sẽ mất chút thời gian.", "Đang kiểm tra và tải gói cập nhật game mới nhất..."],
    id: [
        "Jika ini adalah kunjungan pertama Anda, pengunduhan mungkin memakan waktu cukup lama.",
        "Memeriksa dan mengunduh paket pembaruan terbaru...",
    ],
    th: ["หากคุณเข้าชมครั้งแรก อาจใช้เวลาในการดาวน์โหลดสักครู่", "กำลังตรวจสอบและกำลังดาวน์โหลดเกมของการอัพเดทล่าสุด"],
    zh_cn: ["如果这是您第一次访问，下载可能需要一段时间。", "正在检查和下载最新的更新包..."],
    zh_tw: ["如果這是您第一次訪問，下載可能需要一段時間。", "正在檢查和下載最新的更新包..."],
};

class SplashManager {
    constructor() {
        this.language = this.getCurrentLanguage().replace(/['"]+/g, "");
        this.operator = this.getCurrentOperator().replace(/['"]+/g, "");
        this.appType = this.getAppType();
        this.intervalId = null;
    }

    getDataFromURLParams(key) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has(key)) return urlParams.get(key);

        if (urlParams.has("params")) {
            const otherParams = new URLSearchParams(window.atob(urlParams.get("params")));
            if (otherParams.has(key)) return otherParams.get(key);
        }
        return null;
    }

    getCurrentLanguage() {
        let language = "vi";
        try {
            const storagePrefixKey = window.crossConfig?.storagePrefixKey;
            const languageKey = storagePrefixKey ? `${storagePrefixKey}_current_language` : "current_language";
            language = localStorage.getItem(languageKey) || language;
        } catch (e) {}

        const langKey = this.getDataFromURLParams("lang");
        return langKey ? LANGUAGE_MAP[langKey] || "en" : language;
    }

    getCurrentOperator() {
        try {
            const storagePrefixKey = window.crossConfig?.storagePrefixKey;
            const operatorKey = storagePrefixKey ? `${storagePrefixKey}_op` : "op";
            const storedOperator = localStorage.getItem(operatorKey) || "";
            return this.getDataFromURLParams("op") || storedOperator;
        } catch (e) {
            return this.getDataFromURLParams("op") || "";
        }
    }

    getAppType() {
        const appTypeFromURL = this.getDataFromURLParams("appType");
        if (appTypeFromURL) return +appTypeFromURL;

        try {
            const storagePrefixKey = window.crossConfig?.storagePrefixKey;
            const sessionKey = storagePrefixKey ? `${storagePrefixKey}_ss` : "ss";
            const sessionData = JSON.parse(localStorage.getItem(sessionKey) || "{}");
            return +sessionData?.system || 0;
        } catch (e) {
            return 0;
        }
    }

    createImg(src) {
        if (!src) {
            return null;
        }
        const img = document.createElement("img");
        img.src = src;
        return img;
    }

    randomWaitingMessage(appTypeClass) {
        const waitingMessage = document.getElementById("waiting-message");
        appTypeClass && waitingMessage.classList.add(appTypeClass);
        const messages = waitingMessages[this.language] || waitingMessages.en;
        let currentIndex = 0;

        const showMessage = () => {
            // Reset to initial position
            waitingMessage.style.transition = "none";
            waitingMessage.classList.remove("show", "fade-out");
            waitingMessage.offsetHeight; // Force reflow
            waitingMessage.style.transition = "all 1s ease";

            waitingMessage.textContent = messages[currentIndex];

            // Fade in from bottom
            requestAnimationFrame(() => {
                waitingMessage.classList.add("show");

                // After 4 seconds, fade out to top
                setTimeout(() => {
                    waitingMessage.classList.remove("show");
                    waitingMessage.classList.add("fade-out");
                }, 4000);
            });
        };
        this.intervalId && clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % messages.length;
            showMessage();
        }, 5000); // 5s total cycle (4s show + 1s fade)

        showMessage();
    }

    clearInterval() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    updateInterface() {
        const operatorKey = this.operator.toUpperCase();
        const operatorConfig = OPERATORS[operatorKey] || { title: "Default Title", favicon: "default_favicon.ico" };

        const appTypeClass = this.appType === 1 ? "portrait" : "";

        // Update title and favicon
        const title =
            typeof operatorConfig.title === "object"
                ? operatorConfig.title[this.language] || operatorConfig.title.default
                : operatorConfig.title;

        document.title = title;
        document.getElementById("favicon").href = operatorConfig.favicon;

        // Update splash log container
        const splashContainer = document.getElementById("splash-logo-container");
        splashContainer.className = `splash-logo-container ${appTypeClass}`;

        // Update splash logo
        const splashLogo = document.getElementById("splash_logo");
        const logo = this.createImg(operatorConfig.logo);
        logo && splashLogo.appendChild(logo);

        // Update slogan
        const slogan = document.getElementById("slogan");
        const sloganImg = this.createImg(`./images/splash_text_${this.language}.webp?v=1`);
        sloganImg && slogan.appendChild(sloganImg);

        // Update powered by
        const poweredBy = document.getElementById("powered-by");
        poweredBy.className = `powered-by-${operatorConfig.cssClass} ${this.language} ${appTypeClass}`;

        // Update waiting message
        this.randomWaitingMessage(appTypeClass);
    }
}

// Initialize and update splash screen
const splashManager = new SplashManager();
splashManager.updateInterface();
