export const customValidations = (field, tempformError, value, flag, t) => {
  switch (field.validation) {
    //sample funtion
    case "email1":
      console.log(field.validation);
      // Convert email to lowercase before validation
      const lowerCaseEmail = value.toLowerCase();
      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (!regex.test(lowerCaseEmail)) {
        tempformError = "Please provide a valid email Id";
        flag += 1;
      }
      // Return the lowercase email value
      value = lowerCaseEmail;
      break;
    case "phoneNumber":
      const phoneRegex = new RegExp(`^[1-9]\\d{${(field.maximum ?? 10) - 1}}$`);
      if (!phoneRegex.test(value)) {
        tempformError = `Please provide a valid ${field.maximum ?? 10}-digit WhatsApp Number`;
        flag += 1;
      }
      break;
    case "numeric":
      if ((field.numericLength ?? 0) === 0) {
        // If lengthCount is 0, any number is allowed
        const numericRegex = /^\d+$/;
        if (!numericRegex.test(value)) {
          tempformError = t("validContent", { label: t(field.label) });
          flag += 1;
        }
      } else if (field.numericLength > 0) {
        // If numericLength is greater than 0, the number must have that specific length
        const numericRegex = new RegExp(`^\\d{${field.numericLength}}$`);
        if (!numericRegex.test(value)) {
          tempformError = `Please enter a number that ${field.numericLength} length`;
          flag += 1;
        }
      }
      break;
    default:
      break;
  }
  return { flag, tempformError };
};
