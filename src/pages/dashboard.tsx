/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSelector } from "react-redux";
import { useAppContext } from "@/contexts/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { ExpensesIcon, PatientsIcon, Revenue, Staff } from "@/assets/images";

import Activities from "@/components/dashboard/activities";
import { AccessRole } from "@/types/types";

const Dashboard = () => {
  const { user } = useSelector((state: any) => state.auth);

  const { adminData } = useAppContext();

  return (
    <div className=" flex flex-col space-y-14">
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header capitalize">Welcome {user?.firstName} 👋</h1>
          <p className="text-dark-700">Start the day with managing patients</p>
        </section>

        <section className="w-full   justify-between gap-5 xl:space-y-0 space-y-6   xl:gap-10 xl:grid grid-cols-2">
          <StatCard
            type="appointments"
            count={adminData?.totalPatients || 0}
            label="Total Patients"
            icon={PatientsIcon}
          />

          {AccessRole.Admin === user?.accessRole && (
            <>
              <StatCard
                type="pending"
                count={`₦${parseInt(
                  adminData?.totalRevenue || 0
                )?.toLocaleString()}`}
                label="Total Revenue"
                icon={Revenue}
              />
              <StatCard
                type="cancelled"
                count={`₦${parseInt(
                  adminData?.totalExpenses || 0
                )?.toLocaleString()}`}
                label="Total Expenditure"
                icon={ExpensesIcon}
              />
            </>
          )}
          <StatCard
            type="cancelled"
            count={adminData?.totalStaffs || 0}
            label="Total Staffs"
            icon={Staff}
          />
        </section>

        <Activities />
      </main>
    </div>
  );
};

export default Dashboard;
