import React, { useEffect, useRef, useState } from "react";
import { Container, HeaderMenu, Logo, Status, Title } from "./styels";
import ProfileBar from "../profile";
import { logo } from "../../../../images";
import { GetIcon } from "../../../../icons";
import { avathar } from "../../../../images";
import SearchMenu from "./SearchMenu";
const Header = (props) => {
  const [isProfileBarOpen, setIsProfileBarOpen] = useState(false);
  const profileRef = useRef(null);
  const { user } = props;
  // Function to handle clicks outside of the Profile component
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileBarOpen(false);
    }
  };

  // Add a click event listener when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Toggle the ProfileBar when clicking the Profile
  const handleProfileClick = () => {
    setIsProfileBarOpen(!isProfileBarOpen);
  };
  // const navigate = useNavigate();
  return (
    <Container className={isProfileBarOpen ? "profile-open" : ""}>
      {/* <Title
        className="navicon"
        onClick={() => {
          dispatch(menuStatus(!menuCurrentStatus));
        }}
      >
        <GetIcon icon={"menu"} />
      </MNav> */}

      <Status>
        {/* <MNav>
          <GetIcon icon={selectedMenuItem.icon} />
        </MNav> */}
        <Title>
          <Logo src={logo} alt="logo" />
        </Title>
        <div className="flex-1 flex justify-end pr-4">
          <SearchMenu />
        </div>
        <HeaderMenu
          ref={profileRef}
          onClick={() => {
            handleProfileClick();
          }}
        >
          <div className="flex items-center gap-2 p-2 rounded-md">
            <img className="w-6 h-6 rounded-full" src={user.photo?.length > 5 ? `${import.meta.env.VITE_CDN}${user.photo}` : avathar} alt="profile" />
            <i className="hidden md:block">{user?.fullName ?? user?.username}</i>
          </div>
          <GetIcon icon={"down-small"}></GetIcon>
          {isProfileBarOpen && (
            <div className="ProfileBar" onClick={(e) => e.stopPropagation()}>
              <ProfileBar close={() => setIsProfileBarOpen(false)} setLoaderBox={props.setLoaderBox} setMessage={props.setMessage} user={user}></ProfileBar>
            </div>
          )}
        </HeaderMenu>
      </Status>
    </Container>
  );
};

export default Header;
