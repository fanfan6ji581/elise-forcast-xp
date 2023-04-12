import { Container, Box, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { loginAttendant } from "../../../slices/attendantSlice";
import {
  trialIndex,
  onLogin,
  choiceHistory,
  outcomeHistory,
  missHistory,
  reactionHistory,
  onLoginTraining,
  reset,
  xpConfigS,
  xpDataS,
} from "../../../slices/gameSlice";
import { login } from "../../../slices/attendantSlice";
import { useDispatch, useSelector } from "react-redux";
import TrialTimerProgress from "./TrialTimerProgress";
import Choice from "./Choice";
import MoneyOutcome from "./MoneyOutcome";
import ValueChart from "./ValueChart";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../database/firebase";
import { useNavigate, useParams } from "react-router-dom"

const BalloonTrial = ({ isTrainingMode, onFinish }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alias } = useParams()
  const loginAttendantS = useSelector(loginAttendant);
  const trialIndexS = useSelector(trialIndex);
  const choiceHistoryS = useSelector(choiceHistory);
  const outcomeHistoryS = useSelector(outcomeHistory);
  const missHistoryS = useSelector(missHistory);
  const reactionHistoryS = useSelector(reactionHistory);
  const xpData = useSelector(xpDataS);
  const xpConfig = useSelector(xpConfigS);

  const storeToDB = async () => {
    // do nothing in training mode
    if (isTrainingMode) {
      return;
    }
    const attendantRef = doc(db, "attendant", loginAttendantS.id);
    const xpRecord = {
      trialIndex: trialIndexS,
      choiceHistory: choiceHistoryS,
      outcomeHistory: outcomeHistoryS,
      missHistory: missHistoryS,
      reactionHistory: reactionHistoryS,
    };
    await updateDoc(attendantRef, { xpRecord });
    // store into local storage as well
    dispatch(login(Object.assign({}, loginAttendantS, { xpRecord })));
  };

  useEffect(() => {
    // fetch Login attdendant detail every time
    if (isTrainingMode) {
      dispatch(onLoginTraining(loginAttendantS));
    } else {
      dispatch(onLogin(loginAttendantS));
    }

    return () => {
      // reset game data
      dispatch(reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // store user click into database
    if (
      choiceHistoryS[trialIndexS] ||
      outcomeHistoryS[trialIndexS] ||
      missHistoryS[trialIndexS] ||
      reactionHistoryS[trialIndexS]
    ) {
      if (!isTrainingMode) {
        storeToDB();
      }

      if (missHistoryS &&
        missHistoryS.filter(x => x).length >= xpConfig.missLimit) {
        if (isTrainingMode) {
          navigate(`/xp/${alias}/quiz`);
        } else {
          navigate(`/xp/${alias}/payment`);
        }
      }
    }

    if (trialIndexS >= xpConfig.numberOfTrials) {
      onFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trialIndexS,
    choiceHistoryS,
    outcomeHistoryS,
    missHistoryS,
    reactionHistoryS,
    xpConfig,
  ]);

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h5" align="center" sx={{ mt: 2, mb: 1 }}>
            {isTrainingMode && <>Training</>} Trial: {trialIndexS + 1}/
            {xpConfig.numberOfTrials}
          </Typography>
          <TrialTimerProgress />
          <Grid container>
            <Grid item xs={12}>
              <Box sx={{ height: 64, my: 1 }}>
                <MoneyOutcome xpData={xpData} xpConfig={xpConfig} />
              </Box>
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Grid item xs={12}>
              <ValueChart xpData={xpData} />
            </Grid>
            <Grid item xs={12}>
              <Choice xpData={xpData} xpConfig={xpConfig} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BalloonTrial;
