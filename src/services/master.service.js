import { APIS, APP, LANG } from "../constants";
import axios from "axios";
import Notify from "../helpers/notify";
import { authSSO } from "../helpers/authSSO";

/**
 * Master service
 * Provides API functions, returns
 * data required for the collections
 */

export const MasterService = {
  appendMapNodes,
  getNodesByTypeAndDept,
  getNodesByType,
  addDataNode,
  addDataNodes,
  getDataByNodeId,
  mapNodes,
  getChildForParent,
  searchNodes,
  getParentNode,
  deleteNode,
  getCommentForNode,
  postComment,
  getRatingForNode,
  getAverageRating,
  postRating,
  getCompetencyAreaListWithDetails,
  filterNodes,
  getActivityLogs,
  getFeedback,
  postFeedback,
  postBulkData,
  getSourceList,
  cloudStorage,
  deleteCloudFile,
  getPropertyListWithCount,
};

function getNodesByTypeAndDept(type, dept) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_ALL_NODES_FOR_TYPE +
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

function getNodesByType(type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_ALL_NODES_FOR_TYPE +
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

function addDataNode(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.ADD_DATA_NODE,
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

function addDataNodes(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.ADD_DATA_NODES,
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

function getDataByNodeId(id, type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_NODE_BY_ID_ONE +
      `${id}` +
      APIS.NODES.GET_NODE_BY_ID_TWO +
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

function mapNodes(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.MAP_NODES,
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

function getChildForParent(id, type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_CHILD_NODES_FOR_PARENT_ONE +
      `${id}` +
      APIS.NODES.GET_CHILD_NODES_FOR_PARENT_TWO +
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

function searchNodes(data) {
  data.tool = "FRAC";
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.SEARCH_NODES,
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

function appendMapNodes(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.APPEND_MAP_NODES,
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

function getParentNode(id, type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_PARENT_NODE_ONE +
      `${id}` +
      APIS.NODES.GET_PARENT_NODE_TWO +
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

function deleteNode(id, type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.DELETE_NODE_ONE +
      `${id}` +
      APIS.NODES.DELETE_NODE_TWO +
      `${type}`,
    method: APP.REQUEST.DELETE,
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

function getCommentForNode(type, id) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_COMMENT_ONE +
      `${type}` +
      APIS.NODES.GET_COMMENT_TWO +
      `${id}`,
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

function postComment(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.COMMENT_NODE,
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

function getRatingForNode(type, id) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_NODE_RATING_ONE +
      `${type}` +
      APIS.NODES.GET_NODE_RATING_TWO +
      `${id}`,
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

function postRating(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.RATE_NODE,
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

function postFeedback(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.FEEDBACK.POST_NODE_FEEDBACK,
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

function postBulkData(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.CREATE_BULK_NODE,
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

function getFeedback(type, id, isUser) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.FEEDBACK.GET_NODE_FEEDBACK +
      `${type}` +
      APIS.NODES.GET_AVERAGE_RATING_TWO +
      `${id}` +
      APIS.FEEDBACK.NODE_USER +
      `${isUser}`,
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

function getAverageRating(type, id) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_AVERAGE_RATING_ONE +
      `${type}` +
      APIS.NODES.GET_AVERAGE_RATING_TWO +
      `${id}`,
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

function getCompetencyAreaListWithDetails() {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.GET_COMPETENCY_AREA_LISTING,
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

function filterNodes(data) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.FILTER_NODES,
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

function getActivityLogs(id, type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_ACTIVITY_LOGS_ID +
      `${id}` +
      APIS.NODES.GET_ACTIVITY_LOGS_TYPE +
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

function getSourceList(type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL +
      APIS.NODES.GET_SOURCE_LIST +
      `${type}`,
    method: APP.REQUEST.GET,
    headers: authSSO(),
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

function cloudStorage(formData) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.CLOUD_STORAGE,
    method: APP.REQUEST.POST,
    headers: authSSO(),
    data: formData,
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

function deleteCloudFile(fileName) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.DELETE_CLOUD_FILE + fileName,
    method: APP.REQUEST.DELETE,
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

function getPropertyListWithCount(type) {
  const requestOptions = {
    url: window.env.REACT_APP_FRAC_API_URL + APIS.NODES.GET_PROPERTY_COUNT_LIST + `${type}`,
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
