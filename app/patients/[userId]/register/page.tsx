import { getDocument } from "@/api";
import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const PatientRegistration = async ({
  params: { userId },
}: SearchParamProps) => {
  const patient = await getDocument(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <div className="flex gap-4 items-center flex-row mb-12 ">
            <Image
              src={"/assets/icons/logo-icon.svg"}
              alt="logo"
              height={24}
              width={24}
              className="  h-10 w-fit"
            />
            <h1 className="font-bold text-3xl">SCA</h1>
          </div>

          <RegisterForm user={patient} />

          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default PatientRegistration;
