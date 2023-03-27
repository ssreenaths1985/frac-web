import Auth from "./auth";
import CryptoJS from "crypto-js";
import { APIS } from "../constants";

export function authSSO() {
  let userToken = localStorage.getItem("user");
  let wid, bytes;

  bytes = CryptoJS.AES.decrypt(localStorage.getItem("wid"), "igotcheckIndia*");

  wid = bytes.toString(CryptoJS.enc.Utf8);

  if (userToken && wid) {
    return {
      authorization: "bearer " + Auth.get("authToken"),
      accept: "application/json, text/plain, */*",
      "access-control-allow-origin": "*",
      hostpath: window.env.REACT_APP_FRAC_PROXY_URL,
      org: "dopt",
      rootorg: "igot",
      wid: wid,
    };
  } else if (userToken && wid === null) {
    return {
      authorization: "bearer " + Auth.get("authToken"),
      accept: "application/json, text/plain, */*",
      "access-control-allow-origin": "*",
      hostPath: window.env.REACT_APP_FRAC_PROXY_URL,
      org: "dopt",
      rootorg: "igot",
      wid: "",
    };
  } else {
    return {
      Accept: "application/json, text/plain, */*",
      "access-control-allow-origin": "*",
      org: "dopt",
      rootorg: "igot",
    };
  }
}

export function customAuthHeader(value) {
  if (value === APIS.DEPARTMENTS.GET_ALL_DEPARTMENTS) {
    return {
      "Content-Type": "application/json",
      "Authorization": window.env.REACT_APP_FRAC_USER_API_KEY
    };
  }
  if (value === APIS.GET_USER_ROLES) {
    return {
      "Content-Type": "application/json",
      "Authorization": window.env.REACT_APP_FRAC_USER_API_KEY,
      "x-authenticated-user-token": Auth.get("authToken")
    };
  }
}