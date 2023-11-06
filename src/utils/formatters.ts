export const urlFormatter = (url: string, newQueryParams: string) => {
  if (url.includes("?")) {
    return `${url}&${newQueryParams}`;
  }
  return `${url}?${newQueryParams}`;
};

export const assessmentFilterFormatter = (
  search: string,
  assessmentType: AssessmetType
) => {
  const filterQS: string[] = [];
  if (search) {
    filterQS.push(`search=${search}`);
  }
  if (assessmentType) {
    filterQS.push(`assessment_type=${assessmentType}`);
  }
  return filterQS.join("&");
};

export const inviteFilterFormatter = (search: string) => {
  const filterQS: string[] = [];
  if (search) {
    filterQS.push(`search=${search}`);
  }
  return filterQS.join("&");
};

export const formatCountDownTimer = (time: number) => {
  const seconds = time % 60;
  const minutes = (time - seconds) / 60;
  return `${minutes}:${seconds}`;
};
