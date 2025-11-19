import React, { useEffect, useState } from 'react'
import { FloatButton } from 'antd'
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

const Layout = ({ children, layout }) => {
  const { getAllWebCategories } = useGetAllWebCategories()
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)
  const [openBarcodeScanner, setOpenBarcodeScanner] = useState(false)
  const [barcode, setBarcode] = useState(null)
  const { isMobile } = useIsMobile()
  const { push } = useRouter()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
    push('/login')
  }

  const LICENSE_KEY =
    'pjHhzYwVGOycuaz9Vr/IwOZNVFgMta' +
    'RPPFoIGxdvIdzPST4qP9jnBFuEVIBo' +
    'sKArmowREsUJxT3t9BpHkrzPIMJzoP' +
    '/pUPf02JUImtOJtRQlaOS+x1sNIGhT' +
    'mJIbJ+qYLSHOiGAVMTEwuOKebg+ed+' +
    'tH2r72u49TztZjyt/sHrmDZBio2ARQ' +
    'pFKOJIR/v4q6DEuBxNDKRa8Smp0Nan' +
    'VHOqGPtOZOnIHogNffkvZMsEX8BCCa' +
    'rqiIHW7pj3JXBiqjx823D62Rg3NTqa' +
    'dGO/CSqosXiwSN1JCVZwKdZM01CyLw' +
    '3JtXjD1UkvUu8tclo5Wl8Ph0oRJw+z' +
    'mgYuD5MJIqhA==\nU2NhbmJvdFNESw' +
    'psb2NhbGhvc3QKMTc2NDAyODc5OQo4' +
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
          <FloatButton
            icon={<ScanOutlined />}
            onClick={() => setOpenBarcodeScanner((prev) => !prev)}
          />
          {isMobile && layout && (
            <MobileFooter
              profile={profile}
              onAddStore={toggleAddStore}
              onLogout={logout}
            />
          )}
        </div>
      </div>

      {openBarcodeScanner && (
        <BarcodeScanner
          isModalOpen={openBarcodeScanner}
          setIsModalOpen={setOpenBarcodeScanner}
          setBarcode={setBarcode}
          licenseKey={LICENSE_KEY}
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
