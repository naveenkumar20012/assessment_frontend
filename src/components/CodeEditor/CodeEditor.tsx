import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Editor from "@monaco-editor/react";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { executeCode, getExecutionResults } from "src/calls/assessments";
import { useAppSelector } from "src/redux/hooks";
import { updateConfirmPopupState } from "src/redux/popupSlice";
import { getBaseValueForEditor } from "src/utils/common";
import languages from "src/utils/languages";

import Loader from "../Loader/Loader";
import { CodeEditorProps } from "./CodeEditor.types";
import Output from "./Output";

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const { inviteID } = useParams();
  const { value, onChange } = props;
  const dispatch = useDispatch();
  const { restricted_languages } = useAppSelector((state) => state.respondent);
  const getValue = (name: string) => {
    return (
      languages.find((language) => language.label === name) || languages[0]
    );
  };
  const [selectedLanguage, setSelectedLanguage] = useState(
    value
      ? getValue(value[0])
      : restricted_languages
      ? getValue(restricted_languages[0])
      : languages[0]
  );
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const handleChange = (event: SelectChangeEvent) => {
    const language = languages.find(
      (lang) => lang.id === Number(event.target.value)
    );
    setSelectedLanguage(language || languages[0]);
    dispatch(
      updateConfirmPopupState({
        isConfirmPopupOpen: true,
        confirmPopupProps: {
          message: "Changing the language will reset the code",
          onAccept: () => {
            onChange([
              (language || languages[0]).label,
              getBaseValueForEditor(language?.id ?? 0),
            ]);
          },
        },
      })
    );
  };
  const checkStatus = (uuid: string) => {
    getExecutionResults(uuid)
      .then((res) => {
        let status = res.status;
        if (status === "FAILED") {
          console.error(status);
          toast.error("Could not execute code");
          setProcessing(false);
          return;
        }
        if (status === "PROCESSED") {
          setProcessing(false);
          setOutput(res.result);
          toast.success("Code executed successfully");
          return;
        }
        if (status === "PROCESSING") {
          setTimeout(() => {
            checkStatus(uuid);
          }, 2000);
          return;
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not execute code");
        setProcessing(false);
      });
  };
  const onExecute = () => {
    setProcessing(true);
    executeCode({
      language: selectedLanguage.id,
      inviteID: inviteID || "",
      code: value ? value[1] : "",
    })
      .then((res) => {
        checkStatus(res);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not execute code");
        setProcessing(false);
      });
  };
  return (
    <Box>
      <Box
        sx={{
          border: (t) => `thin solid ${t.palette.grey[400]}`,
          borderBottom: "none",
          p: 1,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          bgcolor: "#F5F5F5",
        }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <FormControl size="small">
          <Select
            value={`${selectedLanguage.id}`}
            onChange={handleChange}
            variant="outlined"
          >
            {(restricted_languages?.length
              ? restricted_languages.map((restricted_language) =>
                  getValue(restricted_language)
                )
              : languages
            ).map((language) => (
              <MenuItem value={language.id} key={language.id}>
                {language.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={onExecute} disabled={processing}>
          Execute
        </Button>
      </Box>
      <Box
        sx={{
          border: (t) => `thin solid ${t.palette.grey[400]}`,
          height: 500,
        }}
      >
        <Editor
          height="100%"
          language={selectedLanguage.value}
          defaultValue={getBaseValueForEditor(selectedLanguage.id)}
          value={value ? value[1] : ""}
          onChange={(value) => {
            onChange([selectedLanguage.label, value || ""]);
          }}
          theme="vs-dark"
        />
      </Box>
      <Box
        sx={{
          border: (t) => `thin solid ${t.palette.grey[400]}`,
          borderTop: "none",
          p: 1,
          height: 150,
          overflow: "scroll",
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
        }}
      >
        {processing ? <Loader /> : <Output outputDetails={output} />}
      </Box>
    </Box>
  );
};

export default CodeEditor;
