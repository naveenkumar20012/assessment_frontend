import { Dayjs } from "dayjs";

export interface InviteFormProps {
  onClose: () => void;
  assessmentID: string;
  callback: (count: number) => void;
}

export interface InviteFormData {
  assessment: string;
  expiry: Dayjs;
  candidates: Array<{ name: string; email: string }>;
  bulkCandidates: string;
}

export interface InviteEmail {
  email: string;
  is_revoked: boolean;
}

export interface AssessmentInvites {
  invites: InviteEmail[];
}

export type ImportType = "regular" | "bulk";
