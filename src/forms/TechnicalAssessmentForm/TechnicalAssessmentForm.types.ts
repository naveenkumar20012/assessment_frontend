import { UseFormReturn } from "react-hook-form";

export interface AssessmentFormProps {
  onClose: () => void;
}

export type Experience = "0 - 3 years" | "4 - 6 years" | "More than 6 years";

export type Config = { [key: string]: { [key: string]: number } };

export interface TechnicalAssessmentFormData {
  name: string;
  skills: Skill[];
  experience: Experience;
  config: Config;
  duration: number;
  is_tab_switches_enabled: boolean;
  is_fullscreen_exits_enabled: boolean;
  is_shuffling_enabled: boolean;
  is_proctoring_enabled: boolean;
  restricted_languages?: string[];
}

export interface TechnicalAssessmentFormSetpOneProps {
  form: UseFormReturn<TechnicalAssessmentFormData, any>;
  skills: Skill[];
  onSubmit: () => void;
}

export interface TechnicalAssessmentFormSetpTwoProps {
  configWatch: Config;
  skills: Skill[];
  difficulties: Difficulty[];
  durationWatch: number;
  setSelectedSkill: (selectedSkill: string) => void;
  step: number;
  setStep: (step: number) => void;
  removeSkillFromConfig: (skill: string) => void;
  nameWatch: string;
  goBack: () => void;
  form: UseFormReturn<TechnicalAssessmentFormData, any>;
}

export interface TechnicalAssessmentFormSetpThreeProps {
  configWatch: Config;
  selectedSkill: string;
  difficulties: Difficulty[];
  onStepThreeSubmit: (updatedConfig: Config) => void;
  goBack: () => void;
  skills: Skill[];
}
