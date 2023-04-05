import { useMutation } from "react-query";
import axiosInstance from "services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IParams {
  url: string;
  payload?: any;
  token?: boolean;
  ifFormData?: boolean;
}

const post = async ({
  url,
  payload,
  token = false,
  ifFormData = false,
}: IParams) => {
  let headers = {};

  const accessToken = AsyncStorage.getItem("access_token");

  if (token)
    headers = {
      Authorization: `Bearer ${accessToken}`,
    };

  let finalPayload;

  if (ifFormData) {
    const formData = new FormData();

    Object.keys(payload).forEach((item: string) =>
      formData.append(item, payload[item])
    );
    finalPayload = formData;
  } else finalPayload = payload;
  const { data } = await axiosInstance.post(url, finalPayload, { headers });

  return data;
};

const usePost = () => useMutation(post);

export default usePost;
