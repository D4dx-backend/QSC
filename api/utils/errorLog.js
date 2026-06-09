// const ErrorLog = require("../models/errorLog");

// // Function to log errors to the database
// exports.errorLog = async (req, err) => {
//   console.log("hi shameer");
//   try {
//     const response = await ErrorLog.create({
//       error: {
//         message: err.toString(),
//         stack: err.stack.toString(),
//       },
//     });
//     console.log("Error logged successfully:", response);
//   } catch (error) {
//     console.error("Error logging failed:", error);
//   }
// };

const ErrorLog = require("../models/errorLog");

// Function to log errors to the database
exports.errorLog = async (req, err, error, data) => {
  try {
    const response = await ErrorLog.create({
      api: req?.baseUrl,
      method: req?.method,
      headers: req?.rawHeaders[0],
      query: req?.originalUrl,
      // body: req?.body || null,
      user: req?.user?._id,
      error: {
        message: err.message.toString(),
        stack: err.stack.toString(),
      },
      errorMessage: err.message.toString(),
      errorStack: err.stack.toString()
      // status: "Occurred",
    });
    console.log("Error logged successfully:", response);
  } catch (error) {
    console.error("Error logging failed:", error);
  }
};
