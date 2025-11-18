'use client'
import { useState, useEffect, useRef } from 'react'
import { Modal, Button, App } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import useIsMobile from './useIsMobile'

const BarcodeScanner = ({
  licenseKey,
  setBarcode,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isScanning, setIsScanning] = useState(false)
  const [sdk, setSdk] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  const scannerRef = useRef(null)
  const containerRef = useRef(null)
  const isDisposingRef = useRef(false)
  const { isMobile } = useIsMobile()

  const { message } = App.useApp()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const initSDK = async () => {
      try {
        const ScanbotSDK = (await import('scanbot-web-sdk')).default
        const scanbotSDK = await ScanbotSDK.initialize({
          licenseKey: licenseKey,
          allowThreads: true,
        })
        setSdk(scanbotSDK)
      } catch (error) {
        console.error('Failed to initialize Scanbot SDK:', error)
        message.error('Failed to initialize barcode scanner')
      }
    }

    if (licenseKey) {
      initSDK()
    }

    return () => {
      cleanupScanner()
    }
  }, [licenseKey, isMounted])

  const cleanupScanner = async () => {
    if (isDisposingRef.current) return
    isDisposingRef.current = true

    try {
      if (scannerRef.current) {
        await scannerRef.current.dispose()
        scannerRef.current = null
      }
    } catch (error) {
      console.error('Error disposing scanner:', error)
    } finally {
      isDisposingRef.current = false
    }
  }

  useEffect(() => {
    if (!isMounted || !isModalOpen) return

    let mounted = true

    const startScanner = async () => {
      if (!sdk || !containerRef.current) return

      try {
        setIsScanning(true)
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (!mounted) return
        const config = {
          containerId: 'barcode-scanner-container',
          onBarcodesDetected: (result) => {
            if (result.barcodes && result.barcodes.length > 0) {
              const barcode = result.barcodes[0]
              setBarcode((prev) => ({ ...prev, barcode: barcode?.text }))
              message.success(`Barcode scanned: ${barcode.text}`)
              handleCloseModal()
            }
          },
          onError: (error) => {
            console.error('Scanner error:', error)
            message.error('Scanner error occurred')
          },
          style: {
            position: 'relative',
            width: '100%',
            height: '100%',
          },
          finder: {
            style: {
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              border: '2px solid #1890ff',
              borderRadius: '12px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            },
          },
          preferredCamera: 'camera1 0',
        }

        if (mounted) {
          scannerRef.current = await sdk.createBarcodeScanner(config)
        }
      } catch (error) {
        console.error('Failed to start scanner:', error)
        if (mounted) {
          message.error('Failed to start camera')
          setIsScanning(false)
        }
      }
    }

    startScanner()

    return () => {
      mounted = false
      cleanupScanner()
    }
  }, [isModalOpen, sdk, isMounted])

  const handleCloseModal = async () => {
    setIsModalOpen(false)
    setIsScanning(false)

    setTimeout(() => {
      cleanupScanner()
    }, 100)
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Modal
        title='Scan Barcode'
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key='cancel'
            icon={<CloseOutlined />}
            onClick={handleCloseModal}>
            Cancel
          </Button>,
        ]}
        width={800}
        centered
        maskClosable={false}
        afterClose={() => {
          cleanupScanner()
        }}>
        <style jsx>{`
          #barcode-scanner-container {
            position: relative !important;
            overflow: hidden !important;
          }

          #barcode-scanner-container :global(video) {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            max-width: 500px !important;
            max-height: 500px !important;
            object-fit: cover !important;
          }

          #barcode-scanner-container :global(.scanbot-camera-overlay) {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 300px !important;
            height: 300px !important;
          }

          #barcode-scanner-container :global(.scanbot-finder-overlay) {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 300px !important;
            height: 300px !important;
          }

          #barcode-scanner-container :global(canvas) {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
          }
        `}</style>
        <div className='flex flex-col items-center justify-center p-4'>
          <div
            id={'barcode-scanner-container'}
            ref={containerRef}
            style={{
              width: isMobile ? '350px' : '500px',
              height: isMobile ? '400px' : '500px',
              position: 'relative',
              borderRadius: '8px',
              backgroundColor: '#000',
            }}>
            {!isScanning && (
              <div className='absolute inset-0 flex items-center justify-center text-white z-10'>
                <p>Initializing camera...</p>
              </div>
            )}
          </div>
          <p className='mt-4 text-gray-600 text-center'>
            Position the barcode within the camera view to scan
          </p>
        </div>
      </Modal>
    </>
  )
}

export default BarcodeScanner
