import { Config, Experience } from "./TechnicalAssessmentForm.types";

export const generateQuestionMatrix = (
  difficulties: Difficulty[],
  experienceWatch: Experience,
  skillsWatch: Skill[],
  skills: Skill[]
) => {
  let skillConfig = {};
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  let programmingDifficulty = "";
  const easyUUID =
    difficulties.find((difficulty) => difficulty.name === "Easy")?.uuid || "";
  const mediumUUID =
    difficulties.find((difficulty) => difficulty.name === "Medium")?.uuid || "";
  const hardUUID =
    difficulties.find((difficulty) => difficulty.name === "Hard")?.uuid || "";
  const programmingSkills = skills.filter((skill) => !skill.is_visible);
  const randomProgrammingSkill =
    programmingSkills[Math.floor(Math.random() * programmingSkills.length)];
  if (experienceWatch === "0 - 3 years") {
    easyCount = skillsWatch.length <= 2 ? 2 : 1;
    mediumCount = 1;
    hardCount = 1;
    programmingDifficulty = mediumUUID;
  } else if (experienceWatch === "4 - 6 years") {
    easyCount = 1;
    mediumCount = skillsWatch.length <= 2 ? 2 : 1;
    hardCount = 1;
    programmingDifficulty = mediumUUID;
  } else {
    easyCount = 0;
    mediumCount = 2;
    hardCount = skillsWatch.length <= 2 ? 2 : 1;
    programmingDifficulty = hardUUID;
  }
  skillConfig = {
    [easyUUID]: easyCount,
    [mediumUUID]: mediumCount,
    [hardUUID]: hardCount,
  };
  const config = skillsWatch.reduce((acc, cur) => {
    acc = { ...acc, [cur.uuid]: skillConfig };
    return acc;
  }, {});
  return {
    ...config,
    [randomProgrammingSkill.uuid]: { [programmingDifficulty]: 3 },
  };
};

export const getSkillName = (uuid: string, skills: Skill[]) => {
  return skills.find((skill) => skill.uuid === uuid)?.name || "";
};

export const getSkillLevel = (
  uuid: string,
  config: Config,
  difficulties: Difficulty[]
) => {
  const difficultyUUIDS = Object.keys(config[uuid]);
  return difficultyUUIDS
    .filter((id) => config[uuid][id])
    .map((id) => {
      return (
        difficulties.find((difficulty) => difficulty.uuid === id)?.name || ""
      );
    })
    .join(",");
};

export const getDifficultyName = (uuid: string, difficulties: Difficulty[]) => {
  return difficulties.find((difficulty) => difficulty.uuid == uuid)?.name || "";
};

export const getSkillType = (uuid: string, skills: Skill[]) => {
  return skills.find((skill) => skill.uuid === uuid)?.is_visible
    ? "MCQ"
    : "Program";
};

export const getSkillQuestionsCount = (uuid: string, config: Config) => {
  return Object.keys(config[uuid]).reduce((acc, cur) => {
    acc = acc + config[uuid][cur];
    return acc;
  }, 0);
};

export const getPoints = (
  difficultyUUID: string,
  question_type: string,
  matrix: Matrix[]
) => {
  return (
    matrix.find(
      (entry) =>
        entry.difficulty.uuid === difficultyUUID &&
        entry.question_type === question_type
    )?.points || 0
  );
};

export const getSkillScore = (
  uuid: string,
  config: Config,
  skills: Skill[],
  difficulties: Difficulty[],
  matrix: Matrix[]
) => {
  const easyUUID =
    difficulties.find((difficulty) => difficulty.name === "Easy")?.uuid || "";
  const mediumUUID =
    difficulties.find((difficulty) => difficulty.name === "Medium")?.uuid || "";
  const hardUUID =
    difficulties.find((difficulty) => difficulty.name === "Hard")?.uuid || "";
  const questionType = getSkillType(uuid, skills).toUpperCase();
  const easyScore =
    config[uuid][easyUUID] * getPoints(easyUUID, questionType, matrix) || 0;
  const mediumScore =
    config[uuid][mediumUUID] * getPoints(mediumUUID, questionType, matrix) || 0;
  const hardScore =
    config[uuid][hardUUID] * getPoints(hardUUID, questionType, matrix) || 0;
  return easyScore + mediumScore + hardScore;
};

export const getSkillScorePerDifficulty = (
  uuid: string,
  difficulty_name: string,
  config: Config,
  skills: Skill[],
  difficulties: Difficulty[],
  matrix: Matrix[]
) => {
  const difficultyUUID =
    difficulties.find((difficulty) => difficulty.name === difficulty_name)
      ?.uuid || "";
  const questionType = getSkillType(uuid, skills).toUpperCase();
  const score =
    config[uuid][difficultyUUID] *
      getPoints(difficultyUUID, questionType, matrix) || 0;
  return score;
};

export const getQuestionsCountPerSkill = (
  uuid: string,
  config: Config,
  difficultyName: string,
  difficulties: Difficulty[]
) => {
  const difficultyUUID =
    difficulties.find((difficulty) => difficulty.name === difficultyName)
      ?.uuid || "";
  return config[uuid][difficultyUUID] || 0;
};

export const getDifficultyID = (name: string, difficulties: Difficulty[]) => {
  return (
    difficulties.find((difficulty) => difficulty.name === name)?.uuid || ""
  );
};

export const getAssessmentDuration = (
  config: Config,
  skills: Skill[],
  matrix: Matrix[]
) => {
  let duration = 0;
  if (config) {
    Object.keys(config).forEach((skillUUID) => {
      const question_type = getSkillType(skillUUID, skills).toUpperCase();
      Object.keys(config[skillUUID]).forEach((difficultyUUID) => {
        const count = config[skillUUID][difficultyUUID];
        const durationPerQuestion =
          matrix.find(
            (entry) =>
              entry.question_type === question_type &&
              entry.difficulty.uuid === difficultyUUID
          )?.duration || 0;
        duration = duration + count * durationPerQuestion;
      });
    });
  }
  return Math.ceil(duration / 10) * 10;
};
