import * as _ from "lodash";
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
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { trialIndex, showMoneyOutcome } from "../../../slices/gameSlice";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ValueChart({ xpData }) {
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const trialIndexS = useSelector(trialIndex);
    const { balloonValues, balloonSpeed } = xpData;

    let labels = Array.from({ length: trialIndexS + (showMoneyOutcomeS ? 2 : 1) }, (_, i) => i + 1);
    let lengthLimit = 50;
    if (showMoneyOutcomeS) {
        lengthLimit++;
    }
    if (labels.length > lengthLimit) {
        labels = labels.slice(-lengthLimit);
    }
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Value history',
                data: balloonValues && _.slice(balloonValues, labels[0], labels.length + labels[0]),
                backgroundColor: 'rgb(14,133,255)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    const data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Speed history',
                data: balloonSpeed && _.slice(balloonSpeed, labels[0], labels.length + labels[0]),
                backgroundColor: 'rgb(141,168,181)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    const options = {
        aspectRatio: 3.5,
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
                        if (value === 2 || value === -2) return '$' + value
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
                    font: {
                        size: 16,
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

    const options2 = {
        aspectRatio: 3.5,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                display: false,
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 16,
                    },
                },
                suggestedMax: 20
            },
            x: {
                ticks: {
                    font: {
                        size: 16,
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
    return (
        <>
            <Box>
                <Line data={data} options={options} />
            </Box>
            <Box sx={{ mt: 12 }}>
                <Line style={{ paddingLeft: '25px' }} data={data2} options={options2} />
            </Box>
        </>
    );
}