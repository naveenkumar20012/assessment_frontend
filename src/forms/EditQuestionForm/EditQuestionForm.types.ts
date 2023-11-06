export interface EditQuestionFormProps {
  question: Question;
  onCancel: () => void;
  onSubmit: (
    data: EditQuestionFormData,
    existingQuestionID: string,
    callback: () => void
  ) => void;
}

export interface EditQuestionFormData {
  new_question: string;
  new_question_difficulty: string;
}
