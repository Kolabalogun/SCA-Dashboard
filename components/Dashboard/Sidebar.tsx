import Link from "next/link";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { HomeIcon, Menu, MenuSquareIcon, Users } from "lucide-react";

const Sidebar = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>SCA</DrawerHeader>

          <DrawerBody>
            <div className="w-64 bg-gray-800 text-white flex flex-col space-y-4 p-4 md:w-20 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <Link href="/admin/dashboard">
                <p className="hover:bg-gray-700 p-2 rounded">Dashboard</p>
              </Link>
              <Link href="/admin/dashboard/settings">
                <p className="hover:bg-gray-700 p-2 rounded">Settings</p>
              </Link>
              <Link href="/admin/dashboard/profile">
                <p className="hover:bg-gray-700 p-2 rounded">Profile</p>
              </Link>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="blue">Log Out</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="w-32 bg-[#0d0f10] shadow-md text-white flex justify-between flex-col space-y-12  px-4 items-center pt-8 pb-10 ">
        <div onClick={onOpen} className="mb-10 cursor-pointer">
          <Menu size={24} />
        </div>
        <div className="space-y-12 flex-1">
          <Link
            className="flex flex-col gap-2 items-center"
            href="/admin/dashboard"
          >
            <HomeIcon size={24} />
            <p className="text-sm">Home</p>
          </Link>
          <Link
            className="flex flex-col gap-2 items-center"
            href="/admin/dashboard/patients"
          >
            <Users size={24} />
            <p className="text-sm">Patients</p>
          </Link>
          <Link
            className="flex flex-col gap-2 items-center"
            href="/admin/dashboard/profile"
          >
            <HomeIcon size={24} />
            <p className="text-sm">Doctors</p>
          </Link>
          <Link
            className="flex flex-col gap-2 items-center"
            href="/admin/dashboard/profile"
          >
            <HomeIcon size={24} />
            <p className="text-sm">Staffs</p>
          </Link>
          <Link
            className="flex flex-col gap-2 items-center"
            href="/admin/dashboard/profile"
          >
            <HomeIcon size={24} />
            <p className="text-sm">Revenue</p>
          </Link>
          <Link
            className="flex flex-col gap-2 items-center"
            href="/admin/dashboard/profile"
          >
            <HomeIcon size={24} />
            <p className="text-sm">Expenses</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
