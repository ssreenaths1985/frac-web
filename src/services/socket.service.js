import { APIS, APP, LANG } from "../constants";
import { authHeader } from "../helpers/authHeader";
import { UserService } from "./user.service";
import axios from "axios";
import Notify from "../helpers/notify";

/**
 * Socket service
 * Provides API functions, returns
 * data required for the live collaboration
 */

export const SocketService = {
  addUpdateSession,
  getAllSessions,
  deleteSession,
};

function addUpdateSession(sid, username, email, userid, room, message) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_COLLAB_NODE_URL + APIS.SESSION.CREATE,
    method: APP.REQUEST.POST,
    headers: authHeader(),
    data: JSON.stringify({ sid, username, email, userid, room, message }),
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

function getAllSessions() {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_COLLAB_NODE_URL + APIS.SESSION.GET_ALL_SESSIONS,
    method: APP.REQUEST.POST,
    headers: authHeader(),
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

function deleteSession(_id) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_COLLAB_NODE_URL + APIS.SESSION.DELETE,
    method: APP.REQUEST.DELETE,
    headers: authHeader(),
    data: JSON.stringify({ _id }),
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
    UserService.logout();
    const error =
      LANG.APIERROR || (response && response.message) || response.statusText; //Ignoring server side error and using end user readable message
    return Promise.reject(new Error(error));
  }
  return response;
}
