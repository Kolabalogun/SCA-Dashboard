import { UnAuthenticated, Protected } from "@/components/auth";
import {
  ErrorPage,
  Login,
  Dashboard,
  NotFound,
  Patients,
  PatientProfile,
  Success,
  StaffProfile,
  Revenue,
  RevenueDetails,
  Expenses,
  ExpenseDetails,
  AddExpenses,
  Root,
  Staffs,
  AddOtherRevenue,
} from "@/pages";

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
        path: "/dashboard/revenue",
        element: <Revenue />,
      },
      {
        path: "/dashboard/expenses",
        element: <Expenses />,
      },
      {
        path: "/dashboard/add-revenue",
        element: <AddOtherRevenue />,
      },
      {
        path: "/dashboard/add-expense",
        element: <AddExpenses />,
      },
      {
        path: "/dashboard/revenue/:id",
        element: <RevenueDetails />,
      },
      {
        path: "/dashboard/expense/:id",
        element: <ExpenseDetails />,
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
    errorElement: <ErrorPage />,
  },

  { path: "*", element: <NotFound /> },
]);

export default routes;
