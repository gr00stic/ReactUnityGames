import { useEffect } from "react";
import { Box } from "@mui/material";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getScores, getUserScore, saveScore } from "../../store/slices/gameSlice";

export const Game = () => {

    const params = useParams();

    const dispatch = useAppDispatch();

    const { user, isAuth } = useAppSelector(state => state.auth);
    const { scores, userScores } = useAppSelector(state => state.game);

    const { unityProvider, UNSAFE__detachAndUnloadImmediate } = useUnityContext({
        loaderUrl: `../../../public/games/${params.gameId}/Dip.loader.js`,
        dataUrl: `../../../public/games/${params.gameId}/Dip.data`,
        frameworkUrl: `../../../public/games/${params.gameId}/Dip.framework.js`,
        codeUrl: `../../../public/games/${params.gameId}/Dip.wasm`,
    });

    const saveScoreEventHandler = (e: any) => {
        if (params.gameId !== undefined) {
            dispatch(saveScore({
                gameId: params.gameId,
                score: e.detail,
                level: 0,
                region: user.region
            }));
        }
    }

    useEffect(() => {
        return () => {
            UNSAFE__detachAndUnloadImmediate();
        }
    }, [UNSAFE__detachAndUnloadImmediate]);

    useEffect(() => {
        window.addEventListener('setScore', saveScoreEventHandler);

        const isScoresExist = scores.find(score => score.gameId === params.gameId);
        if (isScoresExist === undefined && params.gameId !== undefined) {
            dispatch(getScores({
                gameId: params.gameId,
                region: user.region
            }));
        }

        if (isAuth) {
            const userScoreIndex = userScores.findIndex(userScore => userScore.gameId === params.gameId);
            if (userScoreIndex === -1 && params.gameId !== undefined) {
                dispatch(getUserScore({ gameId: params.gameId }));
            }
        }

        return () => {
            window.removeEventListener('setScore', saveScoreEventHandler);
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />
        </Box>
    )
}
