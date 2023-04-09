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
    { field: 'strategy', headerName: 'strategy', width: 70 },
];

const AttendentsInfo = ({ attendants }) => {
    const { alias } = useParams();
    const rows = attendants.map(attendant => Object.assign({
        id: attendant.id,
        username: attendant.username,
        age: attendant.age,
        gender: attendant.gender,
        major: attendant.major,
    }, calcuateCorrectness(attendant), { strategy: attendant.strategy }));

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