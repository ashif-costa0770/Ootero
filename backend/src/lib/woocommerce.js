import axios from "axios";
import { decrypt } from "../utils/encryption.js";

const createWooClient = (store) => {
  return axios.create({
    baseURL: `${store.storeUrl}/wp-json/wc/v3`,
    auth: {
      username: decrypt(store.consumerKey),
      password: decrypt(store.consumerSecret),
    },
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
  });
};

export default createWooClient;