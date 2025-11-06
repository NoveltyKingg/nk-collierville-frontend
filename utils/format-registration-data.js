export const FormatRegistrationData = (data, isAddNewStore) => {
  const formData = new FormData()

  if (!isAddNewStore) {
    if (data?.firstName) formData.append('firstName', data.firstName.trim())
    if (data?.lastName) formData.append('lastName', data.lastName.trim())
    if (data?.mobileNumber) formData.append('phone', data.mobileNumber)
    if (data?.email) formData.append('email', data.email.trim())
  }

  if (data?.storeName) formData.append('storeName', data.storeName.trim())
  if (data?.storeAddress1)
    formData.append('address1', data.storeAddress1.trim())
  if (data?.storeAddress2)
    formData.append('address2', data.storeAddress2.trim())
  if (data?.city) formData.append('city', data.city)
  if (data?.state) formData.append('state', data.state)
  if (data?.country) formData.append('country', data.country)
  if (data?.zipCode) formData.append('zipCode', data.zipCode)
  if (data?.storeEmail) formData.append('storeEmail', data.storeEmail.trim())
  if (data?.storeMobileNumber)
    formData.append('storePhone', data.storeMobileNumber)

  const tax = data?.taxId?.[0]?.originFileObj
  const dl = data?.drivingLicense?.[0]?.originFileObj
  const tob = data?.tobaccoLicense?.[0]?.originFileObj

  if (tax) formData.append('documents', tax, 'tax-id.pdf') // constant name
  if (dl) formData.append('documents', dl, 'drivers-license.pdf') // constant name
  if (tob) formData.append('documents', tob, 'tobacco-license.pdf') // constant name

  return formData
}
