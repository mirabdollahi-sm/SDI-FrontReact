import { axiosPrivateDownload } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivateDownload = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivateDownload.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axiosPrivateDownload.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivateDownload(prevRequest);
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosPrivateDownload.interceptors.response.eject(requestIntercept);
            axiosPrivateDownload.interceptors.response.eject(responseIntercept);
        }
    },[auth, refresh])

    return axiosPrivateDownload;
}

export default useAxiosPrivateDownload;