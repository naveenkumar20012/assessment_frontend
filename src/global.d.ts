interface ConstructedObject {
  [key: string]: unknown;
}

interface ConstructedObjectAny {
  [key: string]: any;
}

interface ExtractedCSVData {
  name: string;
  email: string;
}

type Platform = "pyjamahr" | "hackergenius";

interface Credits {
  available: number;
  total: number;
  used: number;
}

interface Matrix {
  duration: number;
  points: number;
  question_type: string;
  uuid: string;
  difficulty: Difficulty;
}

interface Company {
  uuid: string;
  name: string;
  logo: string;
  primary_color: string;
  credits: Credits;
  matrix: Matrix[];
}

interface User {
  name: string;
  email: string;
  company: Company;
}

interface InitialUserData {
  token: string;
  user: User;
}

interface PaginatedResult {
  count: number;
  next: string;
  previous: string;
  results: Array<ConstructedObject>;
}

interface Props {
  children: React.ReactNode;
}

type AssessmetType = "TECHNICAL" | "NON_TECHNICAL" | "UNIFIED" | "";

type QuestionType = "MCQ" | "PROGRAM" | "OPEN_ENDED";

interface Skill {
  uuid: string;
  name: string;
  skill_type: AssessmetType;
  is_visible: boolean;
  temporary?: boolean;
  actualValue?: string;
}

interface Difficulty {
  uuid: string;
  name: string;
}

interface Assessment {
  uuid: string;
  name: string;
  creator: string;
  invites: number;
  taken: number;
  is_generating: boolean;
  duration: number;
  created_at: string;
  pending: number;
  expired: number;
  config: { [key: string]: { [key: string]: number } };
  is_tab_switches_enabled: boolean;
  is_fullscreen_exits_enabled: boolean;
  is_shuffling_enabled: boolean;
  is_proctoring_enabled: boolean;
  restricted_languages?: string[];
}

interface Invite {
  uuid: string;
  email: string;
  test: string;
  created_at: string;
  is_started: string;
  started_at: string;
  is_submitted: string;
  submitted_at: string;
  is_revoked: string;
  revoked_by: string;
  revoked_at: string;
  invited_by: string;
  score: number;
  is_evaluating: boolean;
  evaluated_at: string;
  status: string;
  duration: string;
  candidate: string;
  duration: number;
  [key: string]: string;
}

interface RespondentBasicDetails {
  uuid: string;
  is_started: boolean;
  is_submitted: boolean;
  is_revoked: boolean;
  is_expired: boolean;
  email: string;
  assessment_name: string;
  assessment_type: AssessmetType;
  logo: string;
  primary_color: string;
  company_name: string;
  questions: number;
  name: string;
  assessment_duration: number;
  is_ats: boolean;
  ats_company_name?: string;
  is_tab_switches_enabled: boolean;
  is_fullscreen_exits_enabled: boolean;
  is_shuffling_enabled: boolean;
  is_proctoring_enabled: boolean;
  restricted_languages?: string[];
}

interface Option {
  uuid: string;
  body: string;
  is_correct: boolean;
}

interface Question {
  uuid: string;
  body: string;
  question_type: string;
  skill: Skill;
  difficulty: Difficulty;
  question_type: QuestionType;
  options: Option[];
  points: number;
}

interface AssessmentQuestions {
  assessment_type: AssessmetType;
  base_question: string;
  uuid: string;
  questions: Question[];
}

interface RespondentOption {
  uuid: string;
  body: string;
}

interface RespondentQuestion {
  uuid: string;
  body: string;
  skill: Skill;
  options: QuestionOption[];
  is_multi: boolean;
  question_type: QuestionType;
}

interface RespondentAssessment {
  assessment_type: AssessmetType;
  base_question: string;
  questions: RespondentQuestion[];
}

interface RespondentData {
  assessment: RespondentAssessment | null;
}

interface ExecutionResult {
  uuid: string;
  status: "PROCESSING" | "PROCESSED" | "FAILED";
  code: string;
  language: number;
  result: any;
  identifier: string;
}

interface Transaction {
  uuid: string;
  transaction_type: string;
  credits: number;
  invites: string[];
  transacted_by?: string;
}

interface InternalLogin {
  user: User;
  token: string;
}
