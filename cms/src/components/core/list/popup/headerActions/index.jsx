import { GetIcon } from "../../../../../icons";

const HeaderActions = ({ actions, openData }) => {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action) => {
        return (
          <div key={action.label} className="border border-light-gray-300 rounded-md h-[32px] p-2 flex items-center gap-2 hover:text-primary-base cursor-pointer text-[14px] [&>svg]:text-light-gray-300 [&>svg]:hover:text-primary-base group" onClick={() => action.onClick(openData)}>
            <GetIcon icon={action.icon} />
            <span className="hidden sm:inline"> {action.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderActions;
