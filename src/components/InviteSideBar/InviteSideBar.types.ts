export interface InviteSideBarProps {
  setSearch: (value: string) => void;
  scoreRange: number[];
  search: string;
  handleChangeScore: (event: Event, newValue: number | number[]) => void;
}
