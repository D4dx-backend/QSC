import React, { useEffect, useRef, useState } from "react";
import InfoBoxItem from "./info";
import CustomLabel from "./label";
import { CountryCode, Input, InputContainer } from "./styles";
import ErrorLabel from "./error";
import Footnote from "./footnote";
import { GetIcon } from "../../../icons";

export const MobileNumber = (props) => {
  const [country, setCountry] = useState(() => {
    if (props.value?.country) {
      const temp = props.countries.filter((country) => country.phoneCode === props.value.country);

      return temp?.[0] ?? props.countries?.[0] ?? {};
    } else {
      return props.countries?.[0] ?? {};
    }
  });
  const [openCountry, setOpenCountry] = useState(false);
  // console.log(props.label,props.value)
  const { themeColors } = props;
  const countryRef = useRef(null); // Ref to track the country dropdown
  const handleClickOutside = (event) => {
    if (countryRef.current && !countryRef.current.contains(event.target)) {
      setOpenCountry(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  let value1 = isNaN(props.value?.number) ? null : props.value?.number;
  const handleKeyDown1 = (event) => {
    if (event.keyCode === 38 || event.keyCode === 40) {
      // Prevent the default behavior for up and down arrow keys
      console.log("event", "aborted");
      event.preventDefault();
    }
  };

  return (
    <InputContainer className={`${props.dynamicClass ?? ""} ${props.customClass ?? ""}`} animation={props.animation}>
      <InfoBoxItem info={props.info} />
      <CustomLabel name={props.name} label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
      <CountryCode
        ref={countryRef} //
        className="country"
        onClick={() => {
          setOpenCountry((prev) => !prev);
        }}
      >
        <span> {`${country.flag} +${country.phoneCode}`}</span> <GetIcon icon={"down1"}></GetIcon>
        {openCountry && (
          <div className="options">
            {props.countries.map((countryItem, index) => {
              return (
                <React.Fragment key={index}>
                  {index > 0 && <div className="line"></div>}
                  <div
                    className={`option ${countryItem.phoneCode === country.phoneCode ? "active" : ""}`}
                    onClick={(e) => {
                      console.log({ countryItem });
                      setOpenCountry((prev) => !prev);
                      setCountry(countryItem);
                      props.onChange({ target: { value: value1 } }, props.id, props.type, props.sub, countryItem);
                      e.stopPropagation();
                    }}
                  >{`${countryItem.flag} +${countryItem.phoneCode} - ${countryItem.title}`}</div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </CountryCode>
      <Input
        disabled={props.disabled ?? false}
        onKeyDown={handleKeyDown1} // Attach the onKeyDown event handler
        onWheel={(e) => e.target.blur()}
        autoComplete="on"
        theme={themeColors}
        className={`input phone${country.phoneCode?.toString().length} ${value1?.toString().length > 0 ? "" : ""}`}
        placeholder={props.label}
        type="number"
        value={value1}
        onChange={(event) => props.onChange(event, props.id, props.type, props.sub, country)}
        min={0}
        max={Math.pow(10, country.PhoneNumberLength) - 1}
        name={props.name}
      />
      <ErrorLabel error={props.error} info={props.info} />
      <Footnote {...props} />
    </InputContainer>
  );
};
