// server.jsx

const cron = require("node-cron");
const emailjs = require("@emailjs/nodejs");

const express = require("express");

const app = express();
const mongoose = require("mongoose");
const UserData = require("./models/StudLogin.jsx");
const PORT = process.env.PORT || 8080;
const ConnectDB = require("./connection/connection.jsx");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// Parse JSON request bodies
app.use(express.json());
// Parse cookies
app.use(cookieParser());

// Enables parsing of rich objects and arrays in the URL-encoded format.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
const cors = require("cors");
app.use("*", cors({ credentials: true, origin: true }));

// CORS middleWare
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Morgan in the backend to generate request logs
app.use(morgan("tiny"));

dotenv.config({ path: "../.env" });
// Connection with MongoDB
ConnectDB();
// To Load The routers
app.use("/", require("./routes/router.jsx"));

const getUser = async () => {
  try {
    users = await UserData.find();

    const f = async () => {
      const currDate = new Date();
      currDate.setHours(currDate.getHours() + 48);

      users.forEach((user) => {
        user.taskslist.forEach((sub, idx, arr) => {
          console.log(sub)
          if (currDate >= new Date(sub.renew_date) && new Date() <= new Date(sub.renew_date)) {
            sendEmail(user,idx);
            console.log(currDate)
            console.log(new Date(sub.renew_date))
          }
        });
      });

    };
    f();
  } catch (err) {
    console.log(err);
  }
};



const sendEmail = (user, idx) => {
  emailjs
    .send(
      "service_ze52bzc",
      "template_skenvch",
      {
        to_name: user.name,
        to_email: user.email,
        app_name: user.taskslist[idx].platformName,
        renewal_date: user.taskslist[idx].renew_date,
      },
      {
        publicKey: "VWY3kNAXOaFjNRt6a",
        privateKey: "TxSzfjbrR6k5YmknQBq1y",
      }
    )
    .then(
      (result) => {
        console.log("Message Sent");
      },
      (error) => {
        console.log(error.text);
      }
    );
};



cron.schedule("53 23 * * *", async () => {
  getUser();

});

app.listen(PORT, () => {
  console.log(`Your Server is running at PORT http://localhost:${PORT}`);
});
