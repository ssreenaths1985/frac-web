import { APIS, APP, LANG } from "../constants";
import axios from "axios";
import Notify from "../helpers/notify";
import { authSSO } from "../helpers/authSSO";

/**
 * Review service
 * Provides API functions, returns
 * data required for the review
 */

export const ReviewService = {
  getVerificationList,
  getVerificationListWoDept,
  verifyNode,
  getNodeDetailsWithSimilarities,
  getVerificationListWoDeptWoUserType,
  filterReviewNodes,
};

function getVerificationList(type, dept) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.REVIEW.GET_VERIFICATION_LIST +
      `${type}` +
      APIS.NODES.GET_ALL_NODES_FOR_DEPARTMENT +
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

function getVerificationListWoDept(type, userType) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.REVIEW.GET_VERIFICATION_LIST +
      `${type}` +
      APIS.REVIEW.USER_TYPE +
      `${userType}`,
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

function getVerificationListWoDeptWoUserType(type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.REVIEW.GET_VERIFICATION_LIST +
      `${type}`,
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

function verifyNode(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.REVIEW.VERIFY,
    method: APP.REQUEST.POST,
    headers: authSSO(),
    data: data,
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

function getNodeDetailsWithSimilarities(id, type, flag) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.REVIEW.GET_SIMILAR +
      `${id}` +
      APIS.REVIEW.GET_SIMILAR_TWO +
      `${type}` +
      APIS.REVIEW.GET_SIMILAR_THREE +
      `${flag}`,
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

function filterReviewNodes(data) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.REVIEW.FILTER_REVIEW_NODE,
    method: APP.REQUEST.POST,
    headers: authSSO(),
    data: data,
  }
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
