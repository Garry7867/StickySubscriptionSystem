import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import StudentNavbar from '../StudentDashBoard/StudentNavbar/StudentNavbar';

const Stats = () => {

    const [tasks, setTasks] = useState([])

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


    //   const removeTask = (id) => {
    //     const updatedTasks = tasks.filter((task) => task.id !== id);
    //     setTasks(updatedTasks);
    //     localStorage.setItem("tasks", JSON.stringify(tasksRef.current));
    //     setFlag(tasksRef.current.length > 0);
    //   };
    

    // Initialize totalBudget to 0
let totalBudget = 0;

// Iterate through each task and accumulate the price
for (let i = 0; i < tasks.length; i++) {
    // Convert the price to a floating-point number and add it to totalBudget
    totalBudget += parseFloat(tasks[i].price);
}

console.log("totalBudget : ", totalBudget);

      useEffect(() => {
        getTasks();
      }, []);




  return (
    <>
    <StudentNavbar />
        <div className="flex flex-col items-center justify-center mt-16 gap-10 bg-[#9a9ab3]">
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
                    {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs md:text-sm lg:text-sm font-medium text-black uppercase tracking-wider">
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ?
                     <p className="w-screen  text-center text-2xl text-red-500 mt-10 ">No data found</p> 
                  :
                   tasks.map((elem, idx) => (
                    <tr key={elem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm md:text-base lg:text-base font-medium text-white dark:text-gray-200 max-w-96 break-all">
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-wrap">
                        <div className="text-sm md:text-base lg:text-base font-medium text-white dark:text-gray-200 max-w-96 break-all">
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
                      {/* <td className="px-6 py-4 whitespace-nowrap text-right">
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
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div >
      <h1 className='text-white text-xl'>Total Budget: ${totalBudget}</h1>
    </div>

          </div>
    </>
  )
}

export default Stats