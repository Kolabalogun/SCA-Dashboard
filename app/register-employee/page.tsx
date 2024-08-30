"use client";

import CreateEmployeeForm from "@/components/forms/CreateEmployeeForm";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function RegisterEmployee() {
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    !user && redirect(`/`);
  }, [user]);

  return (
    <div className="flex h-screen max-h-screen">
      {/* OTP  */}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] ">
          <Image
            src={"/assets/icons/logo-icon.svg"}
            alt="logo"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />

          <CreateEmployeeForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-500 xl:text-left">
              © 2024 Shayofunmi Care Agency
            </p>
          </div>
        </div>
      </section>

      <Image
        src={"/assets/images/createmployee.jpg"}
        alt="screen"
        height={1000}
        width={1000}
        className="side-img max-w-[50%] "
      />
    </div>
  );
}
