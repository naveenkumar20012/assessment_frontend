"use strict";

import toast from "react-hot-toast";

import dayjs from "dayjs";
import localeEn from "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { validateEmail } from "src/utils/validators";

import { baseComment, errorStrings, startComment } from "./constants";
import languages from "./languages";

export function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const daysago = (postDate: string) => {
  dayjs.extend(relativeTime).locale(localeEn);
  const fromNowOn = dayjs(postDate).fromNow();
  return fromNowOn;
};

export const localDateTime = (postDate: string) => {
  dayjs.extend(utc);
  return dayjs.utc(postDate).local().format("MM/DD/YY h:mm A");
};

export const formatText = (titleKey: string) => {
  if (titleKey.includes("=true")) {
    titleKey = titleKey.split("=")[0];
  }
  if (titleKey.startsWith("is")) {
    titleKey = titleKey.replace("is", "");
  }
  titleKey = titleKey.replace(/_/g, " ");
  return titleKey.charAt(0).toUpperCase() + titleKey.slice(1);
};

export const handleError = (error: any) => {
  if (error?.response) {
    const { status, data } = error.response;
    if (status === 400) {
      if (data.codes?.length) {
        data.codes.forEach((code: string) => {
          toast.error(errorStrings[code] || errorStrings.SOMETHING_WENT_WRONG);
        });
      } else {
        Object.entries(data).forEach((dataItem: any) => {
          const [errorName, errorMessage] = dataItem;
          if (Array.isArray(errorMessage)) {
            toast.error(`${formatText(errorName)}: ${errorMessage.join(", ")}`);
          } else if (typeof errorMessage === "string") {
            toast.error(`${formatText(errorName)}: ${errorMessage}`);
          } else if (errorMessage?.codes?.length) {
            errorMessage.codes.forEach((code: string) => {
              toast.error(
                errorStrings[code] || errorStrings.SOMETHING_WENT_WRONG
              );
            });
          } else if (errorMessage?.details?.length) {
            errorMessage.details.forEach((message: string) => {
              toast.error(message);
            });
          } else if (Object.keys(errorMessage).length) {
            Object.keys(errorMessage).forEach((message: string) => {
              toast.error(`${formatText(message)}: ${errorMessage[message]}`);
            });
          }
        });
      }
    } else if (status === 401) {
      window.location.assign("/logout");
    } else if (typeof data === "string" && data.length < 50) {
      toast.error(data);
    } else {
      toast.error(errorStrings.SOMETHING_WENT_WRONG);
    }
  }
};

export const groupByKey = (list: ConstructedObjectAny[]) =>
  list.reduce((hash, obj) => {
    const skill = obj.skill.name;
    if (!hash[skill]) hash[skill] = [];
    hash[skill].push(obj);
    return hash;
  }, {});

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getBaseValueForEditor = (languageID: number) => {
  const language = languages.find((lang) => lang.id === languageID);
  if (language?.override) {
    return language.override;
  }
  if (language) {
    return `${language.multiLineCommentStart}${baseComment}${language.multiLineCommentEnd}\n${language.singleLineComment} ${startComment}`;
  }
  return "";
};

export const isBaseValue = (languageID: number, value: string) => {
  return value === getBaseValueForEditor(languageID);
};

export const getCountText = (count: number) => {
  switch (count) {
    case 1:
      return "once";
    case 2:
      return "twice";
    case 3:
      return "thrice";
    default:
      return `${count} times`;
  }
};

export function splitStringAtLastOccurrence(
  inputString: string,
  substring: string
) {
  // Find the last occurrence of the substring
  const lastIndex = inputString.lastIndexOf(substring);

  // Check if the substring was found
  if (lastIndex !== -1) {
    // Split the string at the last occurrence of the substring
    const beforeLastOccurrence = inputString.slice(0, lastIndex);
    const afterLastOccurrence = inputString.slice(lastIndex + substring.length);

    return [beforeLastOccurrence, afterLastOccurrence];
  } else {
    // Substring not found, return the original string
    return [inputString, ""];
  }
}

export function splitAtFirstOccurrence(
  str: string,
  delimiter: string
): string[] {
  const index = str.indexOf(delimiter);

  if (index !== -1) {
    return [str.substring(0, index), str.substring(index + 1)];
  } else {
    return [str];
  }
}

export function convertKeysToLowerCase(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToLowerCase);
  }
  const output: ConstructedObject = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      output[key.toLowerCase()] = convertKeysToLowerCase(obj[key]);
    }
  }
  return output;
}

export function trimObj(obj: any) {
  if (!Array.isArray(obj) && typeof obj != "object") return obj;
  return Object.keys(obj).reduce(
    function (acc: any, key) {
      acc[key.trim()] =
        typeof obj[key] == "string" ? obj[key].trim() : trimObj(obj[key]);
      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
}

export const validateCSVData = (obj: ExtractedCSVData[]): boolean => {
  const errors: ConstructedObjectAny = {};
  // Check if it's an array
  if (!Array.isArray(obj)) {
    return false;
  }
  // Check if it's empty
  obj.forEach((item, index) => {
    const rowName = `Row ${index + 1}`;
    if (typeof item !== "object") {
      errors[rowName] = [...(errors[rowName] || []), "Row is not an object"];
    }
    if (!item.hasOwnProperty("name") || !item.hasOwnProperty("email")) {
      errors[rowName] = [...(errors[rowName] || []), "Invalid headers"];
      return;
    }
    if (typeof item.name !== "string") {
      errors[rowName] = [...(errors[rowName] || []), "Name is not a string"];
      return;
    }
    if (typeof item.email !== "string") {
      errors[rowName] = [...(errors[rowName] || []), "Email is not a string"];
      return;
    }
    if (!item.name?.length) {
      errors[rowName] = [...(errors[rowName] || []), "Name is empty"];
    }
    if (!item.email?.length) {
      errors[rowName] = [...(errors[rowName] || []), "Email is empty"];
    }
    if (!validateEmail(item.email)) {
      errors[rowName] = [...(errors[rowName] || []), "Email is invalid"];
    }
  });
  if (Object.keys(errors).length) {
    toast.error(objectToStringWithNewLines(errors));
    return false;
  }
  // Return true by default
  return true;
};

export const objectToString = (obj: ExtractedCSVData[]) => {
  let result = "";
  obj.forEach((item) => {
    result += `${item.email} ${item.name}\n`;
  });
  return result;
};

export const objectToStringWithNewLines = (obj: {
  [key: string]: string[];
}) => {
  let result = "";
  Object.keys(obj).forEach((key) => {
    result += `${key} \n`;
    obj[key].forEach((item) => {
      result += `${item} \n`;
    });
  });
  return result;
};

export function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}
