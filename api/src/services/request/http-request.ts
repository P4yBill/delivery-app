import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const HttpRequest = {
    get: async <T = any>(url: string, config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await axios.get<T>(url, config);
    }
};

export default HttpRequest;