import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import screenfull from "screenfull";
import {
  updateScreenWarningPopupState,
  updateTabWarningPopupState,
} from "src/redux/popupSlice";

import { SecurityProps } from "./Security.types";

const Security: React.FC<SecurityProps> = (props) => {
  // Initial count for screen and tab issues
  const ref = useRef(0);
  const refHidden = useRef(0);

  // Window blur detection state
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  const dispatch = useDispatch();

  // Function that runs when the window loses focus
  const blurListenerFunction = useCallback(() => {
    setIsWindowBlurred(true);
  }, []);

  // Function that runs when the window gains focus
  const focusListenerFunction = useCallback(() => {
    setIsWindowBlurred(false);
  }, []);

  // Function to handle the tab visibility changes
  const tabListenerFunction = useCallback(() => {
    if ((document.hidden || isWindowBlurred) && props.is_tab_switches_enabled) {
      const newIssueCount = refHidden.current + 1;
      refHidden.current++;
      if (newIssueCount <= 3) {
        dispatch(
          updateTabWarningPopupState({
            isTabWarningPopupOpen: true,
            tabWarningPopupProps: {
              count: newIssueCount,
              inviteID: props.inviteID,
            },
          })
        );
      } else {
        props.forceSubmit();
      }
    }
  }, [isWindowBlurred]);

  // Function to handle screen changes
  const screenListenerFunction = useCallback(() => {
    if (!screenfull.isFullscreen && props.is_fullscreen_exits_enabled) {
      const newIssueCount = ref.current + 1;
      ref.current++;
      if (newIssueCount <= 3) {
        dispatch(
          updateScreenWarningPopupState({
            isScreenWarningPopupOpen: true,
            screenWarningPopupProps: {
              count: newIssueCount,
              inviteID: props.inviteID,
            },
          })
        );
      } else {
        props.forceSubmit();
      }
    }
  }, []);

  // Function to handle page unload
  const unloadListenerFunction = useCallback((event: any) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const message = "Are you sure you want to leave the page?";
    event.returnValue = message;
    return message;
  }, []);

  // Adding and cleaning up all event listeners
  useEffect(() => {
    // Add event listeners
    screenfull.on("change", screenListenerFunction);
    document.addEventListener("visibilitychange", tabListenerFunction);
    window.addEventListener("blur", blurListenerFunction);
    window.addEventListener("focus", focusListenerFunction);
    window.addEventListener("beforeunload", unloadListenerFunction);

    // Cleanup on component unmount
    return () => {
      screenfull.exit();
      screenfull.off("change", screenListenerFunction);
      document.removeEventListener("visibilitychange", tabListenerFunction);
      window.removeEventListener("blur", blurListenerFunction);
      window.removeEventListener("focus", focusListenerFunction);
      window.removeEventListener("beforeunload", unloadListenerFunction);
    };
  }, [isWindowBlurred]);

  return <></>;
};

export default Security;
