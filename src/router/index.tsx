import Protected from "@/components/auth/Protected";
import UnAuthenticated from "@/components/auth/UnAuthenticated";
import {
  ErrorPage,
  Login,
  Dashboard,
  NotFound,
  Patients,
  PatientProfile,
  Success,
  StaffProfile,
} from "@/pages";

import Root from "@/pages/root";
import Staffs from "@/pages/staffs";
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
        path: "/dashboard/register-patient",
        element: <PatientProfile />,
      },
      {
        path: "/dashboard/register-staff",
        element: <StaffProfile />,
      },
      {
        path: "/dashboard/patients",
        element: <Patients />,
      },
      {
        path: "/dashboard/staffs",
        element: <Staffs />,
      },
      {
        path: "/dashboard/patient/:id",
        element: <PatientProfile />,
      },
      {
        path: "/dashboard/staff/:id",
        element: <StaffProfile />,
      },
      {
        path: "/dashboard/success/:id",
        element: <Success />,
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default routes;
