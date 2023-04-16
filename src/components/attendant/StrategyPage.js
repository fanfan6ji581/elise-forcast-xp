import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { loginAttendant } from "../../slices/attendantSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import db from "../../database/firebase";
import { useEffect, useState } from "react";

const StrategyPage = () => {
  const { alias } = useParams();
  const navigate = useNavigate();
  const loginAttendantS = useSelector(loginAttendant);
  const [strategy, setStrategy] = useState();
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
    setStrategy(attendant.strategy);
    setLoadingOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoadingOpen(true);
    // if not being set before
    if (!attendant.strategy) {
      const attendantRef = doc(db, "attendant", loginAttendantS.id);
      await updateDoc(attendantRef, { strategy });
    }
    navigate(`/xp/${alias}/count-down`);
  };

  useEffect(() => {
    fetchAttdendant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Have you devised a strategy on how to play the game, and if you have,
        how confident are you that it's gonna work?
      </Typography>

      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h5" align="center" sx={{ my: 5 }}>
            <b>I don't have a strategy</b>
          </Typography>
          <Box textAlign="center">
            <FormControlLabel
              control={
                <Radio
                  value="1"
                  disabled={attendant && attendant.strategy > 0}
                  checked={strategy === 1}
                  onChange={() => setStrategy(1)}
                />
              }
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" align="center" sx={{ my: 5 }}>
            <b>I do have a strategy</b>
          </Typography>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="2"
                  checked={strategy === 2}
                  disabled={attendant && attendant.strategy > 0}
                  onChange={() => setStrategy(2)}
                />
                <Typography varient="body2">
                  I'm not quite sure about it
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="3"
                  checked={strategy === 3}
                  disabled={attendant && attendant.strategy > 0}
                  onChange={() => setStrategy(3)}
                />
                <Typography varient="body2">
                  I feel fairly confident about it
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Box textAlign="center">
                <Radio
                  value="4"
                  checked={strategy === 4}
                  disabled={attendant && attendant.strategy > 0}
                  onChange={() => setStrategy(4)}
                />
                <Typography varient="body2">
                  I'm really think it's right
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ my: 8 }}>
        <Button
          disabled={!strategy}
          variant="contained"
          size="large"
          onClick={onSubmit}
        >
          Start
        </Button>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={() => setLoadingOpen(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default StrategyPage;
