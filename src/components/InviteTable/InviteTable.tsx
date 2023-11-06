import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  downoadReport,
  downoadSessionImages,
  revokeInvite,
} from "src/calls/assessments";
import { handleError, localDateTime } from "src/utils/common";
import { urlFormatter } from "src/utils/formatters";
import { useAPI } from "src/utils/hooks";
import { DownloadReportIcon, MenuIcon } from "src/utils/svgs";
import { INVITE_URL } from "src/utils/urls";

import SmallLoader from "../Loader/SmallLoader";
import { CustomMenuProps, InviteTableProps } from "./InviteTable.types";

const CustomMenu: React.FC<CustomMenuProps> = (props) => {
  const { uuid, data } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            navigator.clipboard.writeText(
              `${import.meta.env.VITE_APP_URL}/invite/${uuid}`
            );
            handleClose();
          }}
          disabled={data.status !== "Invited"}
        >
          Copy assessment link
        </MenuItem>
        <MenuItem
          onClick={() => {
            revokeInvite(uuid)
              .then(() => {
                toast.success("Invite revoked");
                handleClose();
              })
              .catch((err) => handleError(err));
          }}
          disabled={data.status !== "Invited" && data.status !== "Expired"}
        >
          Revoke invite
        </MenuItem>
      </Menu>
    </>
  );
};

const getColor = (value: string) => {
  if (value === "Revoked" || value === "Expired") {
    return "error";
  }
  if (value === "Evaluating") {
    return "warning";
  }
  if (value === "Submitted") {
    return "success";
  }
  if (value === "Started") {
    return "secondary";
  }
  return "primary";
};

const InviteTable: React.FC<InviteTableProps> = (props) => {
  const { assessmentID, search, scoreRange } = props;
  const [downloading, setDownloading] = useState<string | null>(null);
  const formattedURL = urlFormatter(
    INVITE_URL,
    `assessment__uuid=${assessmentID}`
  );
  const { data, loading } = useAPI<Invite[]>(formattedURL);
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        width: 260,
      },
      { field: "email", headerName: "Email", width: 260 },
      {
        field: "created_at",
        headerName: "Invited At",
        renderCell: (params) => (
          <Typography>{localDateTime(params.value)}</Typography>
        ),
        width: 240,
      },
      {
        field: "expiry",
        headerName: "Expiry",
        renderCell: (params) => (
          <Typography>
            {params.value ? localDateTime(params.value) : ""}
          </Typography>
        ),
        width: 240,
      },
      {
        field: "score",
        headerName: "Score (%)",
        renderCell: (params) => (
          <Typography>
            {params.value !== null ? `${params.value} %` : ""}
          </Typography>
        ),
      },
      {
        field: "duration",
        headerName: "Duration",
        renderCell: (params) => (
          <Typography>
            {params.value !== null
              ? `${Math.min(params.value, props.assessment.duration)} Mins`
              : ""}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color={getColor(params.value)}
            variant="outlined"
          />
        ),
      },
      {
        field: "report",
        headerName: "Report",
        renderCell: (params) => {
          return (
            <Button disabled={params.row.status !== "Submitted"}>
              {downloading === params.id ? (
                <SmallLoader />
              ) : (
                <DownloadReportIcon
                  fill={params.row.status === "Submitted" ? "" : "#9e9e9e"}
                />
              )}
            </Button>
          );
        },
        align: "center",
      },
      {
        field: "session_images",
        headerName: "Images",
        renderCell: (params) => {
          return (
            <Button disabled={params.row.status !== "Submitted"}>
              {downloading === params.id ? (
                <SmallLoader />
              ) : (
                <DownloadReportIcon
                  fill={params.row.status === "Submitted" ? "" : "#9e9e9e"}
                />
              )}
            </Button>
          );
        },
        align: "center",
      },
      {
        field: "actions",
        headerName: "",
        renderCell: (params) => (
          <CustomMenu uuid={`${params.id}`} data={params.row} />
        ),
        align: "center",
        disableReorder: true,
        disableColumnMenu: true,
      },
    ],
    [downloading]
  );
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "100%",
      }}
      elevation={0}
      variant="elevation"
    >
      <DataGrid
        rows={
          data
            ?.slice()
            ?.sort((a, b) => b.score - a.score)
            .filter(
              (invite) =>
                invite.score >= scoreRange[0] && invite.score <= scoreRange[1]
            )
            .filter(
              (invite) =>
                invite.email.toLowerCase().includes(search.toLowerCase()) ||
                invite.name.toLowerCase().includes(search.toLowerCase())
            ) || []
        }
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
        onCellClick={(params, _) => {
          if (params.field === "report") {
            const inviteUUID = params.id;
            setDownloading(`${inviteUUID}`);
            downoadReport(`${inviteUUID}`).finally(() => setDownloading(null));
          }
          if (params.field === "session_images") {
            const inviteUUID = params.id;
            setDownloading(`${inviteUUID}`);
            downoadSessionImages(`${inviteUUID}`).finally(() =>
              setDownloading(null)
            );
          }
        }}
      />
    </Paper>
  );
};

export default InviteTable;
