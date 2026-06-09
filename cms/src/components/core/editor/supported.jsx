import { CopyIcon } from "lucide-react";

const SupportedVariables = ({ supportedVariables }) => {
  return (
    supportedVariables?.length > 0 && (
      <div className="flex flex-row gap-2 text-sm p-2">
        Supported Variables :
        {supportedVariables.map((variable) => (
          <div
            className="bg-gray-100 hover:bg-gray-200 p-1 text-xs rounded-md cursor-pointer relative group flex items-center gap-1 transition-all duration-200"
            onClick={() => {
              navigator.clipboard.writeText(`{${variable}}`);
            }}
            key={variable}
          >
            <span>{`{${variable}}`}</span>
            <CopyIcon size={12} className="text-gray-600" />
            <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
              Click to copy
              <div className="absolute h-2 w-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default SupportedVariables;
