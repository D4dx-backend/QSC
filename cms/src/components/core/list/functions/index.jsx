import { Image } from "@react-pdf/renderer";
import { GetIcon } from "../../../../icons";
import { dateFormat, dateTimeFormat } from "../../functions/date";
import { IconBox, Img } from "../styles";
import { noimage } from "../../../../images";
import ImagePopup from "../image";
import { useState } from "react";

export function convertMinutesToHHMM(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  const hoursStr = hours.toString().padStart(2, "0");
  const minsStr = mins.toString().padStart(2, "0");

  return `${hoursStr}:${minsStr}`;
}

// Create a separate component for image handling
const ImageDisplay = ({ src, isPrint, onClick }) => {
  const [showImage, setShowImage] = useState(null);

  if (isPrint) {
    return (
      <Image
        onClick={(e) => {
          setShowImage({ src: e.target.src.replace("/thumbnail", "") });
          e.stopPropagation();
        }}
        style={{ width: 50, height: 50 }}
        source={src}
      />
    );
  }

  return (
    <>
      <Img
        onClick={(e) => {
          setShowImage({ src: e.target.src.replace("/thumbnail", "") });
          e.stopPropagation();
        }}
        src={src}
      />
      {showImage && <ImagePopup onClose={() => setShowImage(null)} src={showImage.src} />}
    </>
  );
};

export const getValue = (attribute, itemValue, display = false, isPrint = false, onClick = () => {}) => {
  let response = "";
  if (attribute.hide) {
    return "";
  }
  switch (attribute.type) {
    case "minute":
      response = convertMinutesToHHMM(parseFloat(itemValue ?? 0));
      break;
    case "file":
      const fileextension = itemValue?.length > 10 ? itemValue.split(".").pop().toLowerCase() : "pdf";
      response = (
        <a
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!itemValue) return;
            const src = import.meta.env.VITE_APP_CDN + itemValue;
            window.open(src, "_blank", "noopener,noreferrer");
          }}
          href={itemValue ? import.meta.env.VITE_APP_CDN + itemValue : "#"}
          target={"_blank"}
          rel="noreferrer"
        >
          Download {fileextension}
        </a>
      );
      break;
    case "image":
      if (attribute.multiple) {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
        response =
          itemValue && Array.isArray(itemValue) && itemValue.length > 0
            ? itemValue.map((imgPath, idx) => {
                const src = import.meta.env.VITE_CDN + imgPath;
                const extension = imgPath.split(".").pop().toLowerCase();
                if (imageExtensions.includes(extension)) {
                  return <ImageDisplay key={idx} src={src} isPrint={isPrint} onClick={onClick} />;
                } else {
                  return (
                    <a
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        const link = document.createElement("a");
                        link.href = src;
                        link.target = "_blank";
                        link.download = "";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginRight: 8 }}
                    >
                      Download {extension}
                    </a>
                  );
                }
              })
            : null;
      } else {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
        const src = itemValue?.length > 0 ? import.meta.env.VITE_CDN + itemValue : noimage;
        const extension = itemValue?.length > 10 ? itemValue.split(".").pop().toLowerCase() : "jpeg";
        if (imageExtensions.includes(extension)) {
          response = <ImageDisplay src={src} isPrint={isPrint} onClick={onClick} />;
        } else {
          response = (
            <a
              onClick={(e) => {
                const src = itemValue ? import.meta.env.VITE_CDN + itemValue : noimage;
                const extension = itemValue.split(".").pop().toLowerCase();

                if (!imageExtensions.includes(extension)) {
                  e.preventDefault();
                  const link = document.createElement("a");
                  link.href = src;
                  link.target = "_blank";
                  link.download = "";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              href={itemValue ? import.meta.env.VITE_CDN + itemValue : noimage}
              target={imageExtensions.includes(itemValue.split(".").pop().toLowerCase()) ? "_self" : "_blank"}
              rel="noreferrer"
            >
              Download {extension}
            </a>
          );
        }
      }
      break;
    case "datetime":
      response = dateTimeFormat(itemValue);
      break;
    case "multiSelect":
      if (attribute.apiType === "API") {
        response = itemValue.map((item) => item[attribute.showItem].toString()).join(", ");
      } else {
        response = itemValue.map((item) => attribute.selectApi.find((label) => label.id === item).value.toString()).join(", ");
      }
      break;
    case "select1":
      if (attribute.apiType === "API") {
        response = itemValue.map((item) => item[attribute.showItem].toString()).join(", ");
      } else {
        response = itemValue.map((item) => attribute.selectApi.find((label) => label.id === item).value.toString()).join(", ");
      }
      break;
    case "number":
      try {
        if (Number.isInteger(itemValue ? itemValue : 0)) {
          response = (itemValue ? itemValue : 0).toString(); // Return as whole number
        } else {
          response = (itemValue ? itemValue : 0).toFixed(2); // Format with two decimal places
        }
        response = itemValue;
      } catch (error) {
        // console.log(error);
        response = itemValue;
      }
      break;
    case "mobilenumber":
      try {
        if (typeof itemValue === "object") {
          response = "+" + itemValue.country + "" + itemValue.number; // Return as whole number
        } else {
          response = itemValue; // Format with two decimal places
        }
      } catch (error) {
        // console.log(error);
        response = itemValue;
      }
      break;
    case "percentage":
      try {
        if (Number.isInteger(itemValue ? itemValue : 0)) {
          response = (itemValue ? itemValue : 0).toString() + "%"; // Return as whole number
        } else {
          response = (itemValue ? itemValue : 0).toFixed(2) + "%"; // Format with two decimal places
        }
      } catch (error) {
        console.log(error);
        response = itemValue;
      }
      break;
    case "date":
      response = dateFormat(itemValue);
      break;
    case "textarea":
    case "htmleditor":
      response = isPrint ? (
        itemValue
      ) : (
        <span
          dangerouslySetInnerHTML={{
            __html: itemValue?.toString()?.substring(0, 200),
          }}
        ></span>
      );
      break;
    case "checkbox":
      response = <IconBox className={display && "display"}>{itemValue ? <GetIcon icon={"checked"} /> : <GetIcon icon={"Close"} />}</IconBox>;
      break;
    case "icon":
      response = <i className={`fa-light ${itemValue}`} />;
      break;
    default:
      switch (typeof itemValue) {
        case "undefined":
          response = "--";
          break;
        case "object":
          response = itemValue?.[attribute.showItem] ?? "--";
          break;
        case "boolean":
          response = itemValue.toString();
          break;
        case "string":
        case "number":
        default:
          if (attribute.type === "select" && attribute.apiType === "JSON") {
            const value = attribute.selectApi.filter((item) => item.id.toString() === itemValue?.toString()).map((filteredItem) => (response = filteredItem.value));
            response = value?.[0].toString().substring(0, 200);
          } else {
            response = itemValue?.toString().substring(0, 200);
          }
          break;
      }
  }
  return response;
};

export const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return `${age} years old`;
};

export const findChangedValues = (object, updatedObject) => {
  const changes = {};
  const logEntries = [];
  console.log(object, updatedObject);

  const setsEqual = (set1, set2) => {
    if (set1.size !== set2.size) return false;
    for (let item of set1) {
      if (!set2.has(item)) return false;
    }
    return true;
  };

  for (const key in updatedObject) {
    if (updatedObject.hasOwnProperty(key)) {
      const originalValue = object[key];
      const updatedValue = updatedObject[key];

      // Check if the value is a multi-value string (array of strings)
      if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
        console.log({ key, originalValue, updatedValue });
        const originalSet = new Set(originalValue);
        const updatedSet = new Set(updatedValue);

        // Compare sets
        if (!setsEqual(originalSet, updatedSet)) {
          const logEntry = `${key} [${Array.from(originalSet).join(", ")}]->[${Array.from(updatedSet).join(", ")}]`;
          logEntries.push(logEntry);
          changes[key] = updatedValue;
        }
      } else if (originalValue !== updatedValue) {
        // Log entry for the change
        const logEntry = `${key} ${originalValue}->${updatedValue}`;
        logEntries.push(logEntry);
        changes[key] = updatedValue;
      }
    }
  }

  // Create log message
  const logMessage = logEntries.length > 0 ? logEntries.join("\n") + " are changed" : "No changes detected";
  console.log(logMessage);
  // Return the changes and the log message
  return {
    log: logMessage,
    changedObject: changes,
  };
};

/**
 * Generates two letters from a title value for profile images
 * @param {string} title - The title to generate letters from
 * @returns {string} Two letters in uppercase
 */
export const generateProfileLetters = (title) => {
  if (!title) return "--";

  // Remove special characters and split into words
  const words = title.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/);

  if (words.length === 1) {
    // If single word, take first two letters
    return words[0].substring(0, 2).toUpperCase();
  } else {
    // If multiple words, take first letter of first two words
    return (words[0][0] + words[1][0]).toUpperCase();
  }
};
