export const setFormValues = (form, data, setFileList) => {
  form.setFieldValue('storeName', data?.storeName)
  form.setFieldValue('address1', data?.address1)
  form.setFieldValue('address2', data?.address2)
  form.setFieldValue('state', data?.state)
  form.setFieldValue('country', data?.country)
  form.setFieldValue('city', data?.city)
  form.setFieldValue('zipCode', data?.zipCode)
  form.setFieldValue('storeEmail', data?.storeEmail)
  form.setFieldValue('storeMobileNumber', data?.storeMobileNumber)
  form.setFieldValue('documents', data?.documentUrls)
  const uploadedImages = data?.documentUrls?.map((item, idx) => ({
    key: idx,
    name: item.split('/')[item.split('/').length - 1],
    status: 'done',
    url: item,
  }))
  setFileList(uploadedImages)
}
