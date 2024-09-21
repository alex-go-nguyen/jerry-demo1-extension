import axios from "axios";

export const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});

instance.interceptors.request.use(
  function (config) {
    config.withCredentials = true;
    return config;
  },
);

instance.interceptors.response.use(
  function (response) {
    // console.log(response);
    return response;
  },
  function (error) {
    // console.log(error); 
    return Promise.reject(error);
  }
);