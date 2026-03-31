import React, { useEffect, useState } from "react";
import SubjectMenu from "./SubjectMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAdmin } from "../../../context/AdminContext";

const DataRow = (props) => {

  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  }

  const toggleEditeMenu = () => {
    return props.editSubject(props);
  }

  const { allLevels } = useAdmin();
  const [level, setLevel] = useState("");

  useEffect(() => {


    allLevels.map((item) => {
      if (item.id == props.levelID) {
        setLevel(item.name);
      }
    })

  }, [])

  return (
    <>
      <div className="min-w-full">
        <div
          style={{ backgroundColor: props.bgColor }}
          className={`min-w-full border-b flex border-grey items-center`}
        >
          <div className="flex flex-row items-center flex-1 py-[6px] my-1 md:pl-3 md:pr-5 ">
            <p
              className={`w-full md:flex-[1] flex-[1] md:text-[14px] text-[11px] text-center md:text-left ${props.header ? "font-semibold" : ""
                }`}
            >
              {props.index + "."}
            </p>
            <p
              className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center md:text-[14px] text-[11px] ${props.header ? "font-semibold" : ""
                }`}
            >
              {props.subjectName}
            </p>
            <p
              className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center md:text-[14px] text-[11px] ${props.header ? "font-semibold" : ""
                }`}
            >
              {props.levelName}
            </p>
          </div>
          <div className="flex ml-3 mr-2 lg:mr-5 cursor-pointer">
            <p
              onClick={() => {
                toggleMenu();
              }}
              className={`w-full my-1 md:my-0 text-center md:text-center md:text-[20px] text-[14px] ${props.header ? "hidden" : ""
                }`}
            >
              {menu && <SubjectMenu
                isopen={menu}
                editSubject={toggleEditeMenu}
                deleteSubject={() => props.deleteSubject(props.data.id)}
                setIsOpen={setMenu}
              />}
              <BsThreeDotsVertical />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataRow;
