import { createSlice } from '@reduxjs/toolkit';
import { generateBalloonData } from '../util/xp_data';

const initialState = {
    trialIndex: 0,
    timerProgress: 0,
    progressStartTime: 0,
    showMoneyOutcome: false,
    showAfterClickDelay: false,

    // internal data
    xpData: {},
    xpConfig: {},
    choiceHistory: [],
    outcomeHistory: [],
    missHistory: [],
    reactionHistory: [],
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        recordMulResp: (state, action) => {
            const { xpData, xpConfig, trialIndex } = state;
            const { mul, missed } = action.payload;

            // keep mul history
            state.choiceHistory[trialIndex] = mul;
            state.missHistory[trialIndex] = missed;
            let money = xpData.balloonValues[trialIndex + 1] * mul;
            // if different with previous one, add up a switch cost
            if (trialIndex > 0) {
                money -= state.choiceHistory[trialIndex - 1] * mul < 0 ? xpConfig.costToSwitch : 0;
            }
            if (missed) {
                money = -xpConfig.afkTimeoutCost;
            }
            state.outcomeHistory[trialIndex] = money;

            if (!missed) {
                state.reactionHistory[trialIndex] = Date.now() - state.progressStartTime;
            }

            // should show outcome
            if (missed || mul !== 0) {
                state.showAfterClickDelay = true;
            } else {
                // when click pass
                state.timerProgress = 0;
                state.trialIndex++;
            }
        },
        setShowMoneyOutcome: (state, action) => {
            state.showMoneyOutcome = action.payload;
            // means delay has finished
            state.showAfterClickDelay = false;
        },
        setTimerProgress: (state, action) => {
            state.timerProgress = Math.min(100, action.payload);
        },
        setProgressStartTime: (state, action) => {
            state.progressStartTime = action.payload;
        },
        nextTrial: (state) => {
            state.showMoneyOutcome = false;
            state.timerProgress = 0;
            state.trialIndex++;
        },
        onLoginTraining: (state, action) => {
            const { xpConfig } = action.payload
            // random generated xpData
            const { xpData } = generateBalloonData(xpConfig);
            state.xpData = xpData;
            state.xpConfig = xpConfig;

            // reset
            state.choiceHistory = [];
            state.outcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.trialIndex = 0;
            state.timerProgress = 0;
            state.showAfterClickDelay = false;
            state.showMoneyOutcome = false;
        },
        reset: (state) => {
            state.trialIndex = -1;
            state.choiceHistory = [];
            state.outcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.showAfterClickDelay = false;
            state.showMoneyOutcome = false;
            state.timerProgress = 0;
        },
        onLogin: (state, action) => {
            const { xpData, xpRecord, xpConfig } = action.payload
            const {
                trialIndex,
                choiceHistory,
                outcomeHistory,
                missHistory,
                reactionHistory,
            } = xpRecord;
            state.trialIndex = trialIndex + 1;
            state.choiceHistory = choiceHistory;
            state.outcomeHistory = outcomeHistory;
            state.missHistory = missHistory;
            state.reactionHistory = reactionHistory;
            state.xpData = xpData;
            state.xpConfig = xpConfig;
            state.timerProgress = 0;
            state.showAfterClickDelay = false;
            state.showMoneyOutcome = false;
        },
    },
});

export const { recordMulResp, setProgressStartTime,
    setTimerProgress, nextTrial, onLogin, onLoginTraining,
    setShowMoneyOutcome, reset } = gameSlice.actions;

export const trialIndex = (state) => state.game.trialIndex;
export const showAfterClickDelay = (state) => state.game.showAfterClickDelay;
export const timerProgress = (state) => state.game.timerProgress;
export const showMoneyOutcome = (state) => state.game.showMoneyOutcome;
export const choiceHistory = (state) => state.game.choiceHistory;
export const outcomeHistory = (state) => state.game.outcomeHistory;
export const missHistory = (state) => state.game.missHistory;
export const reactionHistory = (state) => state.game.reactionHistory;
export const xpDataS = (state) => state.game.xpData;
export const xpConfigS = (state) => state.game.xpConfig;

export default gameSlice.reducer;
