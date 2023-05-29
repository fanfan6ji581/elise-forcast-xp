import { Container, Box, Typography, Button, Backdrop, CircularProgress, Grid, } from "@mui/material";
import { Link, useParams } from "react-router-dom"
import { loginAttendant } from "../../../slices/attendantSlice";
import { xpConfigS } from "../../../slices/gameSlice";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import db from "../../../database/firebase";
import { useEffect, useState } from "react"

const Instruction4Page = () => {
    const { alias } = useParams();
    const loginAttendantS = useSelector(loginAttendant);
    const xpConfig = useSelector(xpConfigS);
    const [attendant, setAttendant] = useState(null);
    const [loadingOpen, setLoadingOpen] = useState(true);

    const fetchAttdendant = async () => {
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        const docSnap = await getDoc(attendantRef);
        if (!docSnap.exists()) {
            window.alert("Submit failed, Please refresh the page and try again");
        }
        const attendant = docSnap.data();
        setAttendant(attendant);
        setLoadingOpen(false);
    }

    useEffect(() => {
        fetchAttdendant();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item xs={12}>

                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Ready to Play?
                    </Typography>

                    <Typography variant="h6" sx={{ my: 5 }}>
                        Remember that if you play well, you have fair chances to win the maximal amount (${xpConfig.treatment === 1 ? 150 : 100} AUD). However, the game is hard, and its pace is quick: you have only {xpConfig.afkTimeout / 1000} seconds to make your decision on each trial. If you do not reply within the allowed time,
                        <b style={{ fontSize: 24 }}> you lose ${xpConfig.afkTimeoutCost}</b> and move to the next trial. Have a short training session to learn how to play the game!
                    </Typography>

                    <Box textAlign="center" sx={{ my: 10 }}>
                        <Button component={Link} variant="contained" size="large"
                            sx={{ width: 240, padding: 3 }}
                            to={`/xp/${alias}/training`}>GO TO TRAINING</Button>
                    </Box>
                    {
                        attendant && !attendant.isTrained &&
                        <Box textAlign="center" sx={{ my: 10 }}>
                            <Button color="warning" component={Link} variant="contained" size="large"
                                sx={{ width: 240, padding: 3 }}
                                to={`/xp/${alias}/skip-training`}>SKIP TRAINING</Button>
                        </Box>
                    }

                    {
                        attendant && attendant.isTrained &&
                        <Box textAlign="center" sx={{ my: 10 }}>
                            <Button color="warning" component={Link} variant="outlined" size="large"
                                sx={{ width: 240, padding: 3 }}
                                to={`/xp/${alias}/quiz`}>SKIP TRAINING</Button>
                        </Box>
                    }

                    <Box textAlign="center" >
                        <Button component={Link} variant="outlined" size="large"
                            sx={{ width: 240, padding: 3 }}
                            to={`/xp/${alias}/instruction-before-training`}>prev</Button>
                    </Box>
                </Grid>
            </Grid>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}

export default Instruction4Page