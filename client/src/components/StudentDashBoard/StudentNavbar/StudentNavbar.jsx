import React, { useContext } from "react";
import useState from "react-usestateref";
import bitlogo from "../../Navbar/images/header_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { StudentContext } from "../../../../LoginContext/StudentContext";
import Cookies from "js-cookie";

function StudentNavbar() {
  const context = useContext(StudentContext);

  console.log("context", context);

  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem, activeMenuItemRef] = useState("");

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    activeMenuItemRef.current = menuItem;
  };

  const Logout = () => {
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("email");
    context.setUser(null);
    Cookies.remove("jwtoken");
    localStorage.removeItem("tasks");
    navigate("/");
  };

  const useProfile = JSON.parse(localStorage.getItem("studentProfile"))
  const loggedInUser = useProfile?.emailExists.name;
  console.log("loggedInUser", loggedInUser);


  return (
    <div>
      <div className="bg-cyan-700	 border-gray-200 light:bg-gray-100">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <img src={bitlogo} alt="" height={50} width={50} />
          <li className="mr-2">
            <Link to="/">
              <a
                href="#"
                className={`inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                  activeMenuItemRef.current === "contacts"
                    ? "text-blue-600"
                    : "text-white"
                }`}
                onClick={() => handleMenuItemClick("contacts")}
              >
                <svg
                  aria-hidden="true"
                  className={`w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300 ${
                    activeMenuItemRef.current === "contacts"
                      ? "text-blue-600 dark:text-blue-500"
                      : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* <path d="M8 1a1 1 0 011 1v.5a1 1 0 102 0V2a1 1 0 011-1h2a4 4 0 014 4v3a4 4 0 01-1.293 3.043A3.962 3.962 0 0116 14v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1a3.962 3.962 0 012.293-3.557A4 4 0 015 10V7a4 4 0 014-4V2a1 1 0 011-1h2zM8 8a2 2 0 104 0H8z"></path> */}
                  <path d="M10 14a2 2 0 100 4 2 2 0 000-4zm0 2a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
                Home
              </a>
            </Link>
          </li>

          
          {/* {(context.user || loggedInUser) && (
          <li className="flex-grow"></li>
          )}

          {(context.user || loggedInUser) && (
           <li>
           <span className="inline-flex items-center p-3 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-black ml-2 text-lg">{context.user.name}</span>
           </li>
          )} */}

{(context.user || loggedInUser) && <li className="ml-auto"></li>}

{(context.user || loggedInUser) && (
  <li>
    <Link
      to="/stats"  // Adjust the path to your actual stats route
      className={`inline-flex  p-3 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ml-2 text-lg ${
        activeMenuItemRef.current === "stats"
          ? "text-blue-600"
          : "text-white"
      }`}
      onClick={() => handleMenuItemClick("stats")}
    >
      Stats
    </Link>
  </li>
)}

{(context.user || loggedInUser) && (
  <li>
    <span className="inline-flex  p-3 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-black ml-2 text-lg">{context.user?.name || loggedInUser}</span>
  </li>
)}

          

          <li className="ml-auto">
            <a
              href="#"
              className={`inline-flex items-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                activeMenuItemRef.current === "logout"
                  ? "text-blue-600"
                  : "text-white"
              }`}
              onClick={Logout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </a>
          </li>
         
        </ul>
      </div>
    </div>
  );
}

export default StudentNavbar;
