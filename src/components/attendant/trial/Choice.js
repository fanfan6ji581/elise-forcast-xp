import { Button, Grid, } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    showMoneyOutcome, recordChoice, setShowMoneyOutcome, showAfterClickDelay,
} from "../../../slices/gameSlice";
import { useEffect, useRef } from 'react';

export default function Choice({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const showAfterClickDelayS = useSelector(showAfterClickDelay);
    const loadingInterval = useRef(null);
    const { choiceDelay } = xpConfig;


    const clickedAction = (choice) => {
        dispatch(recordChoice({ choice, missed: false }));
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
                sx={{ my: 5 }}
                style={(showAfterClickDelayS || showMoneyOutcomeS) ?
                    { filter: "grayscale(100%)", pointerEvents: "none" } : {}}>
                <Grid item xs={2} />
                <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button size="large" variant="contained" sx={{ mx: 5, width: 160 }} onClick={() => clickedAction("shift")} >
                        Shift
                    </Button>
                    <Button size="large" variant="contained" sx={{ mx: 5, width: 160 }} onClick={() => clickedAction("no shift")}>
                        No Shift
                    </Button>
                    <Button size="large" variant="contained" sx={{ mx: 5, width: 160 }} onClick={() => clickedAction("skip")}>
                        Skip
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}