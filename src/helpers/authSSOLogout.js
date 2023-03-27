import Auth from "./auth";

export function authSSOLogout() {
  let userToken = localStorage.getItem("token");
  let refreshToken = localStorage.getItem("refreshToken");
  if (userToken && refreshToken) {
    return {
      Authorization: "bearer " + Auth.get("authToken"),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "aapplication/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
      client_id: "portal",
      refresh_token: refreshToken
    };
  } else {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "aapplication/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
      client_id: "portal",
      refresh_token: refreshToken
    };
  }
}
