import { Divider, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/system/Unstable_Grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAPI } from "src/utils/hooks";
import { TRANSACTIONS_URL } from "src/utils/urls";

const columns: GridColDef[] = [
  { field: "uuid", headerName: "ID", width: 150 },
  {
    field: "transaction_type",
    headerName: "Transaction Type",
    width: 150,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value}>
          <Typography noWrap>
            {params.value === "SUBTRACTION" ? "Debit" : "Credit"}
          </Typography>
        </Tooltip>
      );
    },
  },
  { field: "credits", headerName: "Credits", width: 100 },
  {
    field: "transacted_by",
    headerName: "Transacted By",
    width: 200,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value}>
          <Typography noWrap>{params.value}</Typography>
        </Tooltip>
      );
    },
  },
  {
    field: "invites",
    headerName: "Invites",
    renderCell: (params) => {
      const data = (params.value as string[]).join(", ");
      return (
        <Tooltip title={data}>
          <Typography noWrap>{data}</Typography>
        </Tooltip>
      );
    },
    flex: 1,
  },
];

const TransactionTable = () => {
  const { data, loading } = useAPI<Transaction[]>(TRANSACTIONS_URL);
  return (
    <Box padding="20px" width="100%" height="100%">
      <Grid container spacing={3} width="100%" height="100%">
        <Grid xs={12}>
          <Typography fontWeight={500} fontSize={18}>
            Transactions
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Grid>
        <Grid xs={12} height="calc(100% - 70px)" width="100%">
          <DataGrid
            rows={data || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 15]}
            disableRowSelectionOnClick
            getRowId={(row) => row.uuid}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionTable;
