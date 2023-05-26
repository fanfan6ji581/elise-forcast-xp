import {
    DataGrid, GridToolbarDensitySelector,
    GridToolbarContainer, GridToolbarExportContainer, GridCsvExportMenuItem
} from '@mui/x-data-grid';
import { calcuateCorrectness } from '../../util/xp_data';
import { useParams } from 'react-router-dom';

const columns = [
    { field: 'username', headerName: 'Email', width: 200 },
    { field: 'gender', headerName: 'gender', width: 80 },
    { field: 'age', headerName: 'age', width: 80 },
    { field: 'major', headerName: 'major', width: 150 },
    { field: 'mcq1', headerName: 'mcq1', width: 50 },
    { field: 'mcq2', headerName: 'mcq2', width: 50 },
    { field: 'mcq3', headerName: 'mcq3', width: 50 },
    { field: 'mcq4', headerName: 'mcq4', width: 50 },
    { field: 'mcq5', headerName: 'mcq5', width: 50 },
    { field: 'mcq6', headerName: 'mcq6', width: 50 },
    { field: 'mcq7', headerName: 'mcq7', width: 50 },
    { field: 'mcq8', headerName: 'mcq8', width: 50 },
    { field: 'mcq9', headerName: 'mcq9', width: 50 },
    { field: 'mcq10', headerName: 'mcq10', width: 60 },
    { field: 'mcq11', headerName: 'mcq11', width: 60 },
    { field: 'mcq12', headerName: 'mcq12', width: 60 },
    { field: 'strategy', headerName: 'strategy', width: 80 },
    { field: 'strategy2', headerName: 'strategy2', width: 80 },
];

const AttendentsInfo = ({ attendants, xp }) => {
    const { alias } = useParams();
    const rows = attendants.map(attendant => Object.assign({
        id: attendant.id,
        username: attendant.username,
        age: attendant.age,
        gender: attendant.gender,
        major: attendant.major,
    }, calcuateCorrectness(attendant, xp), { 
        strategy: attendant.strategy,
        strategy2: attendant.strategy2,
     }));

    if (xp.treatment === 2) {
        columns.splice(13, 2);
    } else if (xp.treatment === 1) {
        columns.splice(12, 3);
    }

    const csvOptions = { fileName: `${alias}-attendant-choices` };
    const CustomToolbar = (props) => (
        <GridToolbarContainer {...props}>
            <GridToolbarDensitySelector />
            <GridToolbarExportContainer {...props}>
                <GridCsvExportMenuItem options={csvOptions} />
            </GridToolbarExportContainer>
        </GridToolbarContainer>
    );

    return (
        <DataGrid autoHeight rows={rows} columns={columns}
            components={{ Toolbar: CustomToolbar }}
            initialState={{
                sorting:
                {
                    sortModel: [{
                        field: 'username'
                    }]
                }
            }} />
    )
}

export default AttendentsInfo