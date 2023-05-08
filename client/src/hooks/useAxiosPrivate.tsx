import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { AxiosRequestConfig, isAxiosError } from "axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

interface AxiosRetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (isAxiosError(error)) {
          const originalRequest = error.config as AxiosRetryConfig;

          // TODO: Test the hasSent ref
          if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refresh();

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axiosPrivate(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
