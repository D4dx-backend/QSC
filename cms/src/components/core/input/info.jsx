import { useEffect, useRef, useState } from "react";
import { CloseButton, InfoBox } from "./styles";
import { GetIcon } from "../../../icons";

function InfoBoxItem({ info, customClass = "" }) {
  const [infoVisible, setInfoVisible] = useState(false);
  const buttonRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setInfoVisible(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleButton = () => {
    setInfoVisible(!infoVisible);
  };
  return info?.length > 0 ? (
    <>
      <CloseButton className={customClass} onClick={handleButton} ref={buttonRef}>
        <GetIcon icon={"info"}></GetIcon>
      </CloseButton>
      {infoVisible && <InfoBox dangerouslySetInnerHTML={{ __html: info }}></InfoBox>}
    </>
  ) : (
    ""
  );
}
export default InfoBoxItem;
