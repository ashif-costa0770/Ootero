import axios from "axios";

export const verifyWooCommerce = async ({ url, key, secret }) => {
  try {
    const response = await axios.get(
      `${url}/wp-json/wc/v3/system_status`,
      {
        auth: {
          username: key,
          password: secret
        }
      }
    );

    return response.status === 200;
  } catch (err) {
    return false;
  }
};