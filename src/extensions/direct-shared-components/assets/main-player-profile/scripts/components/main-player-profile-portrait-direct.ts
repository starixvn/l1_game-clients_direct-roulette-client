import { _decorator, Sprite } from "cc";
import MainPlayerProfile from "db://shared-components/game/main-player-profile/scripts/components/main-player-profile";

const { ccclass, property } = _decorator;

@ccclass
export default class MainPlayerProfilePortraitDirect extends MainPlayerProfile {
    @property(Sprite)
    bgDollar: Sprite = null;

    @property({ override: true, visible: false })
    sprAvatar: Sprite = null;

    enableFreeBet = false;
    scoin = 0;

    activeUserScoinWallet(enableFreeBet: boolean) {
        super.activeUserScoinWallet(enableFreeBet);
        this.enableFreeBet = enableFreeBet;
        //this.checkAndUpdateScoinWallet();
        this.disableScoinWallet();
    }

    setScoin(scoin: number) {
        this.scoin = scoin;
        super.setScoin(scoin);
        // this.checkAndUpdateScoinWallet();
        this.disableScoinWallet();
    }

    private checkAndUpdateScoinWallet() {
        if (this.userScoinWallet) {
            this.userScoinWallet.active = this.scoin > 0 && this.enableFreeBet;
            this.bgDollar.enabled = this.scoin > 0 && this.enableFreeBet;
        }
    }

    private disableScoinWallet() {
        this.userScoinWallet.active = false;
        this.bgDollar.enabled = false;
    }
}
