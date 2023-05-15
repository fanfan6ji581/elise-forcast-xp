import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { xpConfigS } from "../../../slices/gameSlice";
import { useSelector } from "react-redux";
import image1 from "../../../assets/image1.png";
import image2 from "../../../assets/image2.png";
import image3 from "../../../assets/image3.png";
import image4 from "../../../assets/image4.png";

const Instruction1Page = () => {
  const { alias } = useParams();
  const xpConfig = useSelector(xpConfigS);
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" sx={{ my: 5 }}>
            Welcome to the Financial Forecasting Game!
          </Typography>

          <Grid container alignItems="center" sx={{ my: 5 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ my: 5 }}>
                If you play well you can earn a lot of money in this game (up to $100), so please read the
                following instructions very carefully and ask any clarifying questions to the experimenter.
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                In the game, there is a financial asset that randomly switches between 2 states, say <b>high</b> and <b>low</b>
              </Typography>
            </Grid>

            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image1} sx={{ boxShadow: 0, width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                Some of the switches are "<b>regime shifts</b>": they usually last for several days, as shown in the picture. Others are <b>"aberrations"</b>: the value switches back immediately (see for example, trial 18).
              </Typography>
            </Grid>

          </Grid>
          <Divider />

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image3} sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ ml: 5 }}>
                At the beginning of the game, you'll see what's happened with the asset in the last 100 days.
              </Typography>
            </Grid>

            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image2} sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ ml: 5 }}>
                You will also be shown the history for a volume indicator over the same period.<br />
                This kind of indicator is commonly present on trading screens.
              </Typography>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Box sx={{ mt: 3, border: 1, p: 2, boxShadow: 3 }}>
                <Typography variant="h5" >
                  Your job is to forecast in real time on each of {xpConfig.numberOfTrials} trials
                  whether a regime shift is going to occur over the next day:
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={image4} sx={{ boxShadow: 3, width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
              <ul>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    If you forecast no shift and turn out to be right, you win $1,
                    but if you're wrong (that is, a shift happens), you lose $3.
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    If you manage to correctly forecast a shift, you win $3,
                    but if you wrongly detect a shift (that is, no shift occurs), you lose $1.
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    If you choose to skip, you get $0 (i.e., you don't earn any money but cannot lose either.)
                  </Typography>
                </li>
                <li>
                  <Typography variant="h6" sx={{ my: 3 }}>
                    Take some time to make sure you understand these payoff rules!
                  </Typography>
                </li>
              </ul>
            </Grid>
          </Grid>

          <Box textAlign="center" sx={{ my: 10 }}>
            <Button
              component={Link}
              variant="contained"
              size="large"
              to={`/xp/${alias}/instruction-payment`}
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>

    </Container>
  );
};

export default Instruction1Page;
