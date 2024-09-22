import { UnAuthenticated, Protected, AccessRole } from "@/components/auth";
import { AccessRoleEnum } from "@/components/auth/accessRole";
import {
  ErrorPage,
  Login,
  Dashboard,
  NotFound,
  Patients,
  PatientProfile,
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
import PaySlip from "@/pages/payslip";

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
        element: (
          <AccessRole
            allowedRoles={[
              AccessRoleEnum.Admin,
              AccessRoleEnum.Editor,
              AccessRoleEnum.Viewer,
              AccessRoleEnum.PatientEditor,
            ]}
          >
            <PatientProfile />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/register-staff",
        element: (
          <AccessRole
            allowedRoles={[AccessRoleEnum.Admin, AccessRoleEnum.Editor]}
          >
            <StaffProfile />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/patients",
        element: (
          <AccessRole
            allowedRoles={[
              AccessRoleEnum.Admin,
              AccessRoleEnum.Editor,
              AccessRoleEnum.Viewer,
              AccessRoleEnum.PatientEditor,
            ]}
          >
            <Patients />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/patient/:id",
        element: (
          <AccessRole
            allowedRoles={[
              AccessRoleEnum.Admin,
              AccessRoleEnum.Editor,
              AccessRoleEnum.Viewer,
              AccessRoleEnum.PatientEditor,
            ]}
          >
            <PatientProfile />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/staffs",
        element: (
          <AccessRole
            allowedRoles={[
              AccessRoleEnum.Admin,
              AccessRoleEnum.Editor,
              AccessRoleEnum.Viewer,
            ]}
          >
            <Staffs />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/payslip",
        element: (
          <AccessRole allowedRoles={[AccessRoleEnum.Admin]}>
            <PaySlip />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/staff/:id",
        element: (
          <AccessRole
            allowedRoles={[
              AccessRoleEnum.Admin,
              AccessRoleEnum.Editor,
              AccessRoleEnum.Viewer,
            ]}
          >
            <StaffProfile />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/revenue",
        element: (
          <AccessRole
            allowedRoles={[AccessRoleEnum.Admin, AccessRoleEnum.Editor]}
          >
            <Revenue />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/expenses",
        element: (
          <AccessRole
            allowedRoles={[AccessRoleEnum.Admin, AccessRoleEnum.Editor]}
          >
            <Expenses />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/add-revenue",
        element: (
          <AccessRole
            allowedRoles={[AccessRoleEnum.Admin, AccessRoleEnum.Editor]}
          >
            <AddOtherRevenue />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/add-expense",
        element: (
          <AccessRole
            allowedRoles={[AccessRoleEnum.Admin, AccessRoleEnum.Editor]}
          >
            <AddExpenses />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/revenue/:id",
        element: (
          <AccessRole
            allowedRoles={[AccessRoleEnum.Admin, AccessRoleEnum.Editor]}
          >
            <RevenueDetails />
          </AccessRole>
        ),
      },
      {
        path: "/dashboard/expense/:id",
        element: (
          <AccessRole
            allowedRoles={[AccessRoleEnum.Admin, AccessRoleEnum.Editor]}
          >
            <ExpenseDetails />
          </AccessRole>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default routes;
