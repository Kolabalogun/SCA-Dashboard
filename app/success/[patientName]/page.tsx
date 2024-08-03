import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const Success = ({ params: { patientName } }: SearchParamProps) => {
  const decodedPatientName = decodeURIComponent(patientName);
  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <div className="flex gap-4 items-center flex-row   ">
            <Image
              src={"/assets/icons/logo-icon.svg"}
              alt="logo"
              height={24}
              width={24}
              className="  h-10 w-fit"
            />
            <h1 className="font-bold text-3xl">SCA</h1>
          </div>
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Patient <span className="text-green-500">{decodedPatientName}</span>{" "}
            has been successfully registered!
          </h2>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/dashboard`}>Go to Dashboard</Link>
        </Button>

        <Button variant="outline" className="shad-secondary-btn" asChild>
          <Link href={`/dashboard`}>Add New Patient</Link>
        </Button>

        <p className="copyright">© 2024 Shayofunmi Care Agency</p>
      </div>
    </div>
  );
};

export default Success;
