import { APIS, APP, LANG } from "../constants";
import axios from "axios";
import Notify from "../helpers/notify";
import { authSSO } from "../helpers/authSSO";

/**
 * Chart service
 * Provides API functions, returns
 * data required for the charts
 */

export const ChartService = {
  getChartForReviewer,
};

function getChartForReviewer(type) {
  const requestOptions = {
    url:
      window.env.REACT_APP_FRAC_API_URL + APIS.CHARTS.GET_REVIEW_CHART + `${type}`,
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
