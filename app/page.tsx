import LoginForm from "@/components/forms/LoginForm";
import { PatientForm } from "@/components/forms/PatientForm";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* OTP  */}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] ">
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

          <LoginForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-500 xl:text-left">
              © 2024 Shayofunmi Care Agency
            </p>
            <Link href={"/?admin=true"} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src={"/assets/images/onboarding-img.png"}
        alt="screen"
        height={1000}
        width={1000}
        className="side-img max-w-[50%] "
      />
    </div>
  );
}
