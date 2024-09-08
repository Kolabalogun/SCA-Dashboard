import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
} from "@chakra-ui/react";
import { HomeIcon, Menu, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const links = [
    {
      icon: <HomeIcon size={20} />,
      title: "Home",
      link: "/dashboard",
    },
    {
      icon: <Users size={20} />,
      title: "Patients",
      link: "/dashboard/patients",
    },
    // {
    //   icon: <Users size={20} />,
    //   title: "Doctors",
    //   link: "/dashboard/profile",
    // },
    {
      icon: <Users size={20} />,
      title: "Staffs",
      link: "/dashboard/staffs",
    },
    {
      icon: <Users size={20} />,
      title: "Revenue",
      link: "/dashboard/revenue",
    },
    {
      icon: <Users size={20} />,
      title: "Expenses",
      link: "/dashboard/profile",
    },
  ];

  const { pathname } = useLocation();

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>SCA</DrawerHeader>

          <DrawerBody>
            <div className="w-64 bg-gray-800 text-white flex flex-col space-y-4 p-4 md:w-20 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <Link to="/admin/dashboard">
                <p className="hover:bg-gray-700 p-2 rounded">Dashboard</p>
              </Link>
              <Link to="/admin/dashboard/settings">
                <p className="hover:bg-gray-700 p-2 rounded">Settings</p>
              </Link>
              <Link to="/admin/dashboard/profile">
                <p className="hover:bg-gray-700 p-2 rounded">Profile</p>
              </Link>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="blue">Log Out</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="w-32 border-r border-r-gray-600 shadow-md text-white flex justify-between flex-col space-y-12  px-2 items-center pt-8 pb-10 ">
        <div onClick={onOpen} className="mb-10 cursor-pointer">
          <Menu size={24} />
        </div>
        <div className="space-y-9 flex-1">
          {links.map((link, i) => (
            <Link
              key={i}
              className={`flex rounded py-4 px-6 ${
                pathname === link.link
                  ? "bg-gradient-to-r from-[#242a2b] via-[#1d2225] to-[#171b1e]"
                  : "hover:bg-gradient-to-r from-[#242a2b] via-[#1d2225] to-[#171b1e]"
              }     flex-col gap-2 items-center `}
              to={link.link}
            >
              {link.icon}
              <p className="text-xs">{link.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
