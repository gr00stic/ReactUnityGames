import GameService from "../services/game.service";
import { NextFunction, Request, Response } from "express";

class GameController {
    async saveScore(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                level = 0,
                score = 0,
                region
            }: {
                level: number,
                score: number,
                region: string
            } = req.body;

            const userId = req.user.id;
            const gameId = req.params.gameId;

            const newScore = await GameService.saveScore(userId, gameId, level, score, region);

            return res.json(newScore);
        } catch (e) {
            next(e);
        }
    }

    async getScore(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const region = req.user.region;
            const gameId = req.params.gameId

            const score = await GameService.getScore(userId, region, gameId);

            return res.json(score);
        } catch (e) {
            next(e);
        }
    }

    async getManyScores(req: Request, res: Response, next: NextFunction) {
        try {
            const gameId = req.params.gameId;
            let region;

            req.query.region ? region = String(req.query.region) : region = 'Europe';

            const scores = await GameService.getManyScores(gameId, region);

            return res.json(scores);
        } catch (e) {
            next(e);
        }
    }

    async getGames(req: Request, res: Response, next: NextFunction) {
        try {
            const games = await GameService.getGames();

            return res.json(games);
        } catch (e) {
            next(e);
        }
    }
}

export default new GameController();