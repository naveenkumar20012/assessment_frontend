export interface NonTechnicalAssessmentsFormProps {
  onClose: () => void;
}

export interface NonTechnicalAssessmentsFormData {
  name: string;
  skills: Skill[];
  difficulty: string;
  industry: string;
  duration: number;
  is_tab_switches_enabled: boolean;
  is_fullscreen_exits_enabled: boolean;
  is_shuffling_enabled: boolean;
  is_proctoring_enabled: boolean;
}

export interface QuestionFormData {
  uuid: string;
  base_question: string;
  questions: { uuid: string; body: string }[];
}
