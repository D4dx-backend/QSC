import { useState } from "react";
import { Title as TitleElement } from "../../../elements";
import { GetIcon } from "../../../../../icons";
import { getValue } from "../../functions";
import { Pencil } from "lucide-react";

export const DisplayInformations = ({ editingHandler, attributes, data, formMode, popupMenu, style = "style1" }) => {
  const [showImage, setShowImage] = useState(false);

  const EditButton = () => (
    <button onClick={editingHandler} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors duration-200 w-full">
      <Pencil className="w-4 h-4" />
      <span>Edit Details</span>
    </button>
  );

  const renderStyle1 = () => {
    return (
      <div className={`m-0 ${popupMenu}`}>
        <div className={`flex flex-col flex-1 ${formMode}`}>
          {attributes.map((attribute, index) => {
            if (attribute.view) {
              try {
                const itemValue = attribute.collection?.length > 0 && attribute.showItem?.length > 0 ? data[attribute.collection][attribute.showItem] : data[attribute.name];

                console.log(`Rendering attribute ${index}:`, {
                  attribute,
                  itemValue,
                });

                return (
                  <div key={index} className={`text-left m-0 p-1 relative flex justify-between border-b border-gray-200 gap-2.5 ${attribute.type}`}>
                    <span className="text-sm font-normal leading-5 tracking-[-0.006em] text-left flex gap-4 items-center text-gray-600 [&>svg]:w-[16px] [&>svg]:h-[16px] [&>svg]:font-size-[16px]">
                      {attribute.icon?.length > 0 && <GetIcon icon={attribute.icon} />}
                      <span className="min-w-[150px] max-w-[150px]">{attribute.label}</span>
                    </span>
                    {attribute.type === "image" ? (
                      <span className="text-sm font-medium leading-[16.94px] tracking-[-0.006em] text-right">
                        {getValue(attribute, itemValue, true, false, (src) => {
                          setShowImage(src);
                        })}
                      </span>
                    ) : (
                      <span className="text-sm font-medium leading-[16.94px] tracking-[-0.006em] text-right">{getValue(attribute, itemValue, true)}</span>
                    )}
                  </div>
                );
              } catch (error) {
                console.error("Error rendering attribute:", attribute, error);
                return (
                  <div key={index} className="text-left m-0 p-1 relative flex justify-between border-b border-gray-200 gap-2.5">
                    <span className="text-sm font-normal leading-5 tracking-[-0.006em] text-left flex gap-1.25 items-center text-gray-600">{attribute.label}</span>
                    <span className="text-sm font-medium leading-[16.94px] tracking-[-0.006em] text-right">--</span>
                  </div>
                );
              }
            }
            if (attribute.type === "title") {
              return (
                <div key={index} className="col-span-full mb-5 border-b border-gray-200 pb-2 text-left pt-5">
                  <TitleElement line={false} icon={attribute.icon} title={attribute.title} />
                </div>
              );
            }
            return null;
          })}
          <div className="mt-6 px-4">
            <EditButton />
          </div>
        </div>
        {showImage && <ImagePopup onClose={() => setShowImage(null)} src={showImage.src} />}
      </div>
    );
  };

  const renderStyle2 = () => (
    <div className={`m-0 ${popupMenu} bg-white rounded-xl shadow-[0px_1px_3px_rgba(16,24,40,0.1),0px_1px_2px_rgba(16,24,40,0.06)]`}>
      <div className={`grid grid-cols-2 gap-5 p-0 ${formMode}`}>
        {attributes.map((attribute, index) => {
          if (attribute.view) {
            try {
              const itemValue = attribute.collection?.length > 0 && attribute.showItem?.length > 0 ? data[attribute.collection][attribute.showItem] : data[attribute.name];

              return (
                <div key={index} className={`flex flex-col gap-2 p-0 ${attribute.type}`}>
                  <span className="text-sm font-medium leading-5 text-gray-500 flex items-center gap-2">
                    {attribute.icon?.length > 0 && <GetIcon icon={attribute.icon} className="w-5 h-5 text-gray-500" />}
                    {attribute.label}
                  </span>
                  {attribute.type === "image" ? (
                    <span className="text-base font-medium leading-6 text-gray-900 text-left">
                      {getValue(attribute, itemValue, true, false, (src) => {
                        setShowImage(src);
                      })}
                    </span>
                  ) : (
                    <span className="text-base font-medium leading-6 text-gray-900 text-left">{getValue(attribute, itemValue, true)}</span>
                  )}
                </div>
              );
            } catch (error) {
              console.error("Error rendering attribute:", attribute, error);
              return (
                <div key={index} className="flex flex-col gap-2 p-0">
                  <span className="text-sm font-medium leading-5 text-gray-500 flex items-center gap-2">{attribute.label}</span>
                  <span className="text-base font-medium leading-6 text-gray-900 text-left">--</span>
                </div>
              );
            }
          }
          if (attribute.type === "title") {
            return (
              <div key={index} className="col-span-full">
                <TitleElement line={false} icon={attribute.icon} title={attribute.title} />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-6 border-t border-gray-100 pt-6">
        <EditButton />
      </div>
      {showImage && <ImagePopup onClose={() => setShowImage(null)} src={showImage.src} />}
    </div>
  );

  const renderStyle3 = () => (
    <div className={`m-0 ${popupMenu} bg-white rounded-xl`}>
      <div className="w-full">
        <div className={`grid grid-cols-2 gap-4 p-0 ${formMode}`}>
          {attributes.map((attribute, index) => {
            if (attribute.view) {
              try {
                const itemValue = attribute.collection?.length > 0 && attribute.showItem?.length > 0 ? data[attribute.collection][attribute.showItem] : data[attribute.name];

                return (
                  <div key={index} className={`border-none p-0 bg-white ${attribute.type}`}>
                    <div className="flex items-start gap-3 w-full">
                      {attribute.icon?.length > 0 ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white border border-gray-200 ${attribute.color || "text-green-600"}`}>
                          <GetIcon icon={attribute.icon} className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex-shrink-0" />
                      )}
                      <div className="flex flex-col gap-0.5 flex-grow">
                        <span className="text-xs font-medium leading-4 text-gray-500">{attribute.label}</span>
                        <span className="text-sm font-medium leading-[18px] text-gray-900 text-left">{attribute.type === "image" ? getValue(attribute, itemValue, true, false, (src) => setShowImage(src)) : getValue(attribute, itemValue, true)}</span>
                      </div>
                    </div>
                  </div>
                );
              } catch (error) {
                console.error("Error rendering attribute:", attribute, error);
                return (
                  <div key={index} className="border-none p-0 bg-white">
                    <div className="flex items-start gap-3 w-full">
                      {attribute.icon?.length > 0 ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white border border-gray-200 ${attribute.color || "text-green-600"}`}>
                          <GetIcon icon={attribute.icon} className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex-shrink-0" />
                      )}
                      <div className="flex flex-col gap-0.5 flex-grow">
                        <span className="text-xs font-medium leading-4 text-gray-500">{attribute.label}</span>
                        <span className="text-sm font-medium leading-[18px] text-gray-900 text-left">--</span>
                      </div>
                    </div>
                  </div>
                );
              }
            }
            if (attribute.type === "title") {
              return (
                <div key={index} className="col-span-full mb-5 mt-2.5">
                  <TitleElement line={true} icon={attribute.icon} title={attribute.title} />
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="mt-6 px-5">
          <EditButton />
        </div>
        {showImage && <ImagePopup onClose={() => setShowImage(null)} src={showImage.src} />}
      </div>
    </div>
  );

  if (style === "style3") {
    console.log("Using style3 renderer");
    return renderStyle3();
  }
  console.log("Using style2 renderer");
  return style === "style2" ? renderStyle2() : renderStyle1();
};
