import { UseFormReturn } from "react-hook-form";

export interface RespondentAssessmentFormData {
  [key: string]: string[];
}

export interface RespondentSelectedQuestion extends RespondentQuestion {
  question_number?: number;
}

export interface RenderProgrammingQuestionsProps {
  programmingQuestions: RespondentQuestion[];
  setSelectedQuestion: (question: RespondentSelectedQuestion) => void;
  selectedQuestion: RespondentSelectedQuestion | null;
  form: UseFormReturn<RespondentAssessmentFormData, any>;
  isCaseStudySelected: boolean;
  setIsCaseStudySelected: (isCaseStudySelected: boolean) => void;
}

export interface RenderMCQQuestionsProps {
  mcqs: RespondentQuestion[];
  programmingQuestions: RespondentQuestion[];
  setSelectedQuestion: (question: RespondentSelectedQuestion) => void;
  selectedQuestion: RespondentSelectedQuestion | null;
  form: UseFormReturn<RespondentAssessmentFormData, any>;
  isCaseStudySelected: boolean;
  setIsCaseStudySelected: (isCaseStudySelected: boolean) => void;
}

export interface RenderFullCaseStudyBaseQuestionProps {
  base_question: string;
}

export interface RenderHalfCaseStudyBaseQuestionProps {
  base_question: string;
  isCaseStudySelected: boolean;
  setIsCaseStudySelected: (isCaseStudySelected: boolean) => void;
}
