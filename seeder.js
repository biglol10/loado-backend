const fs = require("fs"); // file system node (already in node)... to bring in bootcamps.json file
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const UserLoado = require("./models/UserLoado");
const User = require("./models/Users");

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const userHW = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/todoData.json`, "utf-8")
);

const userData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await UserLoado.create(userHW);
    await User.create(userData);

    console.log("Data Imported... ".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await UserLoado.deleteMany(); // if you don't pass anything it will delete everything
    await User.deleteMany();

    console.log("Data Deleted... ".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// when we call node seeder.js, you would want to add an argument on to it that will let it know if we want to either
// import or delete... for example node seeder -i
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
