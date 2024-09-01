import { LogoIcon } from "@/assets/icons";
import { OnboardingBg } from "@/assets/images";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] ">
          <div className="flex gap-4 items-center flex-row mb-12 ">
            <img
              src={LogoIcon}
              alt="logo"
              height={24}
              width={24}
              className="h-10 w-fit"
            />
            <h1 className="font-bold text-3xl">SCA</h1>
          </div>

          {children}

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-500 xl:text-left">
              © 2024 Shayofunmi Care Agency
            </p>
            <Link to={"/dashboard"} className="text-green-500">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <img
        src={OnboardingBg}
        alt="screen"
        height={1000}
        width={1000}
        className="side-img max-w-[50%] "
      />
    </div>
  );
};

export default AuthLayout;
