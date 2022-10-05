import React from "react";
import { FaUser } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <div className="w-screen flex flex-row py-2.5 bg-slate-50 border-b border-slate-200 justify-center items-center">
      <div className="w-full container flex flex-row justify-between items-center">
        <div className=""></div>
        <div className=""></div>
        <div className="flex flex-row justify-center items-center space-x-3">
          <FaUser size={16} color={"#A3ACB9"} />
        </div>
      </div>
    </div>
  );
};

export default Header;
