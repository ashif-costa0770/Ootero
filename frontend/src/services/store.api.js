import api from "../lib/api";


export const connectStore = async (data) =>
  api.post("/store/connect", data);

