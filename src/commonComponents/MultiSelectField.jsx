import { useEffect, useState } from "react";
import IMAGES from "../../src/assets/images";

const MultiSelectField = ({ options, placeholder, onChange, onSelect }) => {

  const [selectedOptions, setSelectedOptions] = useState([]);
  const allSelected = selectedOptions.length === options.length;
  const someSelected = selectedOptions.length > 0 && !allSelected;

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevSelected) => {
      const updatedSelection = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option];

      // Trigger the parent onSelect immediately
      onSelect(updatedSelection);
      return updatedSelection;
    });
  };

  const handleSelectAllChange = () => {
    if (allSelected) {
      setSelectedOptions([]);
      onSelect([]);
    } else {
      setSelectedOptions(options);
      onSelect(options);
    }
  };

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions]);

  return (
    <>
      <div className="w-full">
        <p className="text-xs font-semibold text-grey_700">{placeholder}</p>
        <div className="mb-4 flex items-center p-2 w-full justify-end">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAllChange}
            className="form-checkbox w-3.5 h-3.5 mt-1"
            indeterminate={someSelected.toString()} // Optional: For visual indication of partial selection
          />
          <span className="ml-2  font-medium text-sm h-fit">Select All 🗂️</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-items-start">
          {options.map((option) => (
            <div key={option.id} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="form-checkbox w-3.5 h-3.5"
              />
              <p className="bg-[#00000005] px-2 py-1 rounded-sm lg:text-xs flex items-center gap-1 font-medium ml-2">
                <img
                  src={option.profilePic || IMAGES.ProfilePic}
                  alt=""
                  className="w-8 h-8  object-cover rounded-full"
                />
                {option.name}
                <span className="font-normal text-[#00000040]">
                  {option?.qualification}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MultiSelectField
