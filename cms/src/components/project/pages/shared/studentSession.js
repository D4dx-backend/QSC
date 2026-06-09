export const getStoredStudentSession = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export const getStoredStudentRegistrationId = () => {
  const session = getStoredStudentSession();
  return session?.examRegistrationId || session?.user?.examRegistrationId || session?.student?.id || "";
};

export const getStoredStudentUserId = () => {
  const session = getStoredStudentSession();
  return session?.userId || session?.user?._id || "";
};

export const getStoredStudentProfile = () => {
  const session = getStoredStudentSession();
  const user = session?.user || {};
  const student = session?.student || {};

  return {
    name: user?.fullName || user?.userDisplayName || user?.name || student?.name || "Student",
    mobile: user?.mobile || student?.mobile || "",
    regno: user?.regno || student?.regno || "",
    examRegistrationId: getStoredStudentRegistrationId(),
    userId: getStoredStudentUserId(),
    registeredExam: student?.registeredExam || "",
    registeredExamShortName: student?.registeredExamShortName || "",
  };
};

export const resolveAssetUrl = (asset) => {
  if (!asset) {
    return "";
  }

  if (/^https?:\/\//i.test(asset)) {
    return asset;
  }

  const cdnBase = import.meta.env.VITE_APP_CDN || import.meta.env.VITE_CDN || "";
  return `${cdnBase}${asset}`;
};