const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const StudentLoginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      validate: [isEmail, "Please enter a valid email"],
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      minlength: [10, "Phone number must contain 10 digits"],
    },
    password: {
      type: String,
      required: true,
    },
    taskslist: [
      {
        id: {
          type: String,
          required: true,
        },
        platformName: {
          type: String,
          required: true,
        },
        purchase_date: {
          type: String, // You might want to use a Date type here if you want to store dates as dates.
          required: true,
        },
        renew_date: {
          type: String, // You might want to use a Date type here if you want to store dates as dates.
          required: true,
        },
        substype: {
          type: String,
          required: true,
        },
        userNumber: {
          type: Number, // Or you can use String if it can be alphanumeric
          required: true,
        },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { strict: false }
);
// Firing a function before the doc is saved to the database
// .pre and .post are the Mongoose Hooks
StudentLoginSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const StudentLogin = mongoose.model("STLOGINUSER", StudentLoginSchema);
module.exports = StudentLogin;
