import balloon from '../../../assets/balloon.png';
import { motion } from "framer-motion";
import { Box, Button, Grid, Tooltip, Typography, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    showMoneyOutcome, recordMulResp, setShowMoneyOutcome, showAfterClickDelay,
    choiceHistory, missHistory, trialIndex
} from "../../../slices/gameSlice";
import { Fragment, useEffect, useRef } from 'react';

export default function BalloonScreen({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const choiceHistoryS = useSelector(choiceHistory);
    const missHistoryS = useSelector(missHistory);
    const trialIndexS = useSelector(trialIndex);
    const showAfterClickDelayS = useSelector(showAfterClickDelay);
    const loadingInterval = useRef(null);
    const { costToSwitch, choiceDelay } = xpConfig;

    const variants = {
        hover: {
            scale: 1.2,
            transition: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 0.5,
            }
        },
    }

    const clickedAction = (mul) => {
        dispatch(recordMulResp({ mul, missed: false }));
    }

    useEffect(() => {
        if (showAfterClickDelayS) {
            loadingInterval.current = setTimeout(() => {
                dispatch(setShowMoneyOutcome(true));
            }, choiceDelay)
        }

        return () => clearInterval(loadingInterval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAfterClickDelayS])


    return (
        <>
            <Grid container
                style={(showAfterClickDelayS || showMoneyOutcomeS) ?
                    { filter: "grayscale(100%)", pointerEvents: "none" } : {}}>
                <Grid item xs={9}>
                    <Grid container alignItems="center">
                        {[2, 1, -1, -2].map((x, i) => {
                            return (
                                <Fragment key={i}>
                                    <Grid item xs={3} />
                                    <Grid item xs={3} justifyContent="end">
                                        <Typography variant={'h3'} align="center">
                                            <b>{x}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} sx={{ my: 1 }}>
                                        <Tooltip placement="right"
                                            title={(trialIndexS > 0 ? choiceHistoryS[trialIndexS - 1] : 0) * x < 0 ? <h2>{'Changing screen costs $' + costToSwitch}</h2> : ""}
                                        >
                                            <motion.img
                                                lastBalloon={(showAfterClickDelayS || showMoneyOutcomeS) && choiceHistoryS[trialIndexS] === x && !missHistoryS[trialIndexS]}
                                                variants={variants}
                                                whileHover="hover"
                                                src={balloon}
                                                alt="balloon"
                                                style={{
                                                    height: 112,
                                                    userSelect: 'none',
                                                    filter:
                                                        `${(showAfterClickDelayS || showMoneyOutcomeS) &&
                                                            choiceHistoryS[trialIndexS] === x && !missHistoryS[trialIndexS] ?
                                                            'drop-shadow(0 0 8px #008080)' :
                                                            ''
                                                        }`,
                                                }}
                                                onClick={() => { clickedAction(x) }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3} />
                                    {x === 1 && <Grid item xs={12} sx={{ m: 2 }}><Divider style={{ background: 'lightgray', height: 2 }} /> </Grid>}
                                </Fragment>
                            )
                        })}
                        <Grid item xs={6}></Grid>
                        <Grid item xs={3}>
                            <Box display={"flex"} justifyContent={"center"} sx={{ m: 3 }}>
                                <Button size="large" variant="contained" onClick={() => clickedAction(0)}                        >
                                    Pass
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3} />
            </Grid>
        </>
    )
}