
const CustomMultiSelectableField = ({
  label,
  options = [],
  selectedOption = [],
  setSelectedOption,
  isMulti = false,
  loading = false,
}) => {
  const toggleSelection = (value) => {
    if (selectedOption.includes(value)) {
      setSelectedOption(selectedOption.filter((v) => v !== value));
    } else {
      setSelectedOption([...selectedOption, value]);
    }
  };

  return (
    <div className="flex flex-col py-1 text-start">
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
        {loading ? (
          <div className="flex justify-center items-center py-2 h-full gap-2">
            <span className="text-gray-500 text-sm">No options available</span>

          </div>
        ) : options.length > 0 ? (
          options.map((item) => (
            <label
              key={item.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedOption.includes(item.id)}
                onChange={() => toggleSelection(item.id)}
                className="accent-blue-500"
              />
              <span className="text-sm text-gray-800">{item.name}</span>
            </label>
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm py-2">
            classes Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMultiSelectableField;
