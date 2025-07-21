import Axios from "axios";

const request = Axios.create();

request.interceptors.request.use((oldAxiosConfig) => {
  const { ...axiosConfig } = oldAxiosConfig;

  axiosConfig.timeout = 300000;

  axiosConfig.paramsSerializer = {
    indexes: false,
  };

  axiosConfig.baseURL = process.env.NEXT_PUBLIC_REST_BASE_API_URL;

  return axiosConfig;
});

request.interceptors.response.use(
  (response) => ({
    hasError: false,
    data: response?.data,
    status: response?.status,
  }),
  async (error) => {
    if (error.response) {
      const { status } = error?.response || {};

      if (status !== 200) {
        const res = error?.response?.data;
        return Promise.reject({ status, data: res, hasError: true });
      }
    }
    return Promise.reject(error);
  }
);

export default request;
