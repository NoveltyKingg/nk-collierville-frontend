import React, { useEffect, useState } from 'react'
import { FloatButton, Modal, Button, Image, App } from 'antd'
import SideBarMenu from './sidebar-menu'
import Footer from './footer'
import useGetAllWebCategories from '../hooks/useGetAllWebCategories'
import AddNewStore from './add-new-store'
import useIsMobile from '@/utils/useIsMobile'
import MobileFooter from './mobile-footer'
import MobileHeader from './mobile-header'
import setCookie from '@/utils/set-cookie'
import { useRouter } from 'next/router'
import useGetContext from '@/common/context/useGetContext'
import { ScanOutlined } from '@ant-design/icons'
import BarcodeScanner from '@/utils/barcode-scanner'
import useAddToCartByBarcode from '../hooks/useAddToCartByBarcode'
import AddQuantityModal from './add-quantity-modal'

const Layout = ({ children, layout }) => {
  const { getAllWebCategories } = useGetAllWebCategories()
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)
  const [openBarcodeScanner, setOpenBarcodeScanner] = useState(false)
  const [barcode, setBarcode] = useState(null)
  const { isMobile } = useIsMobile()
  const { push } = useRouter()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}
  const [openModal, setOpenModal] = useState(
    !(sessionStorage.getItem('age_verified') || profile?.isLoggedIn),
  )
  const [openQuantityModal, setOpenQuantityModal] = useState(false)
  const [quantityAdded, setQuantityAdded] = useState(1)

  const { message } = App.useApp()

  const { addToCartByBarcode, addToCartData, addToCartLoading } =
    useAddToCartByBarcode()

  const handleOk = () => {
    sessionStorage.setItem('age_verified', true)
    setOpenModal(false)
  }

  const handleCancel = () => {
    setOpenModal(false)
    push('/underage')
  }

  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
    push('/login')
  }

  const handleAddToCart = () => {
    if (barcode?.barcode) {
      addToCartByBarcode({
        barcode: barcode?.barcode,
        quantity: quantityAdded,
        storeId: profile?.storeId,
        setBarcode,
        setQuantityAdded,
      })
      setOpenQuantityModal((prev) => !prev)
    } else {
      message.error('No Barcode Scanned')
    }
  }

  useEffect(() => {
    if (barcode?.barcode) setOpenQuantityModal((prev) => !prev)
  }, [barcode])

  const LICENSE_KEY =
    'n9/EMSn9/C3yJ+T01kNB0an8zzxuII' +
    'bKQUWSjJfNi01zHZkOcQ7N43RWqz2g' +
    'HSdKLfi2rK9AQWEiNUOAXZ/qAry+ei' +
    'qWsE0ycikDbmcB9F0m4+zThGSTrvVt' +
    '/JBdfVKxAkktw3A5PDMgkqCFkSwZ0G' +
    'PWymf2Ewf6DuByY/GnTSr+BlAn22X1' +
    'yu83s7U1EOvUcKqD2nDDfFkZNk90VH' +
    'tiPjI1/vV27lUh8rXODmBTBHFdf+95' +
    'qiiDLsL+L2YnPMP5hsasPG21kILhQy' +
    '1797NSr8WUdTcVwy9H9o8q/5w3IHnz' +
    'Dy7DcjMsvdhcoCkyzBdneHV4zye1Hn' +
    'v9kWbDkZyNyw==\nU2NhbmJvdFNESw' +
    'psb2NhbGhvc3QKMTc2NDg5Mjc5OQo4' +
    'Mzg4NjA3Cjg=\n'

  useEffect(() => {
    getAllWebCategories()
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-[#f5f5f5]'>
      {layout && isMobile && (
        <div className='sticky top-0 z-50'>
          <MobileHeader profile={profile} />
        </div>
      )}

      <div className='flex flex-1'>
        {layout && !isMobile && <SideBarMenu />}
        <div className='flex-1 min-w-0'>
          <main>{children}</main>
          {layout && <Footer />}
          {layout && profile?.isLoggedIn && (
            <FloatButton
              icon={<ScanOutlined />}
              onClick={() => setOpenBarcodeScanner((prev) => !prev)}
            />
          )}
          {isMobile && layout && (
            <MobileFooter
              profile={profile}
              onAddStore={toggleAddStore}
              onLogout={logout}
            />
          )}
        </div>
      </div>

      {openModal && (
        <Modal
          title='Age Verification'
          open={openModal}
          footer={null}
          closeIcon={null}>
          <div className='flex flex-col gap-2 text-[16px]'>
            <div className='text-red'>18+ Adults Only!</div>
            <div className='text-red'>Underage Sale Prohibited!</div>
            <Image
              src='https://i.ibb.co/wNq9n1WL/Untitled-450-x-150-px.png'
              alt='Loading...'
              width='100%'
              style={{ maxWidth: 450 }}
              preview={false}
            />
            <p>
              Please verify that you are 18 years of age or older. By entering
              this site you are stating that you are of legal age to purchase,
              handle, and own products. Use at your own risk.
            </p>
            <div className='flex gap-2'>
              <Button type='primary' onClick={handleOk}>
                Yes, I am 18 or older
              </Button>
              <Button onClick={handleCancel}>No, I am under 18</Button>
            </div>
          </div>
        </Modal>
      )}
      {openBarcodeScanner && profile?.isLoggedIn && (
        <BarcodeScanner
          isModalOpen={openBarcodeScanner}
          setIsModalOpen={setOpenBarcodeScanner}
          setBarcode={setBarcode}
          licenseKey={LICENSE_KEY}
        />
      )}

      {openQuantityModal && (
        <AddQuantityModal
          open={openQuantityModal}
          onCancel={() => setOpenQuantityModal((prev) => !prev)}
          quantityAdded={quantityAdded}
          setQuantityAdded={setQuantityAdded}
          handleOk={handleAddToCart}
        />
      )}

      {openAddNewStoreModal && (
        <AddNewStore
          openAddStore={openAddNewStoreModal}
          handleClose={toggleAddStore}
        />
      )}
    </div>
  )
}

export default Layout
