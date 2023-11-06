export interface InviteTableProps {
  assessmentID: string;
  search: string;
  scoreRange: number[];
  assessment: Assessment;
}

export interface Column {
  id: string;
  label: string;
  format?: (value: any) => string | number | React.ReactNode;
  align?: string;
}

export interface CellComponentProps {
  column: Column;
  value?: any;
  handleClick: (event: any) => void;
  uuid: any;
}

export interface CustomMenuProps {
  uuid: string;
  data: Invite;
}
