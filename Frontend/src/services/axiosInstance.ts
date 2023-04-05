import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

export const countryInstance = axios.create({
  baseURL: process.env.REACT_APP_COUNTRY_API_BASE_URL,
});

export default instance;
