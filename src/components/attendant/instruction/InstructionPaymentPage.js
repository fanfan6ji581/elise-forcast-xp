import {
    Container, Box, Typography, Button, Grid,
} from "@mui/material";
import { Link, useParams } from "react-router-dom"
import { xpConfigS } from "../../../slices/gameSlice";
import { useSelector } from "react-redux";

const Instruction3Page = () => {
    const { alias } = useParams();
    const xpConfig = useSelector(xpConfigS);

    return (
        <Container maxWidth="md">
            <Grid container justifyContent="center">

                <Typography variant="h4" align="center" sx={{ my: 5 }}>
                    Your Payment
                </Typography>

                <Typography variant="h6" sx={{ my: 5 }}>
                    The computer records your outcome on each trial and randomly selects {xpConfig.percentageEarning}% of the trials
                    at the end of the experiment.
                    Your net accumulated outcomes in these trials define your earnings (i.e., the money you will receive from us).
                </Typography>

                <Typography variant="h6" sx={{ my: 5 }}>
                    You have {xpConfig.afkTimeout / 1000} seconds to make your decision on each trial.
                    If you fail to reply within the imparted time, this is a missed trial and after {xpConfig.missLimit} missed trials,
                    the game would stop automatically, and you would not receive any payment, so please keep the pace ☺
                </Typography>

                <Typography variant="h6" sx={{ my: 5 }}>
                    You can earn up to $110 if you play well, but this requires a lot of focus and efforts throughout the task.
                    To start with, please double-check that you understand the rules of the game:
                    if anything of the above is unclear, please seek clarification!
                </Typography>


                <Box textAlign="center" sx={{ my: 10 }}>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction`} sx={{ mx: 2 }}>Prev</Button>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }}>Next</Button>
                </Box>
            </Grid>
        </Container>
    )
}

export default Instruction3Page