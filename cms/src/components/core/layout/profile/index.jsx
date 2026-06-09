import { useDispatch } from "react-redux";
import { clearLogin } from "../../../../store/actions/login";
import { generateThumbnail } from "../../functions/string";
import { Settings, LogOut, Mail, Shield, ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileSettings from "../../settings";
import moment from "moment";

const ProfileBar = ({ user, setLoaderBox, setMessage, close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[998]" onClick={() => close()} />

      {/* Profile Popup */}
      <div className="absolute right-0 top-5 mt-2 w-72 bg-bg-white rounded-lg shadow-xl border border-stroke-soft/10 overflow-hidden z-[999]">
        {/* Header with gradient background */}
        <div className="relative h-24 bg-gradient-to-br from-primary-base via-primary-base/95 to-primary-base/80 flex items-center px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-md border-2 border-bg-white shadow-sm bg-bg-white/90 flex items-center justify-center overflow-hidden relative">
                <span className="text-lg font-medium text-primary-base">{generateThumbnail(user?.fullName ?? user?.username ?? "", 2)}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-state-success rounded-full border-2 border-bg-white" />
            </div>
            <div className="text-bg-white">
              <p className="text-sm font-normal opacity-90">Welcome back,</p>
              <p className="font-medium">{user?.fullName ?? user?.username ?? "Admin"}</p>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft/40">
            <Mail className="w-5 h-5 text-primary-base" />
            <div>
              <p className="text-xs font-medium text-text-sub uppercase tracking-wide">Email Address</p>
              <p className="text-sm text-text-main">{user?.email ?? "No Email"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft/40">
            <Shield className="w-5 h-5 text-primary-base" />
            <div>
              <p className="text-xs font-medium text-text-sub uppercase tracking-wide">Account Type</p>
              <p className="text-sm text-text-main capitalize">{user?.userType?.role ?? "No Role"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft/40">
            <Calendar className="w-5 h-5 text-primary-base" />
            <div>
              <p className="text-xs font-medium text-text-sub uppercase tracking-wide">Member Since</p>
              <p className="text-sm text-text-main">{moment(user.createdAt).format("MMMM YYYY")}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4">
          <button
            onClick={() => {
              setIsSettingsOpen((prev) => !prev);
            }}
            className="w-full flex items-center justify-between p-3 text-sm text-text-main hover:bg-bg-soft/50 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary-base" />
              <span className="font-medium">Account Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-text-sub transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => {
              dispatch(clearLogin());
              navigate("/");
            }}
            className="w-full mt-2 flex items-center justify-between p-3 text-sm text-[#FF3B30] hover:bg-[#FF3B30]/5 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-75 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <ProfileSettings
          onClose={() => {
            setIsSettingsOpen(false);
            close();
          }}
        />
      )}
    </>
  );
};

export default ProfileBar;
