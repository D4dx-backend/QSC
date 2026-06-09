import React from "react";
import styled from "styled-components";
import { GetIcon } from "../../../../icons";
import moment from "moment";

// Extended comparison types with all operations
const COMPARE_TYPES = {
  // Numeric comparisons
  GREATER: "greater",
  GREATER_EQUAL: "greaterEqual",
  LESS: "less",
  EQUALS: "equals",
  BETWEEN: "between",
  IN: "in",
  // Date comparisons
  BEFORE_DATE: "beforeDate",
  AFTER_DATE: "afterDate",
  SAME_DATE: "sameDate",
  DATE_BETWEEN: "dateBetween",
  // String comparisons
  CONTAINS: "contains",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
  MATCHES: "matches",
  // Boolean comparisons
  IS_TRUE: "isTrue",
  IS_FALSE: "isFalse",
  // Fraction comparisons
  FRACTION_GREATER: "fractionGreater",
  FRACTION_LESS: "fractionLess",
  FRACTION_EQUALS: "fractionEquals",
};

// Styled components
const Container = styled.div`
  display: flex;
  width: 100%;
  margin-top: 5px;
  &.wrap {
    display: inline;
  }
`;

const StatusContainer = styled.div`
  padding: 2px 8px 2px 4px;
  gap: 2px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease-in-out;

  ${(props) => {
    switch (props.size) {
      case "small":
        return `
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
        `;
      case "large":
        return `
          padding: 0.625rem 1.25rem;
          font-size: 1rem;
        `;
      default:
        return `
          padding: 0.375rem 0.875rem;
          font-size: 0.875rem;
        `;
    }
  }}

  &.red {
    background-color: #fee2e2;
    border-color: #fecaca;
    color: #991b1b;
    .icon {
      color: #ef4444;
    }
  }

  &.pink {
    background-color: #fce7f3;
    border-color: #fbcfe8;
    color: #831843;
    .icon {
      color: #ec4899;
    }
  }

  &.mint {
    background-color: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
    .icon {
      color: #10b981;
    }
  }

  &.mage {
    background-color: #ede9fe;
    border-color: #ddd6fe;
    color: #5b21b6;
    .icon {
      color: #8b5cf6;
    }
  }

  &.beige {
    background-color: #fffbeb;
    border-color: #fef3c7;
    color: #92400e;
    .icon {
      color: #f59e0b;
    }
  }

  &.gray {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    color: #374151;
    .icon {
      color: #6b7280;
    }
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-right: 0.375rem;

  ${(props) => {
    switch (props.size) {
      case "small":
        return `
          svg {
            width: 0.875rem;
            height: 0.875rem;
          }
        `;
      case "large":
        return `
          svg {
            width: 1.25rem;
            height: 1.25rem;
          }
        `;
      default:
        return `
          svg {
            width: 1rem;
            height: 1rem;
          }
        `;
    }
  }}
`;

// Helper functions
const isValidDate = (date) => {
  return moment(date).isValid();
};

const stringToDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  if (moment.isMoment(dateString)) return dateString.toDate();

  const parsedDate = moment(dateString);
  return parsedDate.isValid() ? parsedDate.toDate() : null;
};

const toNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return NaN;
};

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowered = value.toLowerCase();
    return lowered === "true" || lowered === "1" || lowered === "yes";
  }
  return Boolean(value);
};

const fractionToDecimal = (fraction) => {
  if (typeof fraction === "object" && fraction.numerator !== undefined && fraction.denominator !== undefined) {
    return fraction.numerator / fraction.denominator;
  }
  if (typeof fraction === "string") {
    const parts = fraction.split("/");
    if (parts.length === 2) {
      return Number(parts[0]) / Number(parts[1]);
    }
  }
  return NaN;
};

// Format date helper
const formatDate = (date, format = "YYYY-MM-DD") => {
  if (!date) return "";
  return moment(date).format(format);
};

// Enhanced comparison logic
const compareLogic = {
  // Numeric comparisons
  [COMPARE_TYPES.GREATER]: (value, compare) => {
    const num1 = toNumber(value);
    const num2 = toNumber(compare);
    return !isNaN(num1) && !isNaN(num2) && num1 > num2;
  },
  [COMPARE_TYPES.GREATER_EQUAL]: (value, compare) => {
    const num1 = toNumber(value);
    const num2 = toNumber(compare);
    return !isNaN(num1) && !isNaN(num2) && num1 >= num2;
  },
  [COMPARE_TYPES.LESS]: (value, compare) => {
    const num1 = toNumber(value);
    const num2 = toNumber(compare);
    return !isNaN(num1) && !isNaN(num2) && num1 < num2;
  },
  [COMPARE_TYPES.EQUALS]: (value, compare) => value === compare,
  [COMPARE_TYPES.BETWEEN]: (value, compare) => {
    if (typeof compare === "object" && "start" in compare && "end" in compare) {
      const num = toNumber(value);
      const start = toNumber(compare.start);
      const end = toNumber(compare.end);
      return !isNaN(num) && !isNaN(start) && !isNaN(end) && num >= start && num <= end;
    }
    return false;
  },
  [COMPARE_TYPES.IN]: (value, compare) => Array.isArray(compare) && compare.includes(value),

  // Date comparisons
  [COMPARE_TYPES.BEFORE_DATE]: (value, compare) => {
    const date1 = stringToDate(value);
    const date2 = stringToDate(compare);
    return date1 && date2 ? moment(date1).isBefore(date2) : false;
  },
  [COMPARE_TYPES.AFTER_DATE]: (value, compare) => {
    const date1 = stringToDate(value);
    const date2 = stringToDate(compare);
    return date1 && date2 ? moment(date1).isAfter(date2) : false;
  },
  [COMPARE_TYPES.SAME_DATE]: (value, compare) => {
    const date1 = stringToDate(value);
    const date2 = stringToDate(compare);
    return date1 && date2 ? moment(date1).isSame(date2, "day") : false;
  },
  [COMPARE_TYPES.DATE_BETWEEN]: (value, compare) => {
    const date = stringToDate(value);
    const start = stringToDate(compare.start);
    const end = stringToDate(compare.end);
    return date && start && end ? moment(date).isBetween(start, end, "day", "[]") : false;
  },

  // String comparisons
  [COMPARE_TYPES.CONTAINS]: (value, compare) => {
    return String(value).includes(String(compare));
  },
  [COMPARE_TYPES.STARTS_WITH]: (value, compare) => {
    return String(value).startsWith(String(compare));
  },
  [COMPARE_TYPES.ENDS_WITH]: (value, compare) => {
    return String(value).endsWith(String(compare));
  },
  [COMPARE_TYPES.MATCHES]: (value, compare) => {
    try {
      const regex = new RegExp(compare);
      return regex.test(String(value));
    } catch (e) {
      return false;
    }
  },

  // Boolean comparisons
  [COMPARE_TYPES.IS_TRUE]: (value) => {
    return toBoolean(value) === true;
  },
  [COMPARE_TYPES.IS_FALSE]: (value) => {
    return toBoolean(value) === false;
  },

  // Fraction comparisons
  [COMPARE_TYPES.FRACTION_GREATER]: (value, compare) => {
    const dec1 = fractionToDecimal(value);
    const dec2 = fractionToDecimal(compare);
    return !isNaN(dec1) && !isNaN(dec2) && dec1 > dec2;
  },
  [COMPARE_TYPES.FRACTION_LESS]: (value, compare) => {
    const dec1 = fractionToDecimal(value);
    const dec2 = fractionToDecimal(compare);
    return !isNaN(dec1) && !isNaN(dec2) && dec1 < dec2;
  },
  [COMPARE_TYPES.FRACTION_EQUALS]: (value, compare) => {
    const dec1 = fractionToDecimal(value);
    const dec2 = fractionToDecimal(compare);
    return !isNaN(dec1) && !isNaN(dec2) && Math.abs(dec1 - dec2) < Number.EPSILON;
  },
};

// Get compare value helper
const getCompareValue = (compare, data) => {
  if (typeof compare === "object" && compare !== null) {
    // Handle date range comparison
    if ("start" in compare && "end" in compare) {
      return {
        start: data[compare.start] || compare.start,
        end: data[compare.end] || compare.end,
      };
    }
    // Handle percentage calculation
    if ("field" in compare && "multiplier" in compare) {
      const baseValue = toNumber(data[compare.field]);
      return !isNaN(baseValue) ? Math.floor(baseValue * compare.multiplier) : NaN;
    }
    return compare;
  }
  return data.hasOwnProperty(compare) ? data[compare] : compare;
};

// Enhanced evaluate status with type checking
const evaluateStatus = (status, data) => {
  let fieldValue = status.when === "currentDate" ? new Date() : data[status.when];
  const compareValue = getCompareValue(status.compare, data);

  switch (status.type) {
    case "date":
      return compareLogic[status.condition](fieldValue, compareValue);
    case "number":
      return compareLogic[status.condition](fieldValue, compareValue);
    case "string":
      return compareLogic[status.condition](fieldValue, compareValue);
    case "boolean":
      return compareLogic[status.condition](fieldValue);
    case "fraction":
      return compareLogic[status.condition](fieldValue, compareValue);
    default:
      return compareLogic[status.condition](fieldValue, compareValue);
  }
};

// Main component
const StatusLabel = ({ statusLabels, values, nextLine = true, size = "medium", dateFormat = "MMM DD, YYYY hh:mm A" }) => {
  const currentStatus = statusLabels.find((status) => evaluateStatus(status, values));

  if (!currentStatus) return null;

  const IconComponent = <GetIcon icon={currentStatus.icon.toLowerCase()} />;

  // Format any date in the label and handle dynamic values
  const formattedLabel = currentStatus.label.replace(/{{\s*([^}]+)\s*}}/g, (match, key) => {
    const value = values[key];
    if (isValidDate(value)) return formatDate(value, dateFormat);
    if (typeof value === "number") return value.toString();
    return value || "";
  });

  return (
    <Container className={nextLine ? "" : "wrap"}>
      <StatusContainer className={currentStatus.color} size={size}>
        <IconWrapper size={size} className="icon">
          {IconComponent}
        </IconWrapper>
        {formattedLabel}
      </StatusContainer>
    </Container>
  );
};

export default StatusLabel;
