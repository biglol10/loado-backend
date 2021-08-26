const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }); // add these to avoid warnings
  console.log(`MongoDB (biglolkor) Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
