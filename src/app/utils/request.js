import { message as AntdMessage } from "antd";
import axios from "axios";
import Router from "next/router";

const CreateAxiosInstance = (config = {}) => {
  const instance = axios.create({
    timeout: 5000,
    ...config,
  });

  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      const { status, data, message } = response;
      if (status === 200) {
        return data;
      } else if (status === 401) {
        return Router.push("/login");
      } else {
        AntdMessage.error(message || "伺服器異常");
      }
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        if (Router.pathname !== "/login") {
          Router.replace("/login");
        }
        return Promise.reject(error);
      }
      AntdMessage.error(error?.response?.data?.message || "伺服器異常");
      return Promise.reject(error);
    }
  );

  return instance;
};

export default CreateAxiosInstance({});
