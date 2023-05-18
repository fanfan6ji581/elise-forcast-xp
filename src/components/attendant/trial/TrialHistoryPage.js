import * as _ from "lodash";
import TrainingTimer from './TrainingTimer';
import { loginAttendant } from "../../../slices/attendantSlice";
import { xpConfigS } from "../../../slices/gameSlice";
import { useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { doc, updateDoc } from "firebase/firestore";
// import db from "../../../database/firebase";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { historyIndex, setHistoryIndex } from "../../../slices/gameSlice";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
);

const TrialHistoryPage = () => {
    const dispatch = useDispatch();
    const historyIndexS = useSelector(historyIndex);
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);
    const xpConfig = useSelector(xpConfigS);
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    let data1 = {};
    let data2 = {};

    const onKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            navigate(`/xp/${alias}/strategy`);
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown, false);

        return () => {
            document.removeEventListener("keydown", onKeyDown, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
    }, [xpConfig])

    const { asset, volume } = loginAttendantS.xpData;
    let balloonValues = _.slice(asset, 0 + historyIndexS, historyIndexS !== 49 ? 50 : 51 + historyIndexS);
    let balloonSpeed = _.slice(volume, 0 + historyIndexS, historyIndexS !== 49 ? 50 : 51 + historyIndexS);

    let labels = Array.from({ length: balloonValues.length }, (_, i) => `${i + historyIndexS + 1}`);
    data1 = {
        labels: labels,
        datasets: [
            {
                label: 'Asset history',
                data: balloonValues,
                backgroundColor: 'rgb(14,133,255)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Volume history',
                data: balloonSpeed,
                backgroundColor: 'rgb(141,168,181)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    const options = {
        aspectRatio: 4,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    beginAtZero: true,
                    // major: true,
                    callback: function (value, index, values) {
                        if (value === 2) {
                            return 'High';
                        } else if (value === -2) {
                            return 'Low';
                        }
                        return '';
                    },
                    font: {
                        size: 16,
                    },
                    min: 2,
                    max: 2,
                },
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12,
                    },
                },
                type: 'category',
                offset: true,
                maxBarThickness: 100,
            }
        },
        responsive: true,
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 16
                    }
                }
            },
            // interaction: {
            //     mode: 'index',
            //     intersect: false,
            //     axis: 'x',
            //     pan: {
            //         enabled: true,
            //         mode: 'x',
            //     },
            //     zoom: {
            //         enabled: false,
            //     },
            // },
            // zoom: {
            //     zoom: {
            //         wheel: {
            //             // enabled: true
            //         },
            //         // pinch: {
            //         //     enabled: true // Enable zooming using pinch gestures
            //         // },
            //         // drag: {
            //         //     enabled: true
            //         // },
            //         enabled: false,
            //         mode: 'x',
            //     },
            //     pan: {
            //         enabled: true,
            //         mode: 'x',
            //         threshold: 20,
            //     },
            // }
        },
    };

    const options2 = {
        aspectRatio: 4,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                display: false,
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 14,
                    },
                },
                suggestedMax: _.max(_.slice(volume, 0, 100)),
                suggestedMin: _.min(_.slice(volume, 0, 100)),
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12,
                    },
                    maxTicksLimit: 50,
                    minTicksLimit: 50,
                },
            }
        },
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 16
                    }
                }
            }
        }
    };

    // const reset = () => {
    //     chart1Ref.current.resetZoom();
    //     chart2Ref.current.resetZoom();
    // }

    const show1st50 = () => {
        dispatch(setHistoryIndex(0));
    }

    const show2nd50 = () => {
        dispatch(setHistoryIndex(49));
    }

    const onFinish = async () => {
        // console.log('onFinish')
        navigate(`/xp/${alias}/strategy`)
    }

    const timer = useMemo(() => {
        return <TrainingTimer trainingSessionSeconds={xpConfig.historySessionSeconds} onFinish={onFinish} text={"Time left"} />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xpConfig]);

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Trial History
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Box>
                        <Line data={data1} options={options} ref={chart1Ref} />
                    </Box>
                    <Box sx={{ mt: 12 }}>
                        <Line style={{ paddingLeft: '25px' }} data={data2} options={options2} ref={chart2Ref} />
                    </Box>

                    <Grid container alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
                        <Grid item>
                            <Button variant='outlined' onClick={show1st50} sx={{ width: 180 }} disabled={historyIndexS === 0}>Trial #1 - #50</Button>
                        </Grid>
                        <Grid item>
                            <Button variant='outlined' onClick={show2nd50} sx={{ width: 180, ml: 1 }} disabled={historyIndexS === 49}>Trial #50 - #100</Button>
                        </Grid>
                    </Grid>

                    {xpConfig.historySessionSeconds &&
                        timer
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default TrialHistoryPage