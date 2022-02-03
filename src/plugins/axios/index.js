import axios from "axios";
import router from "@/router";

const api = axios.create(
    {
  baseURL: "http://dev1.itpw.ru:8004/",
  headers: {
    Authorization: localStorage.getItem("token") ? "Bearer " + localStorage.getItem("token") : null,
  },

});
api.interceptors.response.use(undefined, (error) => {
  if (error.response && error.response.status === 401) {
    router.push({path:'login'})
  }

});


export default api;
