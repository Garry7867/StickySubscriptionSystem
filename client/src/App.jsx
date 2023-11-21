import React from "react";
import useState from "react-usestateref";
import "./App.css";
import "tailwindcss/tailwind.css";
import Landing from "./components/Landing/Landing";
import RegisterStudent from "./components/Registers/RegisterStudent";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Router,
  Routes,
  ScrollRestoration,
} from "react-router-dom";
import { Root } from "postcss";
import LoginStudent from "./components/Logins/LoginStudent";
import LoginRecruiter from "./components/Logins/LoginRecruiter";
import TaskList from "./components/StudentDashBoard/TaskList/TaskList";
import Footer from "./components/Footer/Footer";
import ErrorBoundary from "../src/components/ErrorPage/ErrorPage.jsx";
import { NavLink } from "react-router-dom";
import Stats from "./components/stats/Stats";
import Touch from "./components/touch/Touch";
function App() {
  // Declaration of Router Object
  const [globalEmail, setglobalEmail, globalEmailRef] = useState("");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          index
          element={
            <div>
              <Landing />
              <Footer />
            </div>
          }
        ></Route>
        <Route
          path="*"
          element={
            <div>
              <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                  <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight  text-white font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                      404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                      Something's missing.
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                      Sorry, we can't find that page. You'll find lots to
                      explore on the home page.
                    </p>
                    <NavLink to="/" className="text-white ">
                      <button
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Back to Homepage
                      </button>
                    </NavLink>
                  </div>
                </div>
              </section>
            </div>
          }
        ></Route>
        <Route
          path="loginstudent"
          element={
            <LoginStudent
              globalEmail={globalEmail}
              setglobalEmail={setglobalEmail}
              globalEmailRef={globalEmailRef}
            />
          }
        ></Route>
        <Route path="registerstudent" element={<RegisterStudent />}></Route>
        <Route
          path="loginrecruiter"
          element={
            <LoginRecruiter
              globalEmail={globalEmail}
              setglobalEmail={setglobalEmail}
              globalEmailRef={globalEmailRef}
            />
          }
        ></Route>
        <Route path="Dashboard">
          <Route
            index
            element={
              <TaskList
                globalEmail={globalEmail}
                setglobalEmail={setglobalEmail}
                globalEmailRef={globalEmailRef}
              />
            }
          ></Route>
        </Route>
        <Route path="stats">
          <Route
            index
            element={
              <Stats
                globalEmail={globalEmail}
                setglobalEmail={setglobalEmail}
                globalEmailRef={globalEmailRef}
              />
            }
          ></Route>
        </Route>
        <Route path="touch">
          <Route
            index
            element={
              <Touch
                globalEmail={globalEmail}
                setglobalEmail={setglobalEmail}
                globalEmailRef={globalEmailRef}
              />
            }
          ></Route>
        </Route>
       
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
