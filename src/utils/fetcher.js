import axios from "axios";
import qs from "qs";
import Auth from "../common/apis/Auth";
/**
 * To configure if the error is language code or raw string
 */

async function reactQueryFetcher(requestConfig) {
  try {
    axios.interceptors.request.use(
      (config) => {
        const token = Auth.getLocalAccessToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // preserve response object in case it is needed from where the request has been made
    const response = await axios({
      ...requestConfig,
      paramsSerializer: {
        serialize: (params) =>
          qs.stringify(params, { arrayFormat: "brackets" }),
      },
    });

    const { data } = response;
    return {
      error: false,
      data,
      response,
    };
  } catch (err) {
    if(err?.message === 'Network Error') {
      return {
        error: true,
        errorObj: err?.response?.data.detail || "Seems like you are not connected with internet. Please try again!",
      };
    }

    if(err?.message === 'ERR_TIMED_OUT') {
      return {
        error: true,
        errorObj: err?.response?.data.detail || "ERR_TIMED_OUT!! The webpage might be temporarily down, or it may have moved permanently to a new web address. Please try again!",
      };
    }

    const { status, data } = err?.response;

    if (status === 401 || status === 403) {
      Auth.reLogin();
    }

    return {
      error: true,
      errorObj: data.detail,
    };
  }
}

export default reactQueryFetcher;