import React from "react";
import { createPortal } from "react-dom";
import { DatetimeInput, InputContainer } from "./styles";
import { GetIcon } from "../../../icons";
import moment from "moment";
import "moment-timezone";
import { useTranslation } from "react-i18next";
import CustomLabel from "./label";
import InfoBoxItem from "./info";
import ErrorLabel from "./error";
import Footnote from "./footnote";

// Helper function to get timezone info safely
const getTimezoneInfo = () => {
  try {
    if (moment.tz) {
      const timeZone = moment.tz.guess();
      const offset = moment.tz(timeZone).format("Z");
      const gmtOffset = `GMT${offset}`;

      return {
        zone: timeZone,
        abbr: moment.tz(timeZone).format("z"),
        name: timeZone.replace(/_/g, " "),
        offset: gmtOffset,
      };
    }

    // Fallback to native JavaScript
    const date = new Date();
    const offset = (-date.getTimezoneOffset() / 60).toFixed(2);
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = Math.round((absOffset - hours) * 60);
    const gmtOffset = `GMT${offset >= 0 ? "+" : "-"}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    return {
      zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      abbr: new Date().toLocaleTimeString("en-us", { timeZoneName: "short" }).split(" ")[2],
      name: Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " "),
      offset: gmtOffset,
    };
  } catch (e) {
    return {
      zone: "UTC",
      abbr: "UTC",
      name: "Coordinated Universal Time",
      offset: "GMT+00:00",
    };
  }
};
const DatePickerPortalContainer = ({ children }) => {
  return typeof document !== "undefined" ? createPortal(children, document.body) : children;
};

const getDatePickerConfig = () => ({
  popperContainer: DatePickerPortalContainer,
  popperClassName: "datepicker-popper",
  popperPlacement: "bottom-start",
});

export const DateInput = (props) => {
  const { t } = useTranslation();
  const userFriendlyDate = typeof props.value === "undefined" || props.value === null ? null : props.value.length > 0 ? new Date(props.value) : null;
  const minDate = props.minDate ? new Date(props.minDate) : null;
  const maxDate = props.maxDate ? new Date(props.maxDate) : null;

  return (
    <InputContainer className={`${props.customClass ?? ""} ${props.dynamicClass ?? ""} ${props.customClass ?? ""}`}>
      {props.showLabel ?? true ? <CustomLabel name={props.name} label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} /> : null}
      <InfoBoxItem info={props.info} />
      <div className="relative w-full">
        <DatetimeInput
          {...getDatePickerConfig()}
          disabled={props.disabled}
          name={props.name}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          yearDropdownItemNumber={10}
          scrollableYearDropdown
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={"yyyy-MM-dd"}
          theme={props.theme}
          className={`input w-full ${props.value?.length > 0 ? "shrink" : ""}  ${props.icon?.length > 0 ? "has-icon" : ""}`}
          placeholderText={t(props.placeholder)}
          type={props.type}
          value={userFriendlyDate}
          selected={userFriendlyDate}
          onChange={(event) => props.onChange(event, props.id, props.type)}
          isClearable={true}
          showPopperArrow={true}
          calendarStartDay={1}
          fixedHeight
          formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 2)}
        />
        {props.icon?.length > 0 && (
          <div className="icon-container absolute top-[10px] left-[10px]">
            <GetIcon icon={props.icon} />
          </div>
        )}
      </div>
      <ErrorLabel error={props.error} info={props.info} />
      <Footnote {...props} />
    </InputContainer>
  );
};

export const TimeInput = (props) => {
  const { t } = useTranslation();
  const userFriendlyTime = typeof props.value === "undefined" || props.value === null ? null : props.value.length > 0 ? new Date(props.value) : null;
  const { name: timeZoneName, offset: timeZoneOffset } = getTimezoneInfo();

  return (
    <InputContainer className={`${props.customClass ?? ""} ${props.dynamicClass ?? ""}`}>
      <CustomLabel name={props.name} label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
      <InfoBoxItem info={props.info} />
      <div className="relative w-full">
        <DatetimeInput {...getDatePickerConfig()} disabled={props.disabled} name={props.name} theme={props.theme} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption={`Time (${timeZoneName})`} selected={userFriendlyTime} dateFormat="h:mm aa" className={`input w-full ${props.value?.length > 0 ? "shrink" : ""} ${props.icon?.length > 0 ? "has-icon" : ""}`} placeholderText={t(props.placeholder)} type={props.type} isClearable={true} onChange={(event) => props.onChange(event, props.id, props.type)} />
        <div className="icon-container absolute top-[10px] left-[10px]">
          <GetIcon icon="time" />
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">{props.customClass.includes("half", "quarter") ? timeZoneOffset : `${timeZoneName} (${timeZoneOffset})`}</div>
      <ErrorLabel error={props.error} info={props.info} />
      <Footnote {...props} />
    </InputContainer>
  );
};

export const DateTimeInput = (props) => {
  const { t } = useTranslation();
  const userFriendlyDateTime = typeof props.value === "undefined" || props.value === null ? null : props.value.length > 0 ? new Date(props.value) : null;
  const { abbr: dateTimeZoneAbbr, name: dateTimeZoneName, offset: dateTimeZoneOffset } = getTimezoneInfo();
  const minDate = props.minDate ? new Date(props.minDate) : null;
  const maxDate = props.maxDate ? new Date(props.maxDate) : null;

  return (
    <InputContainer className={`${props.customClass ?? ""} ${props.dynamicClass ?? ""}`}>
      <CustomLabel name={props.name} label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
      <InfoBoxItem info={props.info} />
      {props.split ? (
        <>
          <div className="datetime-container flex gap-2 w-full">
            <div className="date-container relative flex-1">
              <DatetimeInput {...getDatePickerConfig()} disabled={props.disabled} name={props.name} showYearDropdown showMonthDropdown yearDropdownItemNumber={70} scrollableYearDropdown minDate={minDate} maxDate={maxDate} dateFormat={"yyyy-MM-dd"} theme={props.theme} className={`input w-full ${props.value?.length > 0 ? "shrink" : ""}  has-icon`} placeholderText={t(props.placeholder)} type={props.type} value={userFriendlyDateTime} selected={userFriendlyDateTime} onChange={(event) => props.onChange(event, props.id, props.type)} showPopperArrow={false} calendarStartDay={1} />
              <div className="icon-container absolute top-[10px] left-[10px]">
                <GetIcon icon="date" />
              </div>
            </div>
            <div className="time-container relative flex-1">
              <DatetimeInput {...getDatePickerConfig()} disabled={props.disabled} name={props.name} theme={props.theme} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption={`Time (${dateTimeZoneAbbr})`} selected={userFriendlyDateTime} dateFormat="h:mm aa" className={`input w-full ${props.value?.length > 0 ? "shrink" : ""} has-icon`} placeholderText={t(props.placeholder)} type={props.type} onChange={(event) => props.onChange(event, props.id, props.type)} isClearable={true} />
              <div className="icon-container absolute top-[10px] left-[10px]">
                <GetIcon icon="time" />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {dateTimeZoneName} ({dateTimeZoneOffset})
          </div>
        </>
      ) : (
        <div className="datetime-container relative w-full">
          <DatetimeInput
            {...getDatePickerConfig()}
            disabled={props.disabled}
            name={props.name}
            showYearDropdown
            showMonthDropdown
            yearDropdownItemNumber={70}
            scrollableYearDropdown
            minDate={minDate}
            maxDate={maxDate}
            theme={props.theme}
            showTimeSelect
            timeIntervals={15}
            timeFormat="HH:mm"
            timeCaption={`Time (${dateTimeZoneAbbr})`}
            className={`input w-full ${props.value?.length > 0 ? "shrink" : ""}  ${props.icon?.length > 0 ? "has-icon" : ""}`}
            placeholderText={t(props.placeholder)}
            type={props.type}
            value={userFriendlyDateTime}
            selected={userFriendlyDateTime}
            dateFormat={`yyyy-MM-dd HH:mm (${dateTimeZoneAbbr})`}
            onChange={(event) => props.onChange(event, props.id, props.type)}
            isClearable={!props.required}
            showPopperArrow={false}
            calendarStartDay={1}
          />
          {props.icon?.length > 0 && (
            <div className="icon-container absolute top-[10px] left-[10px]">
              <GetIcon icon={props.icon} />
            </div>
          )}
        </div>
      )}
      <ErrorLabel error={props.error} info={props.info} />
      <Footnote {...props} />
    </InputContainer>
  );
};
