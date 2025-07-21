import { makeUseAxios } from "axios-hooks";

import request from "./helpers/request";

const commonConfig = {
  cache: false,
  defaultOptions: {
    ssr: false,
    manual: true,
  },
};

const useRequest = makeUseAxios({
  axios: request,
  ...commonConfig,
});

export default useRequest;
