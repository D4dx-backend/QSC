import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GetIcon } from "../../../../icons";
import { MoreVerticalIcon } from "lucide-react";

const getMenuItems = ({ showDeleteInDotMenu, showEditInDotMenu, showCloneInDotMenu, data, titleValue, itemTitle, slNo, signleRecord, clonePrivilege, updatePrivilege, delPrivilege, actionElements, updateHandler, deleteHandler, refreshUpdate, openAction, formInput, setMessage, setUpdateId, setSubAttributes, setShowSubList, isEditingHandler, udpateView, getValue }) => {
  const items = [];

  // Clone action
  if (clonePrivilege && showCloneInDotMenu) {
    items.push({
      icon: "clone",
      label: "Clone",
      onClick: (event) => {
        event?.stopPropagation();
        setUpdateId(data._id);
        setMessage({
          type: 2,
          content: `Do you want to clone '${getValue({ type: itemTitle.type ?? "text" }, titleValue) ? getValue({ type: itemTitle.type ?? "text" }, titleValue) : "Item"}'?`,
          proceed: "Clone",
          onProceed: async () => {
            await updateHandler(
              {
                cloneId: data._id,
                _title: titleValue,
                clone: true,
              },
              formInput,
              data
            );
          },
          data: data,
        });
      },
    });
  }

  // Edit action
  if (updatePrivilege && showEditInDotMenu) {
    items.push({
      icon: "edit",
      label: "Edit",
      onClick: (event) => {
        event?.stopPropagation();
        isEditingHandler(data, udpateView, titleValue);
      },
    });
  }

  // Custom actions
  actionElements?.dotmenu?.forEach((item, index) => {
    let status = true;
    if (item.condition) {
      if (data[item.condition.item]?.toString() === item.condition?.if?.toString()) {
        status = item.condition.then;
      } else {
        status = item.condition.else;
      }
    }
    if (status) {
      items.push({
        icon: item.icon,
        label: item.title,
        onClick: (event) => {
          event?.stopPropagation();
          if (item.type === "callback") {
            item.callback(item, data, refreshUpdate, slNo);
          } else if (item.type === "call") {
            window.location.href = `tel:${data.mobileNumber}`;
          } else if (item.type === "subList" || item.type === "subItem") {
            setSubAttributes({ item, data });
            setShowSubList(true);
          } else {
            openAction(item, data);
          }
        },
      });
    }
  });

  // Delete action
  if (delPrivilege && showDeleteInDotMenu) {
    // Add separator if there are other items
    if (items.length > 0) {
      items.push({ type: "separator" });
    }

    items.push({
      icon: "delete",
      label: "Delete",
      variant: "danger",
      onClick: (event) => {
        event?.stopPropagation();
        setMessage({
          type: 2,
          content: `Do you want to delete '${getValue({ type: itemTitle.type ?? "text" }, titleValue) ? getValue({ type: itemTitle.type ?? "text" }, titleValue) : "Item"}'?`,
          proceed: "Delete",
          onProceed: async () => {
            await deleteHandler(data, data._id);
          },
          data: data,
        });
      },
    });
  }

  return items;
};

export const ThreeDotMenu = ({ items, triggerClassName, menuClassName }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={`
          w-8 h-8 p-1
          flex items-center justify-center
          rounded-md border-none
          bg-transparent hover:bg-gray-50
          focus:outline-none focus-visible:ring-0
          // focus-visible:ring-blue-500 focus-visible:ring-offset-2
          data-[state=open]:bg-gray-100
          ${triggerClassName}
        `}
        aria-label="Menu"
      >
        <MoreVerticalIcon className="w-[18px] h-[18px] text-gray-500 transition-colors duration-200" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={`
            min-w-[180px] p-1
            bg-white rounded-lg
            shadow-lg border border-gray-200
            z-[2000]
            animate-in fade-in-0 zoom-in-95
            data-[side=bottom]:slide-in-from-top-2 
            data-[side=top]:slide-in-from-bottom-2
            ${menuClassName}
          `}
          sideOffset={5}
          align="end"
          alignOffset={-5}
        >
          {items.map((item, index) => {
            if (item.type === "separator") {
              return <DropdownMenu.Separator key={index} className="h-px bg-gray-200 my-1" />;
            }

            if (item.type === "header") {
              return (
                <DropdownMenu.Label key={index} className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase">
                  {item.label}
                </DropdownMenu.Label>
              );
            }

            return (
              <DropdownMenu.Item
                key={index}
                onClick={item.onClick}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-2 px-2 py-1.5
                  text-sm text-left rounded-md
                  transition-colors duration-200
                  outline-none select-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                  data-[highlighted]:bg-gray-50
                  data-[disabled]:pointer-events-none
                 [&>svg]:w-4 [&>svg]:h-4  
                  ${item.variant === "danger" ? "text-red-600 data-[highlighted]:bg-red-50" : "text-gray-700"}
                `}
              >
                {item.icon && <GetIcon icon={item.icon} className="w-4 h-4 flex-shrink-0" />}
                <span className="flex-1">{item.label}</span>
                {item.endIcon && (
                  <span className="ml-auto">
                    <GetIcon icon={item.endIcon} className="w-4 h-4 flex-shrink-0" />
                  </span>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { getMenuItems };
