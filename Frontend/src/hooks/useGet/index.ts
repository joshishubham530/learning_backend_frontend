/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import axiosInstance from "services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IParams {
  key?: any;
  url?: any;
  configs?: any;
  token?: boolean;
  fetchCountry?: string;
  api?: string;
  data?: any;
}

const useGet = ({ key, url, configs, token = false }: IParams) => {
  const get = async () => {
    let headers = {};
    const accessToken = await AsyncStorage.getItem("access_token");

    if (token)
      headers = {
        Authorization: `Bearer ${accessToken}`,
      };

    const { data } = await axiosInstance.get(url, { headers });

    return data;
  };

  const defaultConfig = {
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...configs,
  };

  return useQuery(key, get, defaultConfig);
};

export default useGet;
