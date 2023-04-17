import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { doc, writeBatch, collection } from "firebase/firestore";
import db from "../../database/firebase";
import { useEffect, useState } from "react";
import {
    Grid, Typography, IconButton, Button, Tooltip, Divider,
    Dialog, DialogActions, DialogContent, Backdrop, CircularProgress,
    Select, MenuItem, FormControl, InputLabel,
} from "@mui/material";
import { Visibility as VisibilityIcon, Delete as DeleteIcon, Login as LoginIcon, FileDownload } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { generateBalloonData } from '../../util/xp_data'
import { generateXPZip, generatePretaskZip } from '../../util/generate_zip'
import { Link, useParams } from 'react-router-dom';
import AttendantsInfo from './AttendantsInfo';
import { getAttendants, updateAttendant } from '../../database/attendant';
import { getAllDataForXP } from '../../database/data';

const zeroPad = (num, places) => String(num).padStart(places, '0')

const schema = {
    "type": "object",
    "properties": {
        "count": {
            "type": "number",
            "title": "Number of attendants to generate",
            "default": 1,
        },
    },
    required: [
        "count",
    ]
};

const Attendants = ({ xp }) => {
    const { alias } = useParams();
    const [attendants, setAttendants] = useState([]);
    const [datas, setDatas] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loadingOpen, setLoadingOpen] = useState(true);

    const columns = [
        { field: 'username', headerName: 'Username', width: 250 },
        { field: 'password', headerName: 'Password', width: 200 },

        {
            field: 'action', headerName: 'Actions', width: 300,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Data Series</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                defaultValue=""
                                value={params.row.dataId}
                                label="Data Series"
                                onChange={(event) => handleDataSeriesAssign(params.row.id, event.target.value, params.row)}
                            >
                                {datas.map((data, idx) =>
                                    <MenuItem key={idx} value={data.id}>{data.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <Tooltip title="View">
                            <IconButton component={Link} to={`/admin/xp/${params.row.xp_alias}/attendant/${params.row.username}`}><VisibilityIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Quick Login">
                            <IconButton component={Link} to={`/xp/${params.row.xp_alias}/login/${params.row.username}/${params.row.password}`} target="_blank"><LoginIcon /></IconButton>
                        </Tooltip>
                    </>
                )
            },
        },
        {
            field: 'created', headerName: 'Created', width: 160,
            valueFormatter: params => moment(params?.value).format("YYYY-MM-DD HH:mm:ss")
        },
    ];

    const handleDataSeriesAssign = async (attendantId, dataId, attendant) => {
        await updateAttendant(attendantId, {
            dataId
        })
        await fetchAttendants();
        // attendant.dataId = dataId;
        // setAttendants(attendants);
    }

    const fetchAttendants = async () => {
        setLoadingOpen(true);
        const attendants = await getAttendants(alias);
        setAttendants(attendants);
        setLoadingOpen(false);
    };

    const fetchDatas = async () => {
        setDatas(await getAllDataForXP(alias));
    };

    const onCreateAttendants = async ({ formData }, e) => {
        e.preventDefault();
        if (formData.count <= 0) {
            return;
        }

        const batch = writeBatch(db);
        let maxGuestIndex = 0;
        attendants.forEach((att, i) => {
            const index = parseInt(att.username.replace('guest', '')) || 0;
            maxGuestIndex = Math.max(maxGuestIndex, index, attendants.length);
        });

        for (let i = 0; i < formData.count; i++) {
            const data = generateBalloonData(xp);

            const attendant = Object.assign({}, data, {
                username: `guest${zeroPad(maxGuestIndex + i + 1, 2)}`,
                password: Math.random().toString(36).slice(-6),
                created: Date.now(),
                xp_alias: xp.alias,
                xp_id: xp.id,
                xpConfig: xp,
            });
            const ref = doc(collection(db, "attendant"));
            batch.set(ref, attendant);
        }
        await batch.commit();
        await fetchAttendants();
    };

    const onDeleteAttdendants = async (e) => {
        e.preventDefault();
        if (!window.confirm("Are you sure to delete?")) {
            return;
        }

        const batch = writeBatch(db);
        for (let i = 0; i < selectionModel.length; i++) {
            const ref = doc(db, "attendant", selectionModel[i]);
            batch.delete(ref);
        }
        await batch.commit();
        await fetchAttendants();
    };

    const onDownloadZip = async (e) => {
        setLoadingOpen(true);
        await generateXPZip(attendants, xp);
        setLoadingOpen(false);
    }

    const onDownloadPretaskZip = async (e) => {
        setLoadingOpen(true);
        await generatePretaskZip(attendants, xp);
        setLoadingOpen(false);
    }

    useEffect(() => {
        fetchAttendants();
        fetchDatas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <DataGrid autoHeight rows={attendants} columns={columns}
                        checkboxSelection
                        disableSelectionOnClick
                        onSelectionModelChange={m => setSelectionModel(m)}
                        sx={{ mb: 3 }}
                        initialState={{
                            sorting:
                            {
                                sortModel: [{
                                    field: 'created'
                                }]
                            }
                        }} />

                    <Button variant="contained" sx={{ mx: 3 }} disabled={!selectionModel.length} onClick={onDeleteAttdendants}><DeleteIcon /> Delete</Button>
                </Grid>
                <Grid item xs={3}>
                    <Typography>Add more attendants</Typography>
                    <Form schema={schema} onSubmit={onCreateAttendants} validator={validator} />

                    <Divider sx={{ my: 5 }} />
                    <Button variant="outlined" sx={{ my: 1, width: '100%' }} onClick={() => setDialogOpen(true)}><VisibilityIcon sx={{ mx: 1 }} /> View mcq Responses</Button>
                    <Button variant="outlined" sx={{ my: 1, width: '100%' }} onClick={onDownloadZip}><FileDownload sx={{ mx: 1 }} /> Download Main XP zip</Button>
                    <Button variant="outlined" sx={{ my: 1, width: '100%' }} onClick={onDownloadPretaskZip}><FileDownload sx={{ mx: 1 }} /> Download Pretask zip</Button>
                </Grid>
            </Grid>

            <Dialog maxWidth="lg" fullWidth={true} open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent>
                    <AttendantsInfo attendants={attendants} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>


        </>
    )
}

export default Attendants