import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Home } from "./pages/Home";
import { Jobs } from "./pages/Jobs";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyProfile } from "./pages/MyProfile";
import { AppliedJobs } from "./pages/AppliedJobs";
import { SavedJobs } from "./pages/SavedJobs";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { JobDetails } from "./pages/JobDetails";
import { ChangePassword } from "./pages/ChangePassword";
import { useSelector, useDispatch } from "react-redux";
import { logOrNot, me } from "./actions/UserActions";
import { EditProfile } from "./pages/EditProfile";
import { DeleteAccount } from "./pages/DeleteAccount";
import { Dashboard } from "./pages/Dashboard";
import { CreateJob } from "./pages/CreateJob";
import { getAllJobs } from "./actions/JobActions";
import { JobsLayout } from "./pages/JobsLayout";
import { Application } from "./pages/Application";
import { ApplicationDetails } from "./pages/ApplicationDetails";
import { ViewAllJobAdmin } from "./pages/VIewAllJobAdmin";
import { ViewAllAppli } from "./pages/ViewAllAppli";
import { ViewAllUsersAdmin } from "./pages/ViewAllUsersAdmin";
import { EditAppAdmin } from "./pages/EditAppAdmin";
import { EditUserAdmin } from "./pages/EditUserAdmin";
import { EditJobAdmin } from "./pages/EditJobAdmin";
import { Test } from "./pages/Test";
import NotFound from "./pages/NotFound";
import UnAuthorized from "./pages/UnAuthorized";
import ScrollToTopWhenRouteChanges from "./components/ScrollToTopOnRouteChange";
import CVBuilder from "./pages/CVBuilder";
import { DashboardRecruiter } from "./pages/DashboardRecruiter";
import { ViewAllAppliRecruiter } from "./pages/ViewAllAppliRecruiter";
import { UpgradeToRecruiter } from "./pages/UpgradeToRecruiter";
import Payment from "./pages/Payment";
import { ViewAllJobRecruiter } from "./pages/VIewAllJobRecruiter";
import UserLayout from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { RecruiterLayout } from "./layouts/RecruiterLayout";

function App() {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(me());
  }, [dispatch, isLogin]);

  useEffect(() => {
    const LogOrNot = () => {
      dispatch(logOrNot());
      dispatch(getAllJobs());
    };
    LogOrNot();
  }, []);

  const ProtectedRoute = ({
    isAllowed,
    redirectPath = "/unauthorized",
    children,
  }) => {
    if (!isAllowed) {
      return <Navigate to={redirectPath} replace />;
    }
    return children ? children : <Outlet />;
  };

  return (
    <>
      <ScrollToTopWhenRouteChanges />
      <Routes>
        {/* Public Routes */}
        <Route element={<UserLayout />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/details/:id" element={<JobDetails />} />
          <Route
            path="/upgrade-to-recruiter"
            element={<UpgradeToRecruiter />}
          />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* Protected Routes for Applicants and Recruiters */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={["applicant", "recruiter"].includes(
                localStorage.getItem("role")
              )}
            />
          }
        >
          <Route element={<UserLayout />}>
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/applied" element={<AppliedJobs />} />
            <Route path="/saved" element={<SavedJobs />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/deleteAccount" element={<DeleteAccount />} />
            <Route path="/JobsLayout" element={<JobsLayout />} />
            <Route path="/Application/:id" element={<Application />} />
            <Route
              path="/Application/Details/:id"
              element={<ApplicationDetails />}
            />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={["admin"].includes(localStorage.getItem("role"))}
            />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="allJobs" element={<ViewAllJobAdmin />} />
            <Route path="allApplications" element={<ViewAllAppli />} />
            <Route path="allUsers" element={<ViewAllUsersAdmin />} />
            <Route path="update/application/:id" element={<EditAppAdmin />} />
            <Route path="user/role/:id" element={<EditUserAdmin />} />
          </Route>
        </Route>

        {/* Recruiter Routes */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={["recruiter"].includes(localStorage.getItem("role"))}
            />
          }
        >
          <Route element={<RecruiterLayout />}>
            <Route
              path="/recruiter/dashboard"
              element={<DashboardRecruiter />}
            />
            <Route path="/recruiter/postJob" element={<CreateJob />} />
            <Route
              path="/recruiter/allJobs"
              element={<ViewAllJobRecruiter />}
            />
            <Route
              path="/recruiter/allApplications"
              element={<ViewAllAppliRecruiter />}
            />
          </Route>
        </Route>

        {/* general routes admin and recruiter */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={["admin", "recruiter"].includes(
                localStorage.getItem("role")
              )}
            />
          }
        >
          {localStorage.getItem("role") === "admin" && (
            <Route element={<AdminLayout />}>
              <Route path="admin/job/details/:id" element={<EditJobAdmin />} />
            </Route>
          )}
          {localStorage.getItem("role") === "recruiter" && (
            <Route element={<RecruiterLayout />}>
              <Route path="admin/job/details/:id" element={<EditJobAdmin />} />
            </Route>
          )}
        </Route>

        {/* Test Page */}
        <Route path="/test" element={<Test />} />
        <Route path="/cv-builder" element={<CVBuilder />} />

        {/* Error Routes */}
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="mt-14 font-bold"
      />
    </>
  );
}

export default App;
