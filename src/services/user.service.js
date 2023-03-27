import { APIS, APP, LANG } from "../constants";
import { authHeader } from "../helpers/authHeader";
import { authSSO, customAuthHeader } from "../helpers/authSSO";
import { authSSOLogout } from "../helpers/authSSOLogout";
import axios from "axios";
import Notify from "../helpers/notify";

/**
 * User service
 * Provides API functions, returns
 * data required for the users management
 */

export const UserService = {
  login,
  logout,
  getUserDetails,
  getRoles,
  ssoLogout,
  ssoLogoutTwo,
};

function login(username, password) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_LOGIN_API_URL + APIS.LOGIN,
    method: APP.REQUEST.POST,
    headers: authHeader(),
    data: {
      username,
      password,
    },
  };

  return axios(requestOptions)
    .then(handleResponse)
    .catch((err) => {
      if (err.message.includes(401)) {
        Notify.error(LANG.STATUSCODE.UNAUTHORIZED);
      } else {
        Notify.error(err.message);
      }
    });
}

function logout() {
  localStorage.clear();
}

function getUserDetails() {
  const requestOptions = {
    url: "https://" + window.env.REACT_APP_FRAC_PROXY_URL + APIS.KEYCLOAK_WTOKEN,
    method: APP.REQUEST.GET,
    headers: authSSO(),
  };
  return axios(requestOptions)
    .then(handleResponse)
    .catch((err) => {
      if (err.message.includes(401)) {
        Notify.error(LANG.STATUSCODE.UNAUTHORIZED);
      } else {
        Notify.error(err.message);
      }
    });
}

function getRoles(wid) {
  const requestOptions = {
    url:
      "https://" +
      window.env.REACT_APP_FRAC_PROXY_URL +
      APIS.GET_USER_ROLES +
      `${wid}`,
    method: APP.REQUEST.GET,
    headers: customAuthHeader(APIS.GET_USER_ROLES),
  };
  return axios(requestOptions)
    .then(handleResponse)
    .catch((err) => {
      if (err.message.includes(401)) {
        Notify.error(LANG.STATUSCODE.UNAUTHORIZED);
      } else {
        Notify.error(err.message);
      }
    });
}

function ssoLogout() {
  const requestOptions = {
    url: APIS.KEYCLOAK_LOGOUT,
    method: APP.REQUEST.GET,
    headers: authSSO(),
  };
  return axios(requestOptions)
    .then(handleResponse)
    .catch((err) => {
      if (err.message.includes(401)) {
        Notify.error(LANG.STATUSCODE.UNAUTHORIZED);
      } else {
        Notify.error(err.message);
      }
    });
}

function ssoLogoutTwo() {
  const requestOptions = {
    url: APIS.KEYCLOAK_LOGOUT_ONE,
    method: APP.REQUEST.GET,
    headers: authSSOLogout(),
  };
  return axios(requestOptions)
    .then(handleResponse)
    .catch((err) => {
      if (err.message.includes(401)) {
        Notify.error(LANG.STATUSCODE.UNAUTHORIZED);
      } else {
        Notify.error(err.message);
      }
    });
}

function handleResponse(response) {
  if (response.status === 401) {
    logout();
    const error =
      LANG.APIERROR || (response && response.message) || response.statusText; //Ignoring server side error and using end user readable message
    return Promise.reject(new Error(error));
  }
  return response;
}
