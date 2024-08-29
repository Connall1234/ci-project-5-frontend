import axios from "axios";
axios.defaults.baseURL = "https://project-5-backend-api-connall-3eb143768597.herokuapp.com/";
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

//This is for our axios to connect to our backend
export const axiosReq = axios.create();
export const axiosRes = axios.create();