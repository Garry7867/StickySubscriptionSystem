// controller.jsx
const StudentLogin = require("../models/StudLogin.jsx");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Tasks = require("../models/Tasks.jsx");
const Mailgen = require('mailgen');
require("dotenv").config();
const Authenticate = require("../middleware/Authenticate.jsx");
// Create of token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};
// Error Handlers
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    name: "",
    email: "",
    phone: 0,
    password: "",
    roll: "",
    branch: "",
  };

  // Handling duplicate erros
  if (err.code === 11000) {
    // Check the duplicate field and assign the error message accordingly
    if (err.keyPattern.hasOwnProperty("email")) {
      errors.email = "Email already exists";
    } else if (err.keyPattern.hasOwnProperty("roll")) {
      errors.roll = "Roll number already exists";
    }
    return errors;
  }

  // Validation errors
  if (err.message.includes("STLOGINUSER validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

exports.registerStudent = async (req, res) => {
  const { name, email, gender, phone, password } = req.body;
  console.log("Registering");
  if (!name || !email || !phone || !gender || !password) {
    console.log(req.body);
    return res.status(400).json({ error: "Please fill in all the details" });
  }
  try {
    const userExists = await StudentLogin.findOne({ email });
    if (userExists) {
      if (userExists.email === email) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      } else {
        return res
          .status(400)
          .json({ error: "User with this roll number already exists" });
      }
    }

    const user = new StudentLogin({
      name,
      email,
      gender,
      phone,
      password,
      platforms: {},
    });
    const signUp = await user.save();
    if (signUp) {
      return res.status(201).json({ message: "Registration successful" });
    } else {
      return res.status(400).json({ error: "Registration failed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ error: "None of the fields can be empty" });
    }
    const emailExists = await StudentLogin.findOne({ email: email });
    console.log(emailExists);
    if (emailExists) {
      // const PassMatch = await bcrypt.compare(password, emailExists.password);
      // if (!PassMatch) {
      //   return res.status(400).json({ error: "Wrong Password" });
      // } else {
      const token = createToken(emailExists._id);
      res.cookie("jwtoken", token, {
        maxAge: maxAge * 1000,
        httpOnly: true,
      });
      emailExists.tokens.push({ token: token }); // Save the token in the tokens array
      await emailExists.save(); // Save the updated document
      return res.json({ emailExists, token });
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log("Error: ", err);
    return res.status(400).json({ error: "Invalid credentials" });
  }
};
exports.getTasks = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }
    const exists = await StudentLogin.findOne({ email: email });
    if (exists.taskslist) {
      return res.json(exists.taskslist);
    } else {
      return res.status(404).json({ error: "Academics Not Found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.addTasks = async (req, res) => {
  try {
    const email = req.body.email;
    const tasks = req.body.tasks;
    if (!tasks || !email) {
      return res.status(400).json({ error: "No of the feilds can be empty" });
    }
    const student = await Tasks.findOne({ email });
    student.taskslist = tasks;
    const done = await student.save();
    if (done) {
      return res.status(201).json({ message: "Tasks Added" });
    } else {
      return res.status(400).json({ error: "Tasks Not Added" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.editUser = async (req, res) => {
  try {
   
    const { email, taskslist } = req.body;

    console.log("taskslist: ", taskslist);

    if (!email) {
      return res.status(400).json({ error: "None of the fields can be empty" });
    }
    const emailExists = await StudentLogin.findOne({ email: email });

    if (!emailExists) {
      return res
        .status(404)
        .send({ message: `User with roll ${email} not found` });
    }
    emailExists.email = email;
    if (taskslist) {
      emailExists.taskslist = taskslist;
    }

    function sendEmail(platformName, email) {
      // Configure nodemailer with your email service provider details
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'stickysubscriptionsystem@gmail.com',
          pass: 'sticky94176',
        },
      });
    
      // Email content
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: `Account Expiry Reminder for ${platformName}`,
        text: `Your ${platformName} account is expiring within 24 hours. Please renew your subscription.`,
      };
    
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    // Function to check and send emails
function checkAndSendEmails() {
  const now = new Date();

  taskslist.forEach((task) => {
    // Convert renew_date string to a Date object
    const renewDate = new Date(task.renew_date);

    // Calculate the time difference in milliseconds
    const timeDifference = renewDate - now;

    // Check if the renewal date is within the next 24 hours
    if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
      // Send email
      sendEmail(task.platformName, 'recipient-email@example.com');
    }
  });
}

// Call the function to check and send emails
checkAndSendEmails();

    const done = await emailExists.save();
    if (done) {
      return res.status(201).json({ message: "Edits Done" });
    } else {
      return res.status(400).json({ error: "Not Edited" });
    }
    // return res.json(rollExists);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
