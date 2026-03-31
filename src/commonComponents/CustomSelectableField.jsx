const CustomSelectableField = ({ label, options, setSelectedOption, selectedOption }) => {
  return (
    <div className='flex flex-col text-start py-1'>
      <div className='flex flex-col gap-1'>
        <div className='font-normal text-sm'>
          {label}
        </div>
        <div>
          <select
            value={typeof selectedOption === 'object' ? JSON.stringify(selectedOption) : selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className='border text-sm text-grey/70 outline-none rounded-md border-black/20 px-4 w-full py-2'
          >
            <option value={""}>Select</option>
            {options?.map((item) => {
              return (
                <option key={item.id} value={JSON.stringify(item)}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomSelectableField; // Default Export
