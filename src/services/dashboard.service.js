import { APIS, APP, LANG } from "../constants";
import axios from "axios";
import Notify from "../helpers/notify";
import { authSSO, customAuthHeader } from "../helpers/authSSO";

/**
 * Dashboard service
 * Provides API functions, returns
 * data required for the dashboard
 */

export const DashboardService = {
  getCounts,
  getCountsByDept,
  getNodeCount,
  getAllDepartments,
  searchDepartment,
  getCountByUserType,
  getNodeCountByUserType,
};

function getCounts(type) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.DASHBOARD + `${type}`,
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

function getCountByUserType(type, userType) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.DASHBOARD +
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

function getCountsByDept(type, keyword) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.DASHBOARD +
      `${type}` +
      APIS.COUNT_BY_DEPT +
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

function getNodeCount(type, dept, status) {
  let url = window.env.REACT_APP_FRAC_API_URL + APIS.DASHBOARD + `${type}`;
  // if (dept) {
  //   url += APIS.COUNT_BY_DEPT + `${dept}`;
  // }
  if (status) {
    url += APIS.GET_BY_STATUS + `${status}`;
  }
  const requestOptions = {
    url: url,
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

function getNodeCountByUserType(type, status, userType) {
  let url = window.env.REACT_APP_FRAC_API_URL + APIS.DASHBOARD + `${type}`;
  // if (dept) {
  //   url += APIS.COUNT_BY_DEPT + `${dept}`;
  // }
  if (status) {
    url += APIS.GET_BY_STATUS + `${status}`;
  }
  if (userType) {
    url += APIS.REVIEW.USER_TYPE + `${userType}`;
  }
  const requestOptions = {
    url: url,
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

function getAllDepartments() {
  const requestOptions = {
    url:
      "https://" +
      window.env.REACT_APP_FRAC_PROXY_URL +
      APIS.DEPARTMENTS.GET_ALL_DEPARTMENTS,
    method: APP.REQUEST.POST,
    headers: customAuthHeader(APIS.DEPARTMENTS.GET_ALL_DEPARTMENTS),
    data: {
      "request": {
        "filters": {
          "isTenant": true
        },
        "sortBy": {
          "createdDate": "Desc"
        },
        "fields": ["id", "rootOrgId", "orgName", "description"],
        "limit": 1000
      }
    }
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

function searchDepartment(keyword) {
  const requestOptions = {
    url:
      "https://" +
      window.env.REACT_APP_FRAC_PROXY_URL +
      APIS.DEPARTMENTS.GET_ALL_DEPARTMENTS,
    method: APP.REQUEST.POST,
    headers: customAuthHeader(APIS.DEPARTMENTS.GET_ALL_DEPARTMENTS),
    data: {
      "request": {
        "filters": {
          "isTenant": true,
          "orgName": keyword
        },
        "sortBy": {
          "createdDate": "Desc"
        },
        "fields": ["id", "rootOrgId", "orgName", "description"],
        "limit": 1000
      }
    }
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
