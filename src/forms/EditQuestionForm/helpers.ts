export const getScore = (
  difficultyUUID: string,
  questionType: string,
  matrix: Matrix[]
) => {
  const score =
    matrix.find((entry) => {
      return (
        entry.difficulty.uuid === difficultyUUID &&
        entry.question_type === questionType
      );
    })?.points || 0;
  return score;
};
