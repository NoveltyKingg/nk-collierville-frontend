import React from "react";
import { LoginIcon, SearchIcon } from "@/assets/common";
import { Input } from "@heroui/react";

const Header = () => {
  return (
    <div className="w-full bg-main text-white min-h-12 flex items-center justify-between px-4 py-2">
      <div>Novelty King Icon</div>
      <div className="flex flex-row items-center gap-12">
        <div className="flex flex-row items-center gap-4">
          <div className="cursor-pointer border-r-1 border-[#ff8540] pr-4">
            {" "}
            Shop All
          </div>
          <div className="cursor-pointer border-r-1 border-[#ff8540] pr-4">
            About
          </div>
          <div className="cursor-pointer ">Contact</div>
        </div>
        <div className="flex items-center gap-4 cursor-pointer">
          <Input
            type="search"
            placeholder="Search..."
            size="sm"
            variant="underlined"
            isClearable
            className="placeholder-[#ffffff]"
            startContent={<SearchIcon />}
          />
          <div>
            <LoginIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
