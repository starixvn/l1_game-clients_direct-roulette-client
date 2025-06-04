import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { RouletteBoard } from "../roulette-bet-options/roulette-board";
import { IRouletteBetInfo, IBetChoices } from "../roulette-choices";
import RouletteUtils from "../roulette-utils";
import "./../../../resources/i18n";

const { RoundHistories } = gc;

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer } = Observer;

@ccclass('roulette_game')
@observer(settings.name)
export class roulette_game extends GameComponent {
    
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property(RouletteBoard)
    rouletteBoard: RouletteBoard = null;
    
    override namespace = settings.name;
    override containerOptions = containerOptions;

    // Bet management
    private tempBetChoices: IBetChoices = {};
    private currentBetChoices: IBetChoices = {};
    private currentBet: number = 100; // Default bet amount

    onLoad() {
        super.onLoad();
        
        console.log('🎰 Roulette Game - initialized with betting system');
    }
}


