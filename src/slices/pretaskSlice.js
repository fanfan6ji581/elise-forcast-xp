import { createSlice, current } from '@reduxjs/toolkit';
import * as _ from "lodash";

function isBet(bet, expected) {
    return _.isEqual(_.sortBy(bet), _.sortBy(expected))
}

function isLastBet(betHistory, expected) {
    return isBet(betHistory[betHistory.length - 1], expected)
}

// #1 case
function isAllSkip(betHistory) {
    for (let bets of betHistory) {
        if (!isBet(bets, ["skip"])) {
            return false;
        }
    }
    return true;
}

// #2 case
function isPrevAllSkipLastBlueOrIndiffBlue(betHistory) {
    if (betHistory.length < 2) {
        return false;
    }
    const prev = _.slice(betHistory, 0, betHistory.length - 1);
    return isAllSkip(prev) &&
        (isLastBet(betHistory, "a") || isLastBet(betHistory, ["a", "skip"]))
}

// #3 case
function isCase2ThenAllSkip(betHistory) {
    if (betHistory.length < 3) {
        return false;
    }

    const allOthers = _.filter(betHistory, bet => !isBet(bet, ["skip"]));
    const allSkips = _.filter(betHistory, bet => isBet(bet, ["skip"]));
    return allOthers.length === 1 &&
        allSkips.length === betHistory.length - 1 &&
        isBet(betHistory[0], ["skip"]) &&
        isLastBet(betHistory, ["skip"]) &&
        (isLastBet(allOthers, "a") || isLastBet(allOthers, ["a", "skip"]))
        ;
}

// #4 case
function isAllBlue(betHistory) {
    for (let bets of betHistory) {
        if (!isBet(bets, ["a"])) {
            return false;
        }
    }
    return true;
}

// #5 case only 1 line, ignore her

// #6 case
function isCase6(betHistory) {
    if (betHistory.length < 2) {
        return false;
    }

    return isBet(betHistory[0], ["a", "skip"]) &&
        isAllSkip(_.slice(betHistory, 1))
}

function setNextBallAQty(state, val) {
    let nextVal = Math.max(0,
        Math.min(state.pretask.totalQty,
            state.ballAQty[state.trialIndex - 1] + val));
    if (nextVal === 0 || nextVal === state.pretask.totalQty) {
        return triggerReset(state);
    }
    state.ballAQty.push(nextVal);
}

function triggerReset(state) {
    state.resetHistory.push(state.trialIndex);
    state.ballAQty.push(state.pretask.ballAQty);
}

const initialState = {
    trialIndex: 0,
    timerProgress: 0,
    progressStartTime: 0,
    showMoneyOutcome: false,
    showAfterClickDelay: false,

    // internal data
    bets: [],
    betA: false,
    betB: false,
    betSkip: false,

    pretask: {},
    ballAQty: [],
    resetHistory: [],
    betResultHistory: [],
    betHistory: [],
    betChosenHistory: [],
    moneyOutcomeHistory: [],
    missHistory: [],
    reactionHistory: [],
};

const pretaskSlice = createSlice({
    name: 'pretask',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        recordBet: (state, action) => {
            const { bets, missed } = action.payload
            state.betHistory.push(bets);
            state.reactionHistory.push(Date.now() - state.progressStartTime);
            state.missHistory.push(missed);
            const randomNum = Math.round(Math.random() * 100)
            const betResult = randomNum < state.ballAQty[state.trialIndex] ?
                'a' : 'b';
            state.betResultHistory.push(betResult);
            if (missed) {
                state.moneyOutcomeHistory.push(state.pretask.missLose)
                state.betChosenHistory.push('')
            } else {
                // calculate moneyOutcome
                let bet = bets[0];
                if (state.bets.length > 1 && Math.random() > 0.5) {
                    bet = bets[1];
                }
                let moneyOutcome = 0;

                if (bet === 'skip') {
                    moneyOutcome = 0;
                }
                if (betResult === 'a' && bet === 'a') {
                    moneyOutcome = state.pretask.ballAWin;
                }
                if (betResult === 'b' && bet === 'a') {
                    moneyOutcome = state.pretask.ballALose;
                }
                if (betResult === 'b' && bet === 'a') {
                    moneyOutcome = state.pretask.ballBLose;
                }
                if (betResult === 'b' && bet === 'b') {
                    moneyOutcome = state.pretask.ballBWin;
                }
                state.betChosenHistory.push(bet)
                state.moneyOutcomeHistory.push(moneyOutcome);
            }
            // show a delay before next game start
            state.showAfterClickDelay = true;
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
            state.bets = [];
            state.betA = false;
            state.betB = false;
            state.betSkip = false;


            // calculate next value based on the tree
            const lastResetIndex = current(state.resetHistory).length > 0 ?
                _.last(current(state.resetHistory)) : 0;
            const partialBetHistory = current(state.betHistory).slice(lastResetIndex);

            const x = state.pretask.x
            if (current(state.missHistory)[state.trialIndex - 1]) {
                // if last bet missed, then do nothing
                // console.log('case missed')
                setNextBallAQty(state, 0)
            } else if (isAllSkip(partialBetHistory)) {
                // console.log('case 1')
                setNextBallAQty(state, x)
            } else if (isPrevAllSkipLastBlueOrIndiffBlue(partialBetHistory)) {
                // console.log('case 2')
                setNextBallAQty(state, -x)
            } else if (isCase2ThenAllSkip(partialBetHistory)) {
                // console.log('case 3')
                setNextBallAQty(state, -x)
            } else if (isAllBlue(partialBetHistory)) {
                // console.log('case 4')
                setNextBallAQty(state, -x)
            } else if (partialBetHistory.length === 1 && isLastBet(partialBetHistory, ["a", "skip"])) {
                // console.log('case 5')
                setNextBallAQty(state, -x)
            } else if (isCase6(partialBetHistory)) {
                // console.log('case 6')
                setNextBallAQty(state, -x)
            } else {
                // console.log('reset')
                triggerReset(state);
            }
        },
        resetTraining: (state, action) => {
            let { pretask } = action.payload;
            state.pretask = pretask;
            state.trialIndex = 0;
            state.ballAQty = [];
            state.resetHistory = [];
            state.betResultHistory = [];
            state.betHistory = [];
            state.betChosenHistory = [];
            state.moneyOutcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.ballAQty = [pretask.ballAQty];
        },
        removeData: (state, action) => {
            state.trialIndex = 0;
            state.ballAQty = [];
            state.resetHistory = [];
            state.betResultHistory = [];
            state.betHistory = [];
            state.betChosenHistory = [];
            state.moneyOutcomeHistory = [];
            state.missHistory = [];
            state.reactionHistory = [];
            state.ballAQty = [];
        },
        reset: (state, action) => {
            let { pretask, pretaskRecord } = action.payload;
            state.pretask = pretask;
            state.ballAQty = [];

            pretaskRecord = pretaskRecord || {};

            state.trialIndex = pretaskRecord.trialIndex || 0;
            state.ballAQty = pretaskRecord.ballAQty || [];
            state.resetHistory = pretaskRecord.resetHistory || [];
            state.betResultHistory = pretaskRecord.betResultHistory || [];
            state.betHistory = (pretaskRecord.betHistory || []).map(el => el.split(','));
            state.betChosenHistory = pretaskRecord.betChosenHistory || [];
            state.moneyOutcomeHistory = pretaskRecord.moneyOutcomeHistory || [];
            state.missHistory = pretaskRecord.missHistory || [];
            state.reactionHistory = pretaskRecord.reactionHistory || [];

            if (state.ballAQty.length === 0) {
                state.ballAQty = [pretask.ballAQty];
            }

        },
        updateBet: (state, action) => {
            const { type, value } = action.payload;
            if (value && !state.bets.includes(type)) {
                state.bets.push(type);
                if (current(state.bets).length > 2) {
                    state.bets.shift();
                }
            } else {
                state.bets = state.bets.filter(v => v !== type);
            }

            state.betA = state.bets.includes("a");
            state.betB = state.bets.includes("b");;
            state.betSkip = state.bets.includes("skip");;
        },
    },
});

export const {
    recordMulResp,
    setProgressStartTime,
    setTimerProgress,
    nextTrial,
    setShowMoneyOutcome,
    reset,
    next,
    recordBet,
    updateBet,
    resetTraining,
    removeData,
} = pretaskSlice.actions;

export const trialIndex = (state) => state.pretask.trialIndex;
export const ballAQty = (state) => state.pretask.ballAQty;
export const showAfterClickDelay = (state) => state.pretask.showAfterClickDelay;
export const timerProgress = (state) => state.pretask.timerProgress;
export const showMoneyOutcome = (state) => state.pretask.showMoneyOutcome;
export const betHistory = (state) => state.pretask.betHistory;
export const moneyOutcomeHistory = (state) => state.pretask.moneyOutcomeHistory;
export const missHistory = (state) => state.pretask.missHistory;
export const reactionHistory = (state) => state.pretask.reactionHistory;
export const pretask = (state) => state.pretask.pretask;
export const betA = (state) => state.pretask.betA;
export const betB = (state) => state.pretask.betB;
export const betSkip = (state) => state.pretask.betSkip;
export const bets = (state) => state.pretask.bets;
export const resetHistory = (state) => state.pretask.resetHistory;
export const betResultHistory = (state) => state.pretask.betResultHistory;
export const betChosenHistory = (state) => state.pretask.betChosenHistory;

export default pretaskSlice.reducer;
