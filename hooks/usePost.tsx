import { useMutation } from "react-query";
import axiosInstance from "../services";

interface IParams {
  url: string;
}

const post = async ({ url }: IParams) => {
  const { data } = await axiosInstance.post(url);
  return data;
};

const usePost = () => useMutation(post);

export default usePost;
