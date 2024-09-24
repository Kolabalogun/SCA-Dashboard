import { Header, Sidebar } from "@/components/dashboard";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="flex text-white  h-screen w-full">
      <Sidebar />
      <div className="  border-l-gray-600 remove-scrollbar  flex-1 h-full min-h-screen overflow-y-scroll  ">
        <Header />

        <main className=" max-w-[1600px] mx-auto  py-6 px-3  xl:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
