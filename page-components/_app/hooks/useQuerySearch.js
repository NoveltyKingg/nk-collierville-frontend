import { message } from "antd";
import useRequest from "@/request";

const useQuerySearch = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: "GET", url: "/product/search" },
    { manual: true }
  );

  const querySearch = async (query) => {
    try {
      await trigger({
        params: {
          query,
        },
      });
    } catch (err) {
      console.error(err);
      message.error(err?.data?.message || "Something Went Wrong");
    }
  };

  return {
    querySearch,
    queryData: data,
    queryLoading: loading,
    queryTrigger: trigger,
  };
};

export default useQuerySearch;
