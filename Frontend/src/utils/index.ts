import AsyncStorage from "@react-native-async-storage/async-storage";

const isSuccess = "access_token";

export const login = (data: string) => {
  AsyncStorage.setItem(isSuccess, data);
};

export const logout = () => {
  AsyncStorage.removeItem(isSuccess);
};

export const isLogin = async () => {
  if (await AsyncStorage.getItem(isSuccess)) {
    return true;
  }

  return false;
};
