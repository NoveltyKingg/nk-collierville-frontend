'use client'
import { useState, useEffect, useRef } from 'react'
import { Modal, Button, App } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

function buildUiScreenConfig(ScanbotSDK) {
  try {
    const ScreenCfg = ScanbotSDK?.UI?.Config?.BarcodeScannerConfiguration

    if (!ScreenCfg) return null
    const cfg = new ScreenCfg()

    // Set color palette
    cfg.palette.sbColorPrimary = '#C8193C'
    cfg.palette.sbColorSecondary = '#38455E'
    cfg.palette.sbColorAccent = '#FFCE5C'

    // Top Bar
    cfg.topBar.mode = 'GRADIENT'
    cfg.topBar.backgroundColor = '#C8193C'
    cfg.topBar.cancelButton.text = 'Cancel'
    cfg.topBar.cancelButton.foreground.color = '#FFFFFF'

    // Action Bar button appearance
    cfg.actionBar.flashButton.visible = true
    cfg.actionBar.flashButton.backgroundColor = '#0000007A'
    cfg.actionBar.flashButton.foregroundColor = '#FFFFFF'
    cfg.actionBar.flashButton.activeBackgroundColor = '#FFCE5C'
    cfg.actionBar.flashButton.activeForegroundColor = '#000000'

    // User Guidance text
    cfg.userGuidance.visible = true
    cfg.userGuidance.title.text = 'Move the finder over the barcode'
    cfg.userGuidance.title.color = '#38455E'
    cfg.userGuidance.background.fillColor = '#0000007A'

    // Optionally set scanning mode
    // cfg.useCase = new ScanbotSDK.UI.Config.SingleScanningMode();

    return cfg
  } catch {
    return null
  }
}

const BarcodeScanner = ({
  licenseKey,
  setBarcode,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isScanning, setIsScanning] = useState(false)
  const [sdk, setSdk] = useState(null)
  const scanbotNSRef = useRef(null)
  const containerRef = useRef(null)
  const scannerRef = useRef(null)
  const disposingRef = useRef(false)

  const { message } = App.useApp()

  const cleanupScanner = async () => {
    if (disposingRef.current) return
    disposingRef.current = true
    try {
      await scannerRef.current?.dispose?.()
      scannerRef.current = null
    } catch (e) {
      console.error('Error disposing scanner:', e)
    } finally {
      disposingRef.current = false
    }
  }

  // Initialize SDK: prefer UI2 build; fallback to base
  useEffect(() => {
    if (!licenseKey) return

    let cancelled = false
    ;(async () => {
      try {
        // 1) Try UI2 bundle (has UI widgets)
        const ScanbotSDK_UI2 = await (
          await import('scanbot-web-sdk/ui')
        ).default

        const instance = await ScanbotSDK_UI2.initialize({
          licenseKey,
          allowThreads: true,
        })
        if (cancelled) return
        scanbotNSRef.current = ScanbotSDK_UI2
        setSdk(instance)
      } catch (e1) {
        // 2) Fallback: base bundle (no UI)
        try {
          const ScanbotSDK = (await import('scanbot-web-sdk')).default
          const instance = await ScanbotSDK.initialize({
            licenseKey,
            allowThreads: true,
          })

          if (cancelled) return
          scanbotNSRef.current = ScanbotSDK
          setSdk(instance)
        } catch (e2) {
          console.error('Failed to initialize Scanbot SDK:', e2)
          message.error('Failed to initialize barcode scanner')
        }
      }
    })()

    return () => {
      cancelled = true
      cleanupScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [licenseKey])

  // Start scanner when modal opens
  useEffect(() => {
    if (!isModalOpen || !sdk || !containerRef.current) return
    let active = true

    ;(async () => {
      try {
        setIsScanning(true)
        await new Promise((r) => setTimeout(r, 100))
        if (!active) return

        // Only build UI config if UI2 actually exists
        const uiConfig = buildUiScreenConfig(scanbotNSRef.current)

        const config = {
          containerId: 'barcode-scanner-container',
          preferredCamera: 'environment',
          onBarcodesDetected: (result) => {
            const code = result?.barcodes?.[0]?.text
            if (code) {
              setBarcode(code)
              message.success(`Barcode scanned: ${code}`)
              handleCloseModal()
            }
          },
          onError: (err) => {
            console.error('Scanner error:', err)
            message.error('Scanner error occurred')
          },
          ...(uiConfig ? { uiConfig, screenConfiguration: uiConfig } : {}),
          style: { position: 'relative', width: '100%', height: '100%' },
        }

        scannerRef.current = await sdk.createBarcodeScanner(config)
      } catch (err) {
        console.error('Failed to start scanner:', err)
        message.error('Failed to start camera')
        setIsScanning(false)
      }
    })()

    return () => {
      active = false
      cleanupScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, sdk])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsScanning(false)
    setTimeout(cleanupScanner, 100)
  }

  return (
    <Modal
      title='Scan Barcode'
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      // footer={[
      //   <Button
      //     key='cancel'
      //     icon={<CloseOutlined />}
      //     onClick={handleCloseModal}>
      //     Cancel
      //   </Button>,
      // ]}
      width={800}
      centered
      // maskClosable={false}
      afterClose={cleanupScanner}>
      <style jsx>{`
        #barcode-scanner-container {
          position: relative !important;
          overflow: hidden !important;
        }
        #barcode-scanner-container :global(video),
        #barcode-scanner-container :global(canvas) {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }
      `}</style>
      <div className='flex flex-col items-center justify-center p-4'>
        <div
          id='barcode-scanner-container'
          ref={containerRef}
          style={{
            width: '500px',
            height: '500px',
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
  )
}

export default BarcodeScanner
