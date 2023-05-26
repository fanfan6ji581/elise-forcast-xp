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

                <Typography variant="h6" sx={{ my: 2 }}>
                    The computer records your outcome on each trial and randomly selects {xpConfig.percentageEarning}% of the trials
                    at the end of the experiment.
                    Your net accumulated outcomes in these trials define your earnings (i.e., the money you will receive from us).
                    If your final earnings are negative, you will only get $5 AUD, which we give to all participants irrespective of their performance in the task (more below).
                </Typography>

                <Typography variant="h6" sx={{ my: 2 }}>
                    You have {xpConfig.afkTimeout / 1000} seconds to make your decision on each trial.
                    If you fail to reply within the allowed time, this is a missed trial.
                </Typography>

                <Typography variant="h6" sx={{ my: 2 }}>
                    After {xpConfig.missLimit} missed trials
                    the game will stop automatically, and you will not receive any payment, so please keep up with the pace.😊
                </Typography>

                <Typography variant="h6" sx={{ my: 2 }}>
                    A show-up payment of $5 AUD is given to all participants irrespective of their performance in the experimental task. Moreover, you can earn a significant amount of money from the task (up to $100 AUD) if you perform well, but payments will also be varying considerably across participants. To be more specific, if you play optimally, you will be mostly likely to leave the lab with more than $80 AUD, and even highly likely to get the max payment of $100 AUD. However, if you do not implement the optimal strategy for the task, your most likely payoff from the task will be $0 AUD, which means that you will leave the lab with only the show up payment of $5 AUD.
                </Typography>
                <Typography variant="h6" sx={{ my: 2 }}>
                    To start with, please double-check that you understand the rules of the game:
                    if anything of the above is unclear, please seek clarification!
                </Typography>


                <Box textAlign="center" sx={{ my: 10 }}>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-how-to-play`} sx={{ mx: 2 }}>Prev</Button>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-before-training`} sx={{ mx: 2 }}>Next</Button>
                </Box>
            </Grid>
        </Container>
    )
}

export default Instruction3Page