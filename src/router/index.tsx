import Protected from "@/components/auth/Protected";
import UnAuthenticated from "@/components/auth/UnAuthenticated";
import {
  PatientRegistration,
  ErrorPage,
  Login,
  Dashboard,
  NotFound,
  Patients,
} from "@/pages";
import Root from "@/pages/root";
import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <UnAuthenticated>
        <Login />
      </UnAuthenticated>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: (
      <UnAuthenticated>
        <Login />
      </UnAuthenticated>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register-patient",
    element: (
      <Protected>
        <PatientRegistration />
      </Protected>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: "/dashboard",
    element: (
      <Protected>
        <Root />
      </Protected>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/patients",
        element: <Patients />,
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default routes;
