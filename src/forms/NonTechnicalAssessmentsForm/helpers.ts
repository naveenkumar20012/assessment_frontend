export const getAssessmentDuration = (
  difficultyUUID: string,
  matrix: Matrix[]
) => {
  const count = 5;
  const question_type = "OPEN_ENDED";
  const durationPerQuestion =
    matrix.find(
      (entry) =>
        entry.difficulty.uuid === difficultyUUID &&
        entry.question_type === question_type
    )?.duration || 0;
  const duration = count * durationPerQuestion;
  return Math.ceil(duration / 10) * 10;
};
