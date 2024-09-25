import axios from "axios";

export const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});


instance.interceptors.request.use(
  async function (config) {
    const result = await chrome.storage.local.get(['accessToken'])
    config.headers.Authorization = `Bearer ${result['accessToken']}`;
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);