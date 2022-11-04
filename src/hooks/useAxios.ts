// Having problems with Axios version 1.1.2
// Here use Axios version 0.27.2

import axios, { AxiosRequestConfig } from "axios";
import { useAuthContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:8000";
// const BASE_URL = ''; // For Heroku deployment

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosWithCredential = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allow to send cookies with request
});

export default function useAxios() {
  const { auth, refreshToken } = useAuthContext();

  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (!config.headers!["authorization"]) {
        config.headers!["authorization"] = `Bearer ${auth?.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const newAccessToken = await refreshToken();
        prevRequest.headers["authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
