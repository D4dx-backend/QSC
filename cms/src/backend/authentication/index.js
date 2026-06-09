// we are storing the token in the local storage its using only when we use auth token instead of bearer token

const GetAccessToken = () => {
  try {
    let accessToken = "";
    if (localStorage.getItem("user")) {
      const obj = JSON.parse(localStorage.getItem("user"));
      accessToken = `${obj?.token} ${obj?.refreshToken} ${obj?.userId}`;
    }
    return accessToken;
  } catch (error) {
    return "";
  }
};
const SetAccessToken = (token) => {
  try {
    if (localStorage.getItem("user")) {
      console.log("Token Updated");
      const obj = JSON.parse(localStorage.getItem("user"));
      obj.token = token;
      localStorage.setItem("user", JSON.stringify(obj));
    }
  } catch (error) {
    return "";
  }
};
export { GetAccessToken, SetAccessToken };
