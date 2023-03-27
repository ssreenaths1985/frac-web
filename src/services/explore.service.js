import { APIS, APP, LANG } from "../constants";
import { authSSO } from "../helpers/authSSO";
import axios from "axios";
import Notify from "../helpers/notify";

/**
 * Explore service
 * Provides API functions, returns
 * data required for the explore
 */

export const ExploreService = {
  exploreAllNodes,
  exploreAllNodesDept,
  searchNodes,
  searchNodesDept,
};

function exploreAllNodes() {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.EXPLORE_ALL_NODES,
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

function exploreAllNodesDept(dept) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.EXPLORE_ALL_NODES +
      APIS.NODES.EXPLORE_ALL_NODES_DEPT +
      `${dept}`,
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

function searchNodes(keyword) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.SEARCH_NODES_EXPLORE +
      `${keyword}`,
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

function searchNodesDept(keyword, dept) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.SEARCH_NODES_EXPLORE +
      `${keyword}` +
      APIS.NODES.SEARCH_NODES_EXPLORE_DEPT +
      `${dept}`,
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

function handleResponse(response) {
  if (response.status === 401) {
    const error =
      LANG.APIERROR || (response && response.message) || response.statusText; //Ignoring server side error and using end user readable message
    return Promise.reject(new Error(error));
  }
  return response;
}
