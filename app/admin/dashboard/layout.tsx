"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import React, { ReactNode, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import Header from "@/components/Dashboard/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useSelector((state: any) => state.auth);

  console.log(user);

  useEffect(() => {
    !user && redirect("/");
  }, [user]);

  return (
    <div className="flex text-white min-h-screen w-full">
      <Sidebar isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <div className="    flex-1 h-full min-h-screen overflow-y-scroll  ">
        <Header />

        <main className=" max-w-[1600px] mx-auto   p-6">{children}</main>
      </div>
    </div>
  );
}
