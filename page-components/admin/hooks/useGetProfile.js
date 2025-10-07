import useRequest from '@/request'

const useGetProfile = ({ userId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )
  const getProfile = async ({ storeId }) => {
    try {
      await trigger({
        params: {
          storeId,
        },
        url: `/user/${userId}/profile`,
      })
    } catch (error) {
      console.error(error, 'error')
    }
  }

  return { getProfile, data, loading }
}

export default useGetProfile
