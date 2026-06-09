import { useSelector } from "react-redux";
import { ElementContainer, MultiTabs } from "../elements";
import { ProfileBanner } from "./styles";
import { useEffect, useState } from "react";
import ChangePassword from "./changepassword";
import PopupView from "../popupview";
import customSettings from "../../project/settings";
import { projectSettings } from "../../project/brand/project";
import { avathar } from "../../../images";
import PricingTable from "../../public/signup/pricingTable";
const ProfileSettings = (props) => {
  const themeColors = useSelector((state) => state.themeColors);
  const user = useSelector((state) => state.login);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    document.title = `Profile - ${projectSettings.title}`;
    setUserData(user.data.user);
  }, [user]);
  return (
    userData && (
      <PopupView
        // Popup data is a JSX element which is binding to the Popup Data Area like HOC
        popupData={
          <ElementContainer className="custom column">
            <ProfileBanner className="bg-gradient-to-br from-primary-base via-primary-base/95 to-primary-base/80" theme={themeColors}>
              <div className="data">
                <img className="m-4 w-14 h-14 rounded-full" src={userData.photo?.length > 5 ? `${import.meta.env.VITE_CDN}${userData.photo}` : avathar} alt="profile" />
                <div className="address">
                  <div className="text-lg font-semibold">{userData.fullName ?? userData.name ?? "No Found"}</div>
                  <div className="text-sm ">{userData.email ?? "No Found"}</div>
                  <div className="text-sm">{userData.userType.role ?? "No Found"}</div>
                </div>
              </div>
            </ProfileBanner>
            <MultiTabs
              tabs={[
                ...customSettings(userData),
                {
                  name: `a-unique-name-for-tab-2`,
                  title: "Security",
                  content: <ChangePassword />,
                  icon: "security",
                },
                {
                  name: `a-unique-name-for-tab-3`,
                  title: "Subscription",
                  content: <PricingTable size="small" />,
                  icon: "subscription",
                },
              ]}
            ></MultiTabs>
          </ElementContainer>
        }
        themeColors={themeColors}
        closeModal={() => props.onClose()}
        itemTitle={{ name: "title", type: "text", collection: "" }}
        // openData={openItemData} // Pass selected item data to the popup for setting the time and taking menu id and other required data from the list item
        openData={{
          data: {
            _id: "print_preparation",
            title: "Profile Settings",
          },
        }}
        customClass={"small"}
      ></PopupView>
    )
  );
};
export default ProfileSettings;
