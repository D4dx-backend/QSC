import React from "react";
import ListTableSkeleton from "../loader/shimmer";
import { TrView } from "../list/styles";

const DataTable = ({ headers, children, isLoading, containerClassName = "", headerClassName = "" }) => {
  if (isLoading) {
    return <ListTableSkeleton displayColumn={headers.length} tableColumnCount={10} position="absolute" className="w-8 h-8 animate-spin text-blue-600" />;
  }

  return (
    <div className={`bg-white shadow ${containerClassName}`}>
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <TrView className="border-b border-gray-200">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`
                    px-6 py-4 text-left
                    ${header.width ? `w-[${header.width}]` : ""}
                    ${headerClassName || "bg-gray-50 text-gray-600"}
                    ${index === 0 ? "rounded-l-xl" : ""}
                    ${index === headers.length - 1 ? "rounded-r-xl" : ""}
                  `}
                  style={{ width: header.width }}
                >
                  <span className="text-sm font-medium">{header.label}</span>
                  {header.sublabel && <span className="block text-xs text-gray-500 mt-1">{header.sublabel}</span>}
                </th>
              ))}
            </TrView>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

// Add CSS for the header border radius
const style = document.createElement("style");
style.textContent = `
  th:first-child {
    border-radius: 0.75rem 0 0 0.75rem !important;
  }
  th:last-child {
    border-radius: 0 0.75rem 0.75rem 0 !important;
  }
`;
document.head.appendChild(style);

export default DataTable;
