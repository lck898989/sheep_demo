import { Box } from "./game/box";
import { Game } from "./game/game";

export class GameManager {
    static _instance: GameManager;

    static getInstance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    game: Game = null;

    box: Box = null;

}