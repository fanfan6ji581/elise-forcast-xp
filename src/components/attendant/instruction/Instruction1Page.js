import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Link, useParams } from "react-router-dom";
import { loginAttendant } from "../../../slices/attendantSlice";
import { useSelector } from "react-redux";
import pickBalloon from "../../../assets/pickBalloon.png";
import valueHistoryChart from "../../../assets/valueHistoryChart.png";
import speedHistoryChart from "../../../assets/speedHistoryChart.png";
import danger2 from "../../../assets/danger2.png";
import regime from "../../../assets/regime.png";
import video1 from "../../../assets/video1.mp4";
import Xarrow from "react-xarrows";
import { useRef } from "react";
// import YouTube from 'react-youtube';

const Instruction1Page = () => {
  const { alias } = useParams();
  const loginAttendantS = useSelector(loginAttendant);
  const { xpConfig } = loginAttendantS;
  const box1 = useRef(null);
  const box2 = useRef(null);
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" sx={{ my: 5 }}>
            Welcome to the Balloon Game!
          </Typography>

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              <Box component="img" alt="" src={pickBalloon} sx={{ height: 360 }} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ my: 5 }}>
                If you play well you can earn a lot of money in this game (up to $150),
                so please read the following instructions very carefully.
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                In this game, in each of {xpConfig.numberOfTrials} trials, you are
                to choose whether and where to pop a balloon on a screen with 2
                panels. You can choose to pop the balloon on the top panel (line 1
                or line 2) or the bottom panel (line -1 or line -2).
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                Alternatively, you can choose to pass, in which case you get $0 for
                sure (i.e., you are guaranteed to not lose any money at the trial,
                but you cannot win money either).
              </Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={7} alignContent="center">
              <Box
                component="img"
                alt=""
                src={valueHistoryChart}
                sx={{ width: "100%", ml: -5 }}
              />
            </Grid>
            <Grid item xs={5}>
              <Typography variant="h6" sx={{ my: 5 }}>
                If you choose to pop the balloon, you win money if you pop in the
                panel that matches the realization of a random variable that
                randomly switches between two possible values ($2 and -$2):
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <TableContainer component={Paper} elevation={6}>
                <Table>
                  <TableHead sx={{ fontSize: 24 }}>
                    <TableRow sx={{ "td, th": { border: 0 } }}>
                      <TableCell sx={{ "td, th": { border: 0 } }}></TableCell>
                      <TableCell
                        sx={{
                          "td, th": {
                            borderBottom: 0,
                            borderRight: "1px solid #eee",
                          },
                        }}
                      ></TableCell>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ fontSize: 20 }}
                      >
                        Pop at Line:
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>-2</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>-1</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>1</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>2</b>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        rowSpan={4}
                        component="th"
                        width={200}
                        sx={{ fontSize: 20, color: "primary.main" }}
                      >
                        Stock Value Next Trial
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderLeft: "1px solid #eee",
                          borderRight: "1px solid #eee",
                        }}
                      >
                        <Typography variant="h5">
                          <b>$2</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>-$4</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>-$2</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>$2</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>$4</b>
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          borderLeft: "1px solid #eee",
                          borderRight: "1px solid #eee",
                        }}
                      >
                        <Typography variant="h5">
                          <b>-$2</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>$4</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>$2</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>-$2</b>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h5">
                          <b>-$4</b>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={1} />
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 3 }} align="center">
                Switching to the other panel costs ${xpConfig.costToSwitch}. So the
                game works like this:
              </Typography>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={8}>
              {/* <YouTube videoId="7NWvhfjGAVY" opts={{ width: '100%', height: 500 }} /> */}
              <video width="100%" controls styles={{ objecFit: 'fill' }}>
                <source src={video1} type="video/mp4" />
              </video>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={7} alignContent="center">
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  alt=""
                  src={speedHistoryChart}
                  sx={{ height: 244, ml: -20 }}
                />
                <div style={{
                  position: "absolute",
                  // backgroundColor: 'red',
                  width: 10,
                  height: 10,
                  top: 192,
                  left: 463,
                }} ref={box2}></div>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="h6" sx={{ my: 3 }}>
                The graph on the bottom right of the screen shows you the
                average speed growth of the balloons on each trial.
              </Typography>
              <Typography variant="h6" sx={{ my: 3 }}>
                This can help you forecast the value because there is a pattern
                linking speed and value:
              </Typography>
              <Box
                sx={{
                  borderColor: "#d32f2f!important",
                  border: 3,
                  p: 2,
                  borderRadius: "16px",
                }}
                ref={box1}
              >
                <Typography variant="h5">
                  When the speed variable departs from its baseline value (0), this
                  signals that the value is going to shift sometime in the coming
                  trials, i.e., the player enters
                  <Typography color="error.main" fontSize={28}>
                    <b>"the dangerous zone".</b>
                  </Typography>
                </Typography>
              </Box>
            </Grid>
            <Xarrow start={box1} end={box2} color="#d32f2f" curveness={0} />
          </Grid>
          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={6}>
              <Box component="img" alt="" src={danger2} sx={{ width: "100%" }} />
            </Grid>
            <Grid item xs={6} sx={{ pl: 3 }}>
              <Typography variant="h6" sx={{ mb: 5 }} color="error.main">
                The likelihood that the shift takes place increases as time passes
                in the dangerous zone.
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                In this example, you can see that the speed variable departs from
                its baseline value at Trial 6: this is the first trial in the
                dangerous zone. The value hasn’t shifted at Trial 7 (the second
                trial in the dangerous zone); at that stage, the probability that
                the value shifts next trial is about .5.
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                The value has still not shifted at Trial 9 (the 4th trial in the
                dangerous zone); at that stage, the probability that the value
                shifts next trial (at Trial 10) is about .7.
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                You can see the shift occurs at Trial 10: the value switches to +2,
                and the speed indicator reverts to its baseline value.
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={4}>
              <Typography align="center">
                <WarningAmberIcon color="warning" sx={{ fontSize: 256 }} />
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6">
                Sometimes during the game, the value will switch while the speed
                indicator is at its baseline value. This is <b>"an aberration"</b>:
                with certainty (probability 1) the value immediately switches back
                to its current value.
              </Typography>
            </Grid>
          </Grid>

          <Grid container alignItems="center" sx={{ my: 10 }}>
            <Grid item xs={6}>
              <Box component="img" alt="" src={regime} sx={{ width: "100%" }} />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
              <Typography variant="h6" sx={{ my: 5 }}>
                In this example, at Trial 18, the value has switched but the speed
                indicator is at its baseline value. This is an aberration and the
                value immediately switches back to its current value (here, -2) at
                Trial 19.{" "}
              </Typography>
              <Typography variant="h6" sx={{ my: 5 }}>
                In contrast, at Trial 12 a regime shift occurs (after 2 trials in
                the dangerous zone: Trials 10-11).
              </Typography>
            </Grid>
          </Grid>

          <Box textAlign="center" sx={{ my: 10 }}>
            <Button
              component={Link}
              variant="contained"
              size="large"
              to={`/xp/${alias}/instruction2`}
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
