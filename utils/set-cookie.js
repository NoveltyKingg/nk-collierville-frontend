import { message } from "antd";

/* eslint-disable */
const setCookie = (name, value, days = 2000, ctx) => {
  try {
    const { res } = ctx || {};
    if (typeof window === "undefined" && res) {
      res.cookie(name, value, { maxAge: days * 24 * 60 * 60 * 1000 });
    } else {
      let expires = "expires=0";
      if (days === 0) {
        // do nothing
      } else {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `expires=${d.toUTCString()}`;
      }
      document.cookie = `${name}=${value};${expires};path=/`;
    }
  } catch (e) {
    console.error(e);
    message.error(e?.data?.message || "Something Went Wrong");
  }
};

export default setCookie;
