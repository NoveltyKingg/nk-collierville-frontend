export const FormatRegistrationData = (data, isAddNewStore) => {
  const formData = new FormData()
  !isAddNewStore && formData.append('firstName', data?.firstName.trim())
  !isAddNewStore && formData.append('LastName', data?.lastName.trim())
  !isAddNewStore && formData.append('phone', data?.mobileNumber.trim())
  !isAddNewStore && formData.append('email', data?.emailAddress.trim())
  formData.append('storeName', data?.storeName.trim())
  formData.append('address1', data?.storeAddress1.trim())
  data?.store?.storeAddress2 &&
    formData.append('address2', data?.storeAddress2.trim())
  formData.append('city', data?.city)
  formData.append('state', data?.state)
  formData.append('country', data?.country)
  formData.append('zipCode', data?.zipcode)
  data?.store?.storeEmail &&
    formData.append('storeEmail', data?.storeEmail.trim())
  data?.store?.storeMobileNumber &&
    formData.append('storePhone', data?.storeMobileNumber.trim())
  formData.append('documents', data?.taxId[0]?.originFileObj)
  formData.append('documents', data?.drivingLicense[0]?.originFileObj)
  data?.tobaccoLicense &&
    formData.append('documents', data?.tobaccoLicense[0]?.originFileObj)

  return formData
}
