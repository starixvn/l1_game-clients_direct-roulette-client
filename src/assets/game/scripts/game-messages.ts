export namespace GameServiceMessage {
    export class MatchConfig {
        home: string;
        away: string;

        static eventName = "match";
    }

    export class RouletteGameConfigs {
        multipliers: Array<number>;

        static eventName = "gameConfigs";
    }

    export const signedIn = "signedIn";
}
