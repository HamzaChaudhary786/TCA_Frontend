import { GoPerson } from "react-icons/go";

export const CusotmInput = ({ label, value, status, icon, inputChange }) => {
    return (
        <div className="text-sm">
            <div className="flex flex-col gap-2">
                <p className="">{label}</p>
                <div
                    className={`flex px-2 py-1 border justify-between rounded-md items-center border-grey/70 ${status ? "text-black" : "text-grey"
                        }`}
                >
                    <input
                        onChange={(e) => { inputChange(e.target.value) }}
                        type="text"
                        readOnly={!status}
                        className="py-1 outline-none"
                        placeholder={`Enter ${label}`}
                        value={value}
                    />
                    {icon}
                </div>
            </div>
        </div>
    );
};
