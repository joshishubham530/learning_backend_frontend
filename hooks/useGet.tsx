import { useQuery } from "react-query";
import axiosInstance from "../services";

const useGet = (key: string, url: string) => {
  console.log("key", key);
  console.log("url", url);
  const get = async () => {
    try {
      const { data } = await axiosInstance.get(url);

      return data;
    } catch (e) {
      console.log("e", e);
    }
  };
  return useQuery(key, get);
};

export default useGet;
