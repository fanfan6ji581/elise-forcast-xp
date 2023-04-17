import * as _ from "lodash";
import TrainingTimer from './TrainingTimer';
import { loginAttendant } from "../../../slices/attendantSlice";
import { xpConfigS } from "../../../slices/gameSlice";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);
    const xpConfig = useSelector(xpConfigS);
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);

    const onKeyDown = (e) => {
        if (e.key === ' ') {
            navigate(`/xp/${alias}/instruction-ready`);
        }
    }

    const onFinish = async () => {
        // console.log('onFinish')
        navigate(`/xp/${alias}/count-down`)
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
    const balloonValues = _.slice(asset, 0, 100);
    const balloonSpeed = _.slice(volume, 0, 100);


    let labels = Array.from({ length: balloonValues.length }, (_, i) => i + 1);
    const data = {
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

    const data2 = {
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
                    major: true,
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
                },
                suggestedMax: 2,
                suggestedMin: -2
            },
            x: {
                ticks: {
                    autoSkip: true,
                    font: {
                        size: 12,
                    },
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
            },
            zoom: {
                // zoom: {
                //     wheel: {
                //         enabled: true
                //     },
                //     // drag: {
                //     //     enabled: true
                //     // },
                //     enabled: true,
                //     mode: 'x',
                // },
                // pan: {
                //     enabled: true,
                //     mode: 'x',
                //     threshold: 200
                // },
            }
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
                suggestedMax: _.max(balloonSpeed),
                suggestedMin: _.min(balloonSpeed),
            },
            x: {
                ticks: {
                    autoSkip: true,
                    font: {
                        size: 12,
                    },
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


    const reset = () => {
        chart1Ref.current.resetZoom();
        chart2Ref.current.resetZoom();
    }

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
                        <Line data={data} options={options} ref={chart1Ref} />
                    </Box>
                    <Box sx={{ mt: 12 }}>
                        <Line style={{ paddingLeft: '25px' }} data={data2} options={options2} ref={chart2Ref} />
                    </Box>

                    {false &&
                        <Button variant='outlined' onClick={reset}>Reset zoom</Button>
                    }
                    {xpConfig.historySessionSeconds &&
                        <TrainingTimer trainingSessionSeconds={xpConfig.historySessionSeconds} onFinish={onFinish} text={"Time left"} />
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default TrialHistoryPage