import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="admin-header mb-10">
      <Link href="/" className="cursor-pointer">
        <div className="flex gap-4 items-center flex-row">
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

      <p className="text-16-semibold">Admin Dashboard</p>
    </header>
  );
};

export default Header;
