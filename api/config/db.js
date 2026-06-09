const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("\x1b[36m%s\x1b[0m", `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("mongoose connection error", error);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
