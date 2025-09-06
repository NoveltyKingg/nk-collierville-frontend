const formatCategories = (categoryData) => {
  const subCategories = categoryData?.map((item) => ({
    cat_id: item?.id,
    values: item?.subCategories.map((val) => ({
      value: val?.id,
      label: val?.name,
      imageUrl: val?.imageUrl,
    })),
  }));
  const categories = categoryData?.map((cat) => ({
    label: cat?.name,
    value: cat?.id,
    imageUrl: cat?.bannerUrl,
  }));

  const FILTERS = categoryData?.map((val) => ({
    cat_id: val?.id,
    filters: Object.entries(val?.filters || {}).map(([key, values]) => ({
      key,
      values,
    })),
  }));

  return { SUBCATEGORIES: subCategories, CATEGORIES: categories, FILTERS };
};

export default formatCategories;
