import { Router } from "express";
import GameController from "../controllers/game.controller";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../validation";
import { saveScoreSchema } from "../validation/schemas";

const gameRouter = Router();

gameRouter.post('/save-score/:gameId', authMiddleware, validate(saveScoreSchema), GameController.saveScore);

gameRouter.get('/get-score/:gameId', authMiddleware, GameController.getScore);
gameRouter.get('/get-many-scores/:gameId', GameController.getManyScores);
gameRouter.get('/games', GameController.getGames);

export default gameRouter;