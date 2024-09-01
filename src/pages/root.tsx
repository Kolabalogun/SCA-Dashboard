import { Header, Sidebar } from "@/components/dashboard";
import { useDisclosure } from "@chakra-ui/react";

import { Outlet } from "react-router-dom";

export default function Root() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex text-white  h-screen w-full">
      <Sidebar isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <div className="    flex-1 h-full min-h-screen overflow-y-scroll  ">
        <Header />

        <main className=" max-w-[1600px] mx-auto   p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
