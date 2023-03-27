import Auth from "./auth";

export function authHeader() {
  let userToken = localStorage.getItem("user");
  if (userToken) {
    return {
      "Authorization": "Bearer " + Auth.get("authToken"),
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept"
    };
  } else {
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept"
    };
  }
}
