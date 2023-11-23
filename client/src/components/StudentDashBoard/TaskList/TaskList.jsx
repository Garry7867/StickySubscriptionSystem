import React, { useContext, useEffect } from "react";
import StudentNavbar from "../StudentNavbar/StudentNavbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import useState from "react-usestateref";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select, { selectClasses } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { StudentContext } from "../../../../LoginContext/StudentContext";
import Cookies from  "universal-cookie";
import { server } from "../../../main";
import axios from "axios";
const cookies = new Cookies();

import Swal from "sweetalert2";
const TaskList = (props) => {
  // const context = useContext(StudentContext);
  const navigate = useNavigate();
  const [userNumber, setuserNumber] = useState("");
  const [flag, setFlag, flagRef] = useState(false);
  const [tasks, setTasks, tasksRef] = useState([]);
  const email = localStorage.getItem("email");
  console.log(email);
  const [curr_task, setCurrTask, curr_taskRef] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [substype, setsubstype] = useState("Monthly");
  const [renew_date, setrenew_date] = useState(new Date());
  const [purchase_date, setpurchase_date] = useState(new Date());

  console.log("tasks : ", tasks);

  const getCurrUser = async () => {
    try {
      const token = cookies.get("jwtoken");
      const res = await axios.get(`${server}/afterslogin`, {
        
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.status);

      if (res.status !== 200) {
        navigate("/loginstudent")
      }
     
    } catch (err) {
      navigate("/loginstudent")
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrUser();
    
  }, []);


  // const callSlogin = async () => {
  //   try {
  //     const res = await fetch(`${server}/afterslogin`, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     context.setUser(data);
  //     if (!res.status === 200) {
  //       const error = new Error(res.error);
  //       throw error;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     navigate("/loginstudent");
  //   }
  // };

  const getTasks = async () => {
    try {
      axios
        .get(
          `http://localhost:8080/api/getTasks?email=${localStorage.getItem(
            "email"
          )}`
        )
        .then((response) => {
          const res = response.data;
          // console.log(res);
          try {
            if (!res) {
              console.log(err);
            } else {
              setTasks(res);
            }
          } catch (err) {
            console.log(err);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  function formatDate(date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1; 
    const yyyy = date.getFullYear();

    const day = dd < 10 ? `0${dd}` : dd;
    const month = mm < 10 ? `0${mm}` : mm;

    return `${yyyy}-${month}-${day}`;
  }
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const d = today.getDay();
  const yy = today.getFullYear();
  const curr_date = `${dd}/${mm}/${yy}`;
  const arr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const curr_day = arr[d];

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // localStorage.setItem("tasks", JSON.stringify(tasks));
    setFlag(tasksRef.current.length > 0);
  }, [tasks]);

  // const [purchase_date, setpurchase_date] = useState(new Date());
  // const [renew_date, setrenew_date] = useState(new Date());
  const handleChange = (e) => {
    setCurrTask(e.target.value);
  };
  const handleRDateChange = (date) => {
    setrenew_date(date);
    console.log(formatDate(renew_date));
  };
  const handlePDateChange = (date) => {
    setpurchase_date(date);
  };
  const handleNumberChange = (e) => {
    setuserNumber(e.target.value);
  };
  const handleInputChange = (e) => {
    setsubstype(e.target.value);
  };


  const addTask = () => {
    if (curr_task && subscriptionPrice !== "") {
      const currentTime = new Date().toLocaleTimeString();
      const key = `${curr_date} ${currentTime}`;
      const updatedTasks = [
        ...tasks,
        {
          id: key,
          platformName: curr_task,
          renew_date: formatDate(renew_date),
          purchase_date: formatDate(purchase_date),
          userNumber: userNumber,
          substype: substype,
          price: subscriptionPrice, // Add the price field
        },
      ];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(tasksRef.current));
      setFlag(tasksRef.current.length > 0);
      setCurrTask("");
      setrenew_date("");
      setpurchase_date("");
      setsubstype("Monthly");
      setuserNumber("");
      setSubscriptionPrice(""); // Reset the subscription price field
    }
  };
  
  // console.log(context.emailExists);
  const saveChanges = async (e) => {
    e.preventDefault();
    const taskslist = tasks;
    const res = await fetch(`http://localhost:8080/api/edituser`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        taskslist: tasks,
      }),
    });
    const data = await res.json();
    if (
      data.status === 422 ||
      data.status === 400 ||
      data.status === 404 ||
      data.status === 500
    ) {
      Swal.fire({
        title: "Bad Credentials",
        text: "Please fill in all details",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
    if (!data || data.error) {
      Swal.fire({
        title: "Please Complete Profile Details",
        text: "User Already Exists with required fields",
        icon: "error",
        confirmButtonText: "Retry",
      });
    } else {
      Swal.fire({
        title: "Updation Successful",
        icon: "success",
        timer: 1000,
      });
    }
  };
  // console.log(props.globalEmail);
  console.log(tasks);
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(tasksRef.current));
    setFlag(tasksRef.current.length > 0);
  };
  return (

    <div className="h-screen bg-gray-900">
      <div>
        <StudentNavbar />
      </div>
      <div className="flex flex-col m-2 justify-center items-center bg-[#9a9ab3]	">
        <h2 className="text-white text-6xl font-extrabold text-centre">
          My Subs
        </h2>
        <div className="flex flex-row justify-around items-center m-2">
          <span className="bg-blue-100 m-2 text-blue-800 text-xl font-medium mr-2 px-5 py-2 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {curr_day}
          </span>
          <span className="bg-green-100 text-green-800 text-xl font-medium mr-2 px-5 py-2 rounded-full dark:bg-green-900 dark:text-green-300">
            {curr_date}
          </span>
        </div>
        <div>
          {/* <div className="m-2"> */}
            {/* <div className="flex flex-row"> */}
              {/* <div className="m-2">
                <button onClick={addTask}>
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    size="xl"
                    style={{ color: "#ffffff" }}
                  />
                </button>
              </div> */}
              {/* <div className="flex flex-row"> */}
                <input
                  type="text"
                  id="tasks"
                  name="tasks"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light m-1"
                  placeholder="Add your subscriptions"
                  style={{ width: "100%" }}
                  value={curr_task}
                  onChange={handleChange}
                  required
                /><br></br>
                <input
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light m-1"
                  type="number"
                  id="copies"
                  name="copies"
                  min="1"
                  value={userNumber}
                  placeholder="Users"
                  onChange={handleNumberChange}
                  required
                /><br></br>
                <input
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light m-1"
                type="number"
                id="price"
                name="price"
                min="0"
                value={subscriptionPrice}
                placeholder="Price"
                onChange={(e) => setSubscriptionPrice(e.target.value)}
                required
               />

                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label text-gray-900" style={{ fontWeight: '600' }}>
                    
                  </InputLabel><br></br>
                  <Select
                    style={{
                      borderRadius: "8px",
                      text:"gray",
                      height: "42px",
                      fontSize: "15px",
                      backgroundColor: "white",
                      borderColor: "black",
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={substype}
                    name="substype"
                    label="substype"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={"Monthly"}>Monthly</MenuItem>
                    <MenuItem value={"Yearly"}>Yearly</MenuItem>
                  </Select><br></br>
                </FormControl><br></br>
              {/* </div> */}
            {/* </div> */}
          {/* </div> */}
          <FormControl fullWidth>
          <div className="flex flex-row">
            <label
              htmlFor="renewDate"
              className="text-white text-sm font-medium m-2 full-width"
            >
              Renew Date:
            </label>
            <DatePicker
              id="renewDate"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light m-1 custom-datepicker"
              selected={renew_date}
              onChange={handleRDateChange}
              dateFormat={`yyyy-MM-dd`}
              showYearDropdown
              scrollableMonthYearDropdown
              isClearable
            />
          </div><br></br>
          <div className="flex flex-row">
            <label
              htmlFor="purchaseDate"
              className="text-white text-sm font-medium m-2"
            >
              Purchase Date:
            </label>
            <DatePicker
              id="purchaseDate"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light m-1 custom-datepicker"
              selected={purchase_date}
              onChange={handlePDateChange}
              dateFormat={`yyyy-MM-dd`}
              showYearDropdown
              scrollableMonthYearDropdown
              isClearable
            />
          </div><br></br></FormControl><br></br>
          <div className="m-2">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <button
                type="button"
                 className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-10 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={addTask}
                >
                Add Subscriptions
                </button>
                </div>

              </div>
              </div>

        {flag ? (
          <div className="relative shadow-md sm:rounded-lg">
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={saveChanges}
            >
              Save Changes
            </button>
            <div className="flex items-center justify-center pb-4"></div>
            <div className="overflow-x-auto">
              <table className="w-full lg:table-fixed">
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Name of Subscription
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Date of Purchase
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Renew Date
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Plan-Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((elem, idx) => (
                    <tr key={elem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm md:text-base lg:text-base font-medium text-gray-900 dark:text-gray-200 max-w-96 break-all">
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-wrap">
                        <div className="text-sm md:text-base lg:text-base font-medium text-gray-900 dark:text-gray-200 max-w-96 break-all">
                          {elem.platformName}
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs md:text-sm lg:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                          {elem.id.split(" ")[1]}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs md:text-sm lg:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                          {elem.id.split(" ")[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-800 text-xs md:text-sm lg:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                          {elem.purchase_date}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-red-100 text-red-800 text-xs md:text-sm lg:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                          {elem.renew_date}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-800 text-xs md:text-sm lg:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                          {elem.userNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-yellow-100 text-yellow-800 text-xs md:text-sm lg:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                          {elem.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-800 text-xs md:text-sm lg:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                          {elem.substype}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div
                          className="text-sm md:text-base lg:text-base font-medium text-gray-900 dark:text-gray-200"
                          onClick={() => removeTask(elem.id)}
                        >
                           <FontAwesomeIcon
                    icon={faCircleMinus}
                    size="xl"
                    style={{ color: "#ffffff" }}
                  />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <section className="bg-white dark:bg-gray-900">
            {/* <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
              <div className="mx-auto max-w-screen-sm text-center">
                <p className="mb-4 text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                  Add Subscription Details
                </p>
                <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                  "Seize the day, one task at a time!"
                </p>
              </div>
            </div> */}
          </section>
        )}
      </div>
    </div>
  );
};

export default TaskList;
