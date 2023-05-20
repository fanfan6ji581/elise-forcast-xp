import * as _ from "lodash";

function fractionParse(a) {
    const split = a.split('/');
    return split[0] / split[1];
}

function generateBalloonDataFromDataSeries(dataSeries) {

    const { asset, volume } = dataSeries;
    const length = asset.length - 100;

    // calculate aberration and shift
    const balloonValues = _.slice(asset, 99);
    const balloonSpeed = _.slice(volume, 99);
    const aberration = Array.from({ length: length + 1 }).fill(0);
    const shift = Array.from({ length: length + 1 }).fill(0);

    for (let i = 1; i <= balloonValues.length; i++) {
        if (balloonValues[i] * balloonValues[i - 1] < 0 &&
            balloonSpeed[i - 1] === 0 &&
            aberration[i - 1] === 0) {
            aberration[i] = 1
        }
        // if (balloonValues[i] * balloonValues[i - 1] < 0 &&
        //     balloonSpeed[i - 1] !== 0 &&
        //     balloonValues[i] * balloonValues[i + 1] > 0) {
        //     shift[i] = 1
        // }
        if (balloonValues[i] * balloonValues[i - 1] < 0) {
            shift[i] = 1
        }
    }

    return {
        xpData: Object.assign({}, {
            asset,
            volume,
            balloonValues,
            balloonSpeed,
            aberration,
            shift,
        }),
        xpRecord: {
            // data recordings
            trialIndex: -1,
            reactionHistory: Array.from({ length }).fill(null),
            clickToShowChartHistory: Array.from({ length }).fill(null),
            choiceHistory: Array.from({ length }).fill(null),
            outcomeHistory: Array.from({ length }).fill(null),
            missHistory: Array.from({ length }).fill(false),
        },
        pickedOutcomeIndexes: [],
    };
}

function generateBalloonData(xp) {
    const state = {
        _numAbberations: 0,
        _numDangerzone: 0,
        _dangerZoneSpeedReset: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _dangerZoneResetCalc: ["0.00", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    const dangerZoneChance = 100 * fractionParse(xp.dangerZoneChance)
    const aberrationChance = 100 * fractionParse(xp.aberrationChance)
    const lambda = fractionParse(xp.lambda)

    let cumSum = 1;
    for (let i = 1; i < 10; i++) {
        let probShift = (1 - Math.exp(-i * lambda))
        const expected = probShift * cumSum
        cumSum -= expected
        state._dangerZoneResetCalc[i] = expected.toFixed(2)
    }

    const speedIncrement = xp.delta
    let balloonValues = [];
    let balloonSpeed = [];
    let lastBalloonValue = 2;
    let lastBalloonSpeed = 0;
    let depthIntoDangerZone = 1;
    while (balloonValues.length <= xp.numberOfTrials) {
        let num = 100 * Math.random();
        if (lastBalloonSpeed === 0) {
            // dangerzone chance
            if (num <= dangerZoneChance) {
                lastBalloonSpeed += speedIncrement;
                balloonSpeed.push(lastBalloonSpeed)
                balloonValues.push(lastBalloonValue);
                state._numDangerzone++;
                continue;
            }

            // aberration chance
            else if (num <= aberrationChance + dangerZoneChance) {
                balloonValues.push(lastBalloonValue * -1)
                balloonValues.push(lastBalloonValue)
                balloonSpeed.push(lastBalloonSpeed)
                balloonSpeed.push(lastBalloonSpeed)
                state._numAbberations++;
                continue;
            }
            else {
                balloonValues.push(lastBalloonValue)
                balloonSpeed.push(lastBalloonSpeed)
            }
        } else {   // in danger zone
            let probShift = 100 * (1 - Math.exp(-depthIntoDangerZone * lambda))
            if (num <= probShift) {
                state._dangerZoneSpeedReset[depthIntoDangerZone]++
                depthIntoDangerZone = 1
                lastBalloonValue *= -1
                balloonValues.push(lastBalloonValue)
                lastBalloonSpeed = 0
                balloonSpeed.push(lastBalloonSpeed)
            } else {
                depthIntoDangerZone += 1
                lastBalloonSpeed += speedIncrement;
                balloonValues.push(lastBalloonValue)
                balloonSpeed.push(lastBalloonSpeed)
            }
        }
    }

    const sum = state._dangerZoneSpeedReset.reduce((prev, next) => prev + next);
    const chances = state._dangerZoneSpeedReset.map(item => (item / sum).toFixed(2));

    // calculate aberration and shift
    const aberration = Array.from({ length: xp.numberOfTrials + 1 }).fill(0);
    const shift = Array.from({ length: xp.numberOfTrials + 1 }).fill(0);

    for (let i = 1; i <= xp.numberOfTrials; i++) {
        if (balloonValues[i] * balloonValues[i - 1] < 0 &&
            balloonSpeed[i - 1] === 0 &&
            aberration[i - 1] === 0) {
            aberration[i] = 1
        }
        // if (balloonValues[i] * balloonValues[i - 1] < 0 &&
        //     balloonSpeed[i - 1] !== 0 &&
        //     balloonValues[i] * balloonValues[i + 1] > 0) {
        //     shift[i] = 1
        // }
        if (balloonValues[i] * balloonValues[i - 1] < 0) {
            shift[i] = 1
        }
    }

    return {
        xpData: Object.assign({}, state, {
            chances,
            balloonValues,
            balloonSpeed,
            asset: balloonValues,
            volume: balloonSpeed,
            aberration,
            shift,
        }),
        xpRecord: {
            // data recordings
            trialIndex: -1,
            reactionHistory: Array.from({ length: xp.numberOfTrials }).fill(null),
            clickToShowChartHistory: Array.from({ length: xp.numberOfTrials }).fill(null),
            choiceHistory: Array.from({ length: xp.numberOfTrials }).fill(null),
            outcomeHistory: Array.from({ length: xp.numberOfTrials }).fill(null),
            missHistory: Array.from({ length: xp.numberOfTrials }).fill(false),
        },
        pickedOutcomeIndexes: [],
    };
}

function extractXpData(attendant, xpConfig) {
    const {
        xpData,
        xpRecord,
        pickedOutcomeIndexes,
    } = attendant;
    const rows = []
    const {
        balloonValues,
        balloonSpeed,
        aberration,
        shift,
    } = xpData;
    const {
        reactionHistory,
        choiceHistory,
        outcomeHistory,
        clickToShowChartHistory,
    } = xpRecord;

    let sum = 0;
    const accumulateOutcomeHistory = outcomeHistory.map((v, i) => {
        if (pickedOutcomeIndexes.includes(i)) {
            sum = sum + v
            return sum;
        }
        return null;
    });

    const mcqs = calcuateCorrectness(attendant, xpConfig);

    for (let i = 0; i < balloonValues.length; i++) {
        rows.push(Object.assign(
            {
                id: i + 1,
                value: balloonValues[i],
                speed: balloonSpeed[i],
                aberration: aberration[i],
                shift: shift[i],
                reaction: reactionHistory[i],
                choice: choiceHistory[i],
                outcome: outcomeHistory[i],
                pickedOutcome: pickedOutcomeIndexes.includes(i) ? outcomeHistory[i] : null,
                accumulateOutcome: accumulateOutcomeHistory[i],
                clickToShowChart: clickToShowChartHistory[i] === null ? '' : clickToShowChartHistory[i] ? 1 : 0,
            },
            {
                username: attendant.username,
                gender: attendant.gender,
                age: attendant.age,
                major: attendant.major,
            }, mcqs,
            {
                strategy: attendant.strategy,
                strategy2: attendant.strategy2,
            }
        ))
    }
    return rows;
}

const calcuateCorrectness = (attendant, xpConfig) => {
    if (!attendant.quizAnswers) {
        return {};
    }

    let solution;

    switch (xpConfig.treatment) {
        case 3:
            solution = {
                mcq1: 2,
                mcq2: 1,
                mcq3: 1,
                mcq4: 2,
                mcq5: 2,
                mcq6: 3,
                mcq7: 4,
                mcq8: 1,
                mcq9: 1,
                mcq10: 2,
                mcq11: 1,
            }
            return {
                mcq1: attendant.quizAnswers.mcq1 === solution.mcq1 ? 1 : 0,
                mcq2: attendant.quizAnswers.mcq2 === solution.mcq2 ? 1 : 0,
                mcq3: attendant.quizAnswers.mcq3 === solution.mcq3 ? 1 : 0,
                mcq4: attendant.quizAnswers.mcq4 === solution.mcq4 ? 1 : 0,
                mcq5: attendant.quizAnswers.mcq5 === solution.mcq5 ? 1 : 0,
                mcq6: attendant.quizAnswers.mcq6 === solution.mcq6 ? 1 : 0,
                mcq7: attendant.quizAnswers.mcq7 === solution.mcq7 ? 1 : 0,
                mcq8: attendant.quizAnswers.mcq8 === solution.mcq8 ? 1 : 0,
                mcq9: attendant.quizAnswers.mcq9 === solution.mcq9 ? 1 : 0,
                mcq10: attendant.quizAnswers.mcq10 === solution.mcq10 ? 1 : 0,
                mcq11: attendant.quizAnswers.mcq11 === solution.mcq11 ? 1 : 0,
            };
        case 2:
            solution = {
                mcq1: 2,
                mcq2: 2,
                mcq3: 3,
                mcq4: 4,
                mcq5: 1,
                mcq6: 1,
                mcq7: 1,
                mcq8: 2,
                mcq9: 1,
            }
            return {
                mcq1: attendant.quizAnswers.mcq1 === solution.mcq1 ? 1 : 0,
                mcq2: attendant.quizAnswers.mcq2 === solution.mcq2 ? 1 : 0,
                mcq3: attendant.quizAnswers.mcq3 === solution.mcq3 ? 1 : 0,
                mcq4: attendant.quizAnswers.mcq4 === solution.mcq4 ? 1 : 0,
                mcq5: attendant.quizAnswers.mcq5 === solution.mcq5 ? 1 : 0,
                mcq6: attendant.quizAnswers.mcq6 === solution.mcq6 ? 1 : 0,
                mcq7: attendant.quizAnswers.mcq7 === solution.mcq7 ? 1 : 0,
                mcq8: attendant.quizAnswers.mcq8 === solution.mcq8 ? 1 : 0,
                mcq9: attendant.quizAnswers.mcq9 === solution.mcq9 ? 1 : 0,
            };
        case 1:
        default:
            solution = {
                mcq1: 2,
                mcq2: 2,
                mcq3: 3,
                mcq4: 4,
                mcq5: 1,
                mcq6: 1,
                mcq7: 2,
                mcq8: 1,
            }

            return {
                mcq1: attendant.quizAnswers.mcq1 === solution.mcq1 ? 1 : 0,
                mcq2: attendant.quizAnswers.mcq2 === solution.mcq2 ? 1 : 0,
                mcq3: attendant.quizAnswers.mcq3 === solution.mcq3 ? 1 : 0,
                mcq4: attendant.quizAnswers.mcq4 === solution.mcq4 ? 1 : 0,
                mcq5: attendant.quizAnswers.mcq5 === solution.mcq5 ? 1 : 0,
                mcq6: attendant.quizAnswers.mcq6 === solution.mcq6 ? 1 : 0,
                mcq7: attendant.quizAnswers.mcq7 === solution.mcq7 ? 1 : 0,
                mcq8: attendant.quizAnswers.mcq8 === solution.mcq8 ? 1 : 0,
            }
    }

}

export {
    generateBalloonDataFromDataSeries,
    generateBalloonData,
    extractXpData,
    calcuateCorrectness,
};