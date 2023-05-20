import {
    Container, Box, Typography, Button,
} from "@mui/material";
import { Link, useParams } from "react-router-dom"
// import { xpConfigS } from "../../../slices/gameSlice";
// import { useSelector } from "react-redux";
import image9 from "../../../assets/image9.png";
import image10 from "../../../assets/image10.png";


const InstructionHowToPlayPage = () => {
    const { alias } = useParams();
    // const xpConfig = useSelector(xpConfigS);

    return (
        <Container maxWidth="md">

            <Typography variant="h4" align="center" sx={{ my: 5 }}>
                How To Play The Game
            </Typography>

            <Typography variant="h6" sx={{ my: 2 }}>
                The beginning of each trial looks like this:
            </Typography>

            <Box sx={{ textAlign: "center", my: 2 }}>
                <Box component="img" alt="" src={image9} sx={{ width: '80%', boxShadow: 3 }} />
            </Box>

            <Typography variant="h6" sx={{ my: 5 }}>
                Note the volume chart is not apparent on screen by default. 
                To make it appear (if you find it useful), 
                you just have to click anywhere on the blank space below the asset chart, and the volume chart will instantaneously appear on screen:
            </Typography>

            <Box sx={{ textAlign: "center", my: 2 }}>
                <Box component="img" alt="" src={image10} sx={{ width: '80%', boxShadow: 3 }} />
            </Box>

            <Typography variant="h6" sx={{ my: 5 }}>
                Once you’ve made your mind, click on the button on top that corresponds to your decision. Your outcome at the trial is displayed on screen shortly after you’ve clicked (you’ll have the opportunity to do a short training session next so you can see how it looks ☺
            </Typography>

            <Box textAlign="center" sx={{ my: 10 }}>
                <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction`} sx={{ mx: 2 }}>Prev</Button>
                <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-payment`} sx={{ mx: 2 }}>Next</Button>
            </Box>
        </Container>
    )
}

export default InstructionHowToPlayPage