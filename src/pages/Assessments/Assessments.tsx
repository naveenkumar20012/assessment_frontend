import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AssessmentsList from "src/components/AssessmentsList/AssessmentsList";
import AssessmentsSideBar from "src/components/AssessmentsSideBar/AssessmentsSideBar";
import { FullContainer, SideBar } from "src/styles";
import { assessmentFilterFormatter } from "src/utils/formatters";

import { AssessmentsContainer } from "./Assessments.styles";

const Assessments = () => {
  const { hash } = useLocation();
  const [search, setSearch] = useState("");
  const [assessmentType, setAssessmentType] = useState<AssessmetType>(
    hash ? (hash.replace("#", "") as AssessmetType) : "TECHNICAL"
  );
  const navigate = useNavigate();
  const filterQS = assessmentFilterFormatter(search, assessmentType);
  useEffect(() => {
    if (!hash) {
      navigate("#TECHNICAL");
    }
  }, []);
  return (
    <FullContainer>
      <SideBar>
        <AssessmentsSideBar
          setSearch={setSearch}
          assessmentType={assessmentType}
          setAssessmentType={setAssessmentType}
        />
      </SideBar>
      <AssessmentsContainer>
        <AssessmentsList filterQS={filterQS} key={filterQS} />
      </AssessmentsContainer>
    </FullContainer>
  );
};

export default Assessments;
