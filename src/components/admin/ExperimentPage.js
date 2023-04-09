import {
    Container, Grid, Alert, Typography, Box, Tab,
    FormGroup, FormControlLabel, Switch, Button
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import db from "../../database/firebase";
import { updatePretask } from "../../database/pretask";
import { getPretask } from "../../database/pretask"
import BalloonXPConfig from './BalloonXPConfig';
import PretaskConfig from './PretaskConfig';
import Attendants from './Attendants';
import { Link } from 'react-router-dom';

const Experiment = () => {
    const [tab, setTab] = useState('3');
    const [xp, setXp] = useState(null);
    const [pretask, setPretask] = useState(null);
    const [enablePlaying, setEnablePlaying] = useState(false);
    const [enablePretaskPlaying, setEnablePretaskPlaying] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { alias } = useParams()

    const onChangeTab = (e, newValue) => {
        setTab(newValue);
    };

    const fetchXP = async () => {
        const snapshot = await getDocs(query(collection(db, "xp"), where("alias", "==", alias)));
        const xps = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
        if (xps.length === 1) {
            setXp(xps[0]);
            setEnablePlaying(xps[0].enablePlaying);
        } else {
            setErrorMsg(`Cannot find such XP with alias "${alias}"`)
        }
    };

    const fetchPretask = async () => {
        try {
            const pretask = await getPretask(alias);
            setPretask(pretask)
            setEnablePretaskPlaying(pretask.enablePretaskPlaying);
        } catch (error) {
            setErrorMsg(error.message)
        }
    }

    const onSwitchEnablePlaying = async (e, val) => {
        const xpRef = doc(db, "xp", xp.id);
        await updateDoc(xpRef, { enablePlaying: val });
        setEnablePlaying(val);
        if (val) {
            window.alert('Game play has been enabled');
        } else {
            window.alert('Game play has been disabled');
        }
    }

    const onSwitchEnablePretaskPlaying = async (e, val) => {
        await updatePretask(pretask.id, { enablePretaskPlaying: val });
        setEnablePretaskPlaying(val);
        if (val) {
            window.alert('Pretask play has been enabled');
        } else {
            window.alert('Pretask play has been disabled');
        }
    }

    useEffect(() => {
        fetchXP();
        fetchPretask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="space-between">
                <Grid item>
                    <Typography variant='h4'>Experiment <b>{alias}</b>
                        <Button sx={{ ml: 3 }} variant="outlined" component={Link} to={`/xp/${alias}/signup`} target="_blank"> Attendant Sign up</Button>
                        <Button sx={{ mx: 1 }} variant="outlined" component={Link} to={`/xp/${alias}/login`} target="_blank"> Attendant Login</Button>
                    </Typography>
                </Grid>
                <Grid item>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={enablePlaying} onChange={onSwitchEnablePlaying} />} label="Enable game play" />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={enablePretaskPlaying} onChange={onSwitchEnablePretaskPlaying} />} label="Enable pretask play" />
                    </FormGroup>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    {xp &&
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={tab}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={onChangeTab} aria-label="lab API tabs example">
                                        <Tab label="Pretask Config" value="1" />
                                        <Tab label="XP Config" value="2" />
                                        <Tab label="Attendants" value="3" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <PretaskConfig pretask={pretask} setPretask={setPretask} />
                                </TabPanel>
                                <TabPanel value="2">
                                    <BalloonXPConfig xp={xp} setXp={setXp} />
                                </TabPanel>
                                <TabPanel value="3">
                                    <Attendants xp={xp} />
                                </TabPanel>
                            </TabContext>
                        </Box>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default Experiment