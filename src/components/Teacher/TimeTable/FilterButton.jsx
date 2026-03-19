import React from "react";
import { HiOutlineCalendarDays } from "react-icons/hi2";

export default function FilterButton({
  icon,
  text,
  clickHandler,
  className,
  disabled,
}) {
  return (
    <button
      className={`text-sm sm:text-lg text-white py-2 rounded-3xl flex gap-1 justify-center bg-[#6A00FF] ${className}`}
      onClick={clickHandler}
      disabled={disabled ? disabled : false}
    >
       {icon? 
       <HiOutlineCalendarDays size={25} /> 
      : <></>} 
      {text}
    </button>
  );
}
