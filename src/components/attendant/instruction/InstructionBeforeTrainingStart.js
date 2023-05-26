import { Container, Box, Typography, Button, Grid, } from "@mui/material";
import { Link, useParams } from "react-router-dom"

const BeforeTrainingStart = () => {
    const { alias } = useParams();

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item xs={12}>

                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Just before the training starts
                    </Typography>

                    <Typography variant="h6" sx={{ my: 5 }}>
                        For the main game, you will have 5 minutes to observe the history in the last 100 days before playing the game. But this training session is only provided for you to practice how to play the game, so you don't have extra time to observe the history but need to start playing immediately. Don't worry, your earnings in this training session do not count in your final earnings.
                    </Typography>

                    <Typography variant="h6"  sx={{ my: 5 }}>
                        Please recall that you can make the volume chart appear on screen by clicking anywhere on the blank space below the asset chart, and the volume chart will instantaneously appear on screen.
                    </Typography>

                    <Box textAlign="center" sx={{ my: 10 }}>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-payment`} sx={{ mx: 2 }}>Prev</Button>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }}>Next</Button>
                    </Box>

                </Grid>
            </Grid>

        </Container>
    )
}

export default BeforeTrainingStart