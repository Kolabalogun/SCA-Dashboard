import { LogoIcon } from "@/assets/icons";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="admin-header mb-10">
      <Link to="/" className="cursor-pointer">
        <div className="flex gap-4 items-center flex-row">
          <img
            src={LogoIcon}
            alt="logo"
            height={24}
            width={24}
            className="  h-10 w-fit"
          />
          <h1 className="font-bold text-3xl">SCA</h1>
        </div>
      </Link>

      <p className="text-16-semibold">Admin Dashboard</p>
    </header>
  );
};

export default Header;
