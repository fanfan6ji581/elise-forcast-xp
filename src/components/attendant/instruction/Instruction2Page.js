import {
    Container, Box, Grid, Typography, Button,
} from "@mui/material";
import { Link, useParams } from "react-router-dom"
import video2 from "../../../assets/video2.mp4";

const Instruction2Page = () => {
    const { alias } = useParams();

    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Quick summary:
                    </Typography>

                    <Grid container alignItems="center" sx={{ my: 5 }}>
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                            <video width="100%" controls muted styles={{ objecFit: 'fill' }}>
                                <source src={video2} type="video/mp4" />
                            </video>
                        </Grid>
                    </Grid>

                    <Box textAlign="center" sx={{ my: 10 }}>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction1`} sx={{ mx: 2 }}>Prev</Button>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction3`} sx={{ mx: 2 }}>Next</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Instruction2Page