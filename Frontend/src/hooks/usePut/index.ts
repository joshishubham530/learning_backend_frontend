/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import axiosInstance from "services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IParams {
  url: string;
  payload?: any;
  token?: boolean;
}

const put = async ({ url, payload, token = false }: IParams) => {
  let headers = {};
  const authToken = AsyncStorage.getItem("access_token");

  if (token) {
    headers = {
      Authorization: `Bearer ${authToken}`,
    };
  }

  const { data } = await axiosInstance.put(url, payload, { headers });

  return data;
};

const usePatch = () => useMutation(put);

export default usePatch;
