import moment from "moment";
export const dateTimeFormat = (date) => {
  return moment(date).isValid() ? moment(date).format("MMM DD, YYYY hh:mm A") : "--";
};

export const dateFormat = (date) => {
  return moment(date).isValid() ? moment(date).format("MMM DD, YYYY") : "--";
};
export const timeFormat = (date) => {
  return moment(date).isValid() ? moment(date).format("hh:mm A") : "--";
};
