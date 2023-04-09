function fractionParse(a) {
    const split = a.split('/');
    return split[0] / split[1];
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
        if (balloonValues[i] * balloonValues[i - 1] < 0 &&
            balloonSpeed[i - 1] !== 0 &&
            balloonValues[i] * balloonValues[i + 1] > 0) {
            shift[i] = 1
        }
    }

    return {
        xpData: Object.assign({}, state, {
            chances,
            balloonValues,
            balloonSpeed,
            aberration,
            shift,
        }),
        xpRecord: {
            // data recordings
            trialIndex: -1,
            reactionHistory: Array.from({ length: xp.numberOfTrials }).fill(null),
            choiceHistory: Array.from({ length: xp.numberOfTrials }).fill(0),
            outcomeHistory: Array.from({ length: xp.numberOfTrials }).fill(0),
            missHistory: Array.from({ length: xp.numberOfTrials }).fill(false),
        },
        pickedOutcomeIndexes: [],
    };
}

function extractXpData(attendant) {
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
    } = xpRecord;

    let sum = 0;
    const accumulateOutcomeHistory = outcomeHistory.map((v, i) => {
        if (pickedOutcomeIndexes.includes(i)) {
            sum = sum + v
            return sum;
        }
        return null;
    });

    const mcqs = calcuateCorrectness(attendant);

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
            },
            {
                username: attendant.username,
                gender: attendant.gender,
                age: attendant.age,
                major: attendant.major,
            }, mcqs,
            {
                strategy: attendant.strategy,
            }
        ))
    }
    return rows;
}

const calcuateCorrectness = (attendant) => {
    if (!attendant.quizAnswers) {
        return {};
    }
    const solution = {
        mcq1: 2,
        mcq2: 1,
        mcq3: 2,
        mcq4: 2,
        mcq5: 3,
        mcq6: 3,
        mcq7: 2,
        mcq8: 2,
    }

    return {
        mcq1: attendant.quizAnswers.mcq1 === solution.mcq1 ? 1 : 0,
        mcq2: attendant.quizAnswers.mcq1 === solution.mcq2 ? 1 : 0,
        mcq3: attendant.quizAnswers.mcq1 === solution.mcq3 ? 1 : 0,
        mcq4: attendant.quizAnswers.mcq1 === solution.mcq4 ? 1 : 0,
        mcq5: attendant.quizAnswers.mcq1 === solution.mcq5 ? 1 : 0,
        mcq6: attendant.quizAnswers.mcq1 === solution.mcq6 ? 1 : 0,
        mcq7: attendant.quizAnswers.mcq1 === solution.mcq7 ? 1 : 0,
        mcq8: attendant.quizAnswers.mcq1 === solution.mcq8 ? 1 : 0,
    }
}

export { generateBalloonData, extractXpData, calcuateCorrectness };