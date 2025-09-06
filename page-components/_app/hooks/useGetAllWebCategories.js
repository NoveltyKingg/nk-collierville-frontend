import useRequest from "@/request";
import formatCategories from "@/utils/format-categories";
import { message } from "antd";
import useGetContext from "@/common/context/useGetContext";
import axios from "axios";

const useGetAllWebCategories = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: "get", url: "category/web/getAll" },
    { manual: true }
  );

  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext();

  const getAllWebCategories = async () => {
    try {
      const triggerData = await trigger();
      const { CATEGORIES, SUBCATEGORIES } = formatCategories(triggerData?.data);
      dispatchData(AVAILABLE_ACTIONS.SET_GENERAL, {
        categories: CATEGORIES,
        subCategories: SUBCATEGORIES,
      });
    } catch (error) {
      if (axios.isCancel(error) || error?.name === "CanceledError") {
        console.log("Request cancelled:", error.message);
      } else {
        console.error("error: ", error);
        message.error(error?.data?.message || "Unable to fetch categories");
      }
    }
  };

  return {
    getAllWebCategories,
    categoriesData: data,
    categoriesLoading: loading,
  };
};

export default useGetAllWebCategories;
