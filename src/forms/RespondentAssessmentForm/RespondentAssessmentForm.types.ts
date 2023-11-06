import { UseFormReturn } from "react-hook-form";

import {
  RespondentAssessmentFormData,
  RespondentSelectedQuestion,
} from "src/pages/RespondentAssessment/RespondentAssessment.types";

export interface RespondentAssessmentFormProps {
  form: UseFormReturn<RespondentAssessmentFormData, any>;
  questions: RespondentSelectedQuestion[];
}
