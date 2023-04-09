import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { extractXpData } from "../../util/xp_data";

const columns = [
  { field: "id", headerName: "Trial #", width: 60 },
  { field: "value", headerName: "Value", width: 60 },
  { field: "speed", headerName: "Speed", width: 60 },
  { field: "aberration", headerName: "Aberration", width: 80 },
  { field: "shift", headerName: "shift", width: 60 },
  { field: "reaction", headerName: "Reaction ms", width: 95 },
  { field: "choice", headerName: "choice", width: 60 },
  {
    field: "outcome",
    headerName: "Outcome$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 80,
  },
  {
    field: "pickedOutcome",
    headerName: "Picked$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 80,
  },
  {
    field: "accumulateOutcome",
    headerName: "Accumulate$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 100,
  },
  { field: 'gender', headerName: 'gender', width: 60 },
  { field: 'age', headerName: 'age', width: 60 },
  { field: 'major', headerName: 'major', width: 100 },
  { field: 'mcq1', headerName: 'mcq1', width: 50 },
  { field: 'mcq2', headerName: 'mcq2', width: 50 },
  { field: 'mcq3', headerName: 'mcq3', width: 50 },
  { field: 'mcq4', headerName: 'mcq4', width: 50 },
  { field: 'mcq5', headerName: 'mcq5', width: 50 },
  { field: 'mcq6', headerName: 'mcq6', width: 50 },
  { field: 'mcq7', headerName: 'mcq7', width: 50 },
  { field: 'mcq8', headerName: 'mcq8', width: 50 },
  { field: 'strategy', headerName: 'strategy', width: 60 },
];

const AttendentDataTable = ({ attendant }) => {
  const rows = extractXpData(attendant);
  const csvOptions = {
    fileName: `${attendant.xp_alias}-${attendant.username}`,
  };
  const CustomToolbar = (props) => (
    <GridToolbarContainer {...props}>
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer {...props}>
        <GridCsvExportMenuItem options={csvOptions} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );

  return (
    <>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        rowHeight={32}
        components={{ Toolbar: CustomToolbar }}
      />
    </>
  );
};

export default AttendentDataTable;
