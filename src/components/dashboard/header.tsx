import { LogoIcon } from "@/assets/icons";
import { Link } from "react-router-dom";
import SidebarDrawer from "./sidebarDrawer";
import { useDisclosure } from "@chakra-ui/react";
import { Menu } from "lucide-react";

const Header = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <header className="admin-header  mb-10">
      <SidebarDrawer onClose={onClose} isOpen={isOpen} />
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

      <p className="text-16-semibold hidden xl:flex">Admin Dashboard</p>

      <div onClick={() => onOpen()} className="  flex xl:hidden cursor-pointer">
        <Menu size={30} />
      </div>
    </header>
  );
};

export default Header;
