import { useSelector } from "react-redux";
import { loginAttendant } from "../../slices/attendantSlice";
import { xpConfigS } from "../../slices/gameSlice";
import { Container, Grid, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../database/firebase";

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}

export default function PaymentPage() {
    const loginAttendantS = useSelector(loginAttendant);
    const xpConfig = useSelector(xpConfigS);
    const [earning, setEarning] = useState("...");
    const [loadingOpen, setLoadingOpen] = useState(true);

    const calculateFinalOutcomes = async () => {
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        const docSnap = await getDoc(attendantRef);
        if (!docSnap.exists()) {
            return;
        }

        const attendant = docSnap.data();
        let { xpRecord, pickedOutcomeIndexes,  } = attendant;
        const { outcomeHistory, missHistory } = xpRecord;

        // check if pickedOutcomeIndexes is calculated already
        const isCalculated = pickedOutcomeIndexes && pickedOutcomeIndexes.length !== 0;
        if (!isCalculated) {
            const shuffledIndex = outcomeHistory.map((_, idx) => (idx));
            shuffle(shuffledIndex);
            const length = Math.round(xpConfig.numberOfTrials * xpConfig.percentageEarning / 100);
            const pickedIndex = shuffledIndex.slice(0, length);
            pickedOutcomeIndexes = pickedIndex.sort((a, b) => a - b);
            await updateDoc(attendantRef, { pickedOutcomeIndexes });
        }

        // when miss too much, ignore result
        if (missHistory.filter(x => x).length >= xpConfig.missLimit) {
            setEarning(0);
            setLoadingOpen(false);
            return;
        }

        const sumEarning = pickedOutcomeIndexes.reduce((a, b) => a + outcomeHistory[b], 0);
        const earning = Math.max(5, Math.min(100, sumEarning));
        setEarning(earning);
        setLoadingOpen(false);
    }

    useEffect(() => {
        calculateFinalOutcomes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="md">
            <Grid container justifyContent="center">
                <Grid item xs={1} />
                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Game over!
                    </Typography>

                    <Typography variant="body1" sx={{ my: 5 }}>
                        The game is over. The computer just randomly selected {xpConfig.percentageEarning}%
                        of the trials you played and computed your net accumulated outcomes at these trials.
                    </Typography>

                    <Typography variant="body1" sx={{ my: 5 }}>
                        Your earnings are <b>${earning}</b>. Please wait, the experimenter will come shortly.
                    </Typography>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loadingOpen}
                        onClick={() => setLoadingOpen(false)}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Grid>
            </Grid>
        </Container>
    )
}