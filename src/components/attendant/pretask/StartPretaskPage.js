import {
    Container, Typography, Button, Box, Backdrop, CircularProgress
} from "@mui/material";
import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getPretask } from "../../../database/pretask";

const StartPretaskPage = () => {
    const { alias } = useParams();
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [pretask, setPretask] = useState(null);

    const fetchPretask = async () => {
        setPretask(await getPretask(alias));
        setLoadingOpen(false);
    }

    useEffect(() => {
        fetchPretask()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="md">
                <Typography variant="h4" align="center" sx={{ py: 5 }}>
                    Ready to Start?
                </Typography>

                <Box textAlign="center" sx={{ py: 15 }}>
                    <Button component={Link} variant="contained" size="large"
                        to={`/xp/${alias}/pretask`}
                        disabled={!pretask || !pretask.enablePretaskPlaying}
                        sx={{ m: 3 }}
                    >Start Game</Button>

                    <br />

                    <Button component={Link} variant="outlined" size="large"
                        to={`/xp/${alias}/pretask/instruction1`}
                        sx={{ m: 3 }}
                    >Back to instruction</Button>
                    {
                        pretask && !pretask.enablePretaskPlaying &&
                        <Typography variant="h6" align="center" sx={{ my: 5 }}>Waiting for experimenter to enable the game.</Typography>
                    }
                </Box>
            </Container>
        </>

    )
}

export default StartPretaskPage