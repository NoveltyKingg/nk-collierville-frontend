'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from 'antd'
import { loadDBR } from '@/utils/dbrLoader'

// /**
//  * Props:
//  * - open: boolean                      -> controls visibility (Modal-style)
//  * - onClose: () => void                -> close callback
//  * - license: string                    -> Dynamsoft license (REQUIRED)
//  * - mode: 'scan-id' | 'search'         -> single vs continuous with target match
//  * - targetId?: string                  -> used in 'search' mode to highlight a specific code
//  * - onResult?: (payload) => void       -> callback with result payloads
//  * - showHeader?: boolean               -> show top status strip (default true)
//  * - useModal?: boolean                 -> wrap in AntD Modal (default true). If false, just renders box
//  * - height?: string|number             -> container height (default 46vh)
//  */

export default function BarcodeScanner({
  open,
  onClose,
  license,
  mode = 'scan-id',
  targetId,
  onResult,
  showHeader = true,
  useModal = true,
  height = '46vh',
}) {
  const containerRef = useRef(null)
  const overlayRef = useRef(null)
  const stateRef = useRef({
    cameraEnhancer: null,
    cameraView: null,
    cvRouter: null,
    resultReceiver: null,
    customLayer: null,
  })
  const [status, setStatus] = useState('Initializing…')
  const [busy, setBusy] = useState(false)

  const dce = () => window.Dynamsoft?.DCE
  const cvr = () => window.Dynamsoft?.CVR
  const core = () => window.Dynamsoft?.Core
  const util = () => window.Dynamsoft?.Utility

  useEffect(() => {
    if (!open) return
    let isMounted = true
    let initialized = false

    const init = async () => {
      try {
        setBusy(true)
        setStatus('Loading library…')
        await loadDBR({ license })

        if (!isMounted) return
        setStatus('Preparing camera…')

        // Create view + enhancer
        // Build the default UI and mount it yourself
        const cameraView = await dce().CameraView.createInstance()
        const ui = cameraView.getUIElement()
        if (containerRef.current && !containerRef.current.contains(ui)) {
          containerRef.current.appendChild(ui)
        }
        const cameraEnhancer = await dce().CameraEnhancer.createInstance(
          cameraView,
        )
        cameraView.setVideoFit('cover')

        // Hide DBR default drawing for barcodes; we’ll use our own icons
        const defaultBRLayer = cameraView.getDrawingLayer(2)
        defaultBRLayer.setVisible(false)

        // Our custom layer
        const customLayer = cameraView.createDrawingLayer()

        // Router
        const router = await cvr().CaptureVisionRouter.createInstance()
        router.setInput(cameraEnhancer)

        // Cross verification filter (stabilize)
        const filter = new util().MultiFrameResultCrossFilter()
        filter.enableResultCrossVerification('barcode', true)
        await router.addResultFilter(filter)

        // Save
        stateRef.current = {
          cameraEnhancer,
          cameraView,
          cvRouter: router,
          resultReceiver: null,
          customLayer,
        }

        // Open camera + capture
        setStatus(
          mode === 'scan-id' ? 'Point at a barcode' : 'Scan to locate item',
        )
        if (!cameraEnhancer.isOpen()) await cameraEnhancer.open()

        // Attach listeners per mode
        attachReceivers(mode)

        // Start profile
        const profile =
          mode === 'scan-id' ? 'ReadSingleBarcode' : 'ReadBarcodes_Balance'
        await router.startCapturing(profile)

        initialized = true
      } catch (e) {
        console.error(e)
        setStatus('Failed to initialize')
      } finally {
        if (isMounted) setBusy(false)
      }
    }

    init()
    return () => {
      isMounted = false
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, targetId])

  const cleanup = async () => {
    try {
      const { cvRouter, cameraEnhancer, resultReceiver, customLayer } =
        stateRef.current || {}
      if (cvRouter && resultReceiver) {
        try {
          cvRouter.removeResultReceiver(resultReceiver)
        } catch {}
      }
      if (cvRouter) {
        try {
          await cvRouter.stopCapturing()
        } catch {}
      }
      if (customLayer) {
        try {
          customLayer.clearDrawingItems()
        } catch {}
      }
      if (cameraEnhancer) {
        try {
          await cameraEnhancer.close()
        } catch {}
      }
    } catch {}
    stateRef.current = {
      cameraEnhancer: null,
      cameraView: null,
      cvRouter: null,
      resultReceiver: null,
      customLayer: null,
    }
    if (overlayRef.current) overlayRef.current.innerHTML = ''
  }

  /** Build a little green/red indicator at given midpoint */
  const makeMarker = (midX, midY, ok = false) => {
    const DCE = dce()
    const icon = document.createElement('img')
    icon.src = ok
      ? 'https://cdn.jsdelivr.net/gh/dynamsoft/barcode-reader-javascript-samples/assets/checkmark-icon.svg'
      : 'https://cdn.jsdelivr.net/gh/dynamsoft/barcode-reader-javascript-samples/assets/cross-icon.svg'
    const styleId = DCE.DrawingStyleManager.createDrawingStyle({
      strokeStyle: 'rgba(0,0,0,0)',
    })
    return new DCE.ImageDrawingItem(
      icon,
      { x: midX - 25, y: midY - 25, width: 50, height: 50 },
      true,
      styleId,
    )
  }

  /** Show a speech bubble near the code box (viewport coords) */
  const bubble = (text, topLeftClient, bottomRightClient) => {
    if (!overlayRef.current) return
    const midX = (topLeftClient.x + bottomRightClient.x) / 2
    const div = document.createElement('div')
    div.className = 'absolute z-20'
    div.style.left = `${midX}px`
    div.style.top = `${topLeftClient.y}px`
    div.innerHTML = `
      <div class="relative bg-white text-black text-xs rounded shadow px-2 py-1 -translate-x-1/2 -translate-y-full">
        ${text}
        <span class="absolute left-1/2 -translate-x-1/2 -bottom-2 border-x-transparent border-t-white border-x-8 border-t-8"></span>
      </div>`
    overlayRef.current.appendChild(div)
  }

  /** Attach result receivers based on mode */
  const attachReceivers = (m) => {
    const { cvRouter, cameraEnhancer, customLayer } = stateRef.current
    if (!cvRouter || !cameraEnhancer) return

    // Remove prior
    if (stateRef.current.resultReceiver) {
      try {
        cvRouter.removeResultReceiver(stateRef.current.resultReceiver)
      } catch {}
      stateRef.current.resultReceiver = null
    }

    if (m === 'scan-id') {
      // Return the first barcode then close
      const rr = {
        onDecodedBarcodesReceived: (res) => {
          const item = res?.barcodeResultItems?.[0]
          if (!item?.text) return
          onResult?.({ mode: 'scan-id', code: item.text, raw: res })
          onClose?.()
        },
      }
      cvRouter.addResultReceiver(rr)
      stateRef.current.resultReceiver = rr
    } else {
      // search mode: show markers + bubble for matches to targetId
      const rr = {
        onCapturedResultReceived: (res) => {
          if (!res?.items?.length) return
          // clear overlays each frame
          customLayer?.clearDrawingItems()
          if (overlayRef.current) overlayRef.current.innerHTML = ''
          setStatus('Scanning…')

          const items = res.items
          for (const it of items) {
            if (it.type !== core().EnumCapturedResultItemType.CRIT_BARCODE)
              continue
            const pts = it.location.points
            const minX = Math.min(pts[0].x, pts[1].x, pts[2].x, pts[3].x)
            const minY = Math.min(pts[0].y, pts[1].y, pts[2].y, pts[3].y)
            const maxX = Math.max(pts[0].x, pts[1].x, pts[2].x, pts[3].x)
            const maxY = Math.max(pts[0].y, pts[1].y, pts[2].y, pts[3].y)
            const midX = (minX + maxX) / 2
            const midY = (minY + maxY) / 2

            const clientTL = cameraEnhancer.convertToClientCoordinates({
              x: minX,
              y: minY,
            })
            const clientBR = cameraEnhancer.convertToClientCoordinates({
              x: maxX,
              y: maxY,
            })

            const isMatch = targetId && String(it.text) === String(targetId)
            const mk = makeMarker(midX, midY, isMatch)
            customLayer?.addDrawingItem(mk)

            if (isMatch) {
              bubble(it.text, clientTL, clientBR)
              setStatus('Item found!')
              onResult?.({
                mode: 'search',
                matched: true,
                code: it.text,
                raw: res,
              })
              // (optional) auto close after a short delay:
              // setTimeout(onClose, 600);
            } else {
              onResult?.({
                mode: 'search',
                matched: false,
                code: it.text,
                raw: res,
              })
            }
          }
        },
      }
      cvRouter.addResultReceiver(rr)
      stateRef.current.resultReceiver = rr
    }
  }

  const body = (
    <div
      className='relative rounded-xl overflow-hidden bg-[#0b1220]'
      style={{ height }}>
      {/* camera view mount point */}
      <div ref={containerRef} className='absolute inset-0 z-[1]' />
      {/* overlay for bubbles */}
      <div
        ref={overlayRef}
        className='absolute inset-0 z-[3] pointer-events-none'
      />
      {/* glass gradient */}
      <div
        className='absolute inset-0 z-[2]'
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.35) 100%)',
        }}
      />
      {showHeader && (
        <div className='absolute top-0 left-0 right-0 z-[4] flex items-center justify-between px-3 py-2'>
          <div
            className='text-white text-xs px-2 py-1 rounded-md'
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            {status}
          </div>
          <Button
            size='small'
            ghost
            onClick={onClose}
            style={{ color: '#fff', borderColor: '#fff' }}>
            Close
          </Button>
        </div>
      )}
      {/* framing corners */}
      <div className='absolute inset-0 grid place-items-center z-[3] pointer-events-none'>
        <div
          className='relative'
          style={{
            width: '70%',
            maxWidth: 520,
            minWidth: 240,
            aspectRatio: '3 / 2',
            borderRadius: 16,
            boxShadow: '0 0 0 200vmax rgba(0,0,0,0.35) inset',
          }}>
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(
            (pos) => (
              <span
                key={pos}
                className='absolute block'
                style={{
                  width: 28,
                  height: 28,
                  borderColor: '#20e3b2',
                  borderStyle: 'solid',
                  ...(pos === 'top-left' && {
                    top: 0,
                    left: 0,
                    borderWidth: '3px 0 0 3px',
                    borderTopLeftRadius: 8,
                  }),
                  ...(pos === 'top-right' && {
                    top: 0,
                    right: 0,
                    borderWidth: '3px 3px 0 0',
                    borderTopRightRadius: 8,
                  }),
                  ...(pos === 'bottom-left' && {
                    bottom: 0,
                    left: 0,
                    borderWidth: '0 0 3px 3px',
                    borderBottomLeftRadius: 8,
                  }),
                  ...(pos === 'bottom-right' && {
                    bottom: 0,
                    right: 0,
                    borderWidth: '0 3px 3px 0',
                    borderBottomRightRadius: 8,
                  }),
                }}
              />
            ),
          )}
        </div>
      </div>
    </div>
  )

  if (!useModal) {
    return open ? body : null
  }

  return <div>{body}</div>
}

// import { useEffect, useRef } from 'react'
// import { BarcodeScanner } from 'dynamsoft-barcode-reader-bundle'

// export default function BarcodeScannerComp({}) {
//   const barcodeScannerViewRef = useRef(null)
//   const hasRun = useRef(false) // walkaround react strict mode

//   useEffect(() => {
//     if (hasRun.current) {
//       return
//     } // walkaround react strict mode

//     // Configuration object for initializing the BarcodeScanner instance
//     const config = {
//       license: 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9', // Replace with your Dynamsoft license key

//       // Specify where to render the scanner UI
//       // If container is not specified, the UI will take up the full screen
//       container: barcodeScannerViewRef.current,

//       // Specify the path for the definition file "barcode-scanner.ui.xml" for the scanner view.
//       uiPath:
//         'https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader-bundle@11.0.6000/dist/ui/barcode-scanner.ui.xml',

//       // showUploadImageButton: true,
//       // scannerViewConfig: {
//       //   showFlashButton: true,
//       //   cameraSwitchControl: "toggleFrontBack",
//       // },

//       // Specify custom paths for the engine resources
//       engineResourcePaths: {
//         rootDirectory: 'https://cdn.jsdelivr.net/npm/',
//       },
//     }

//     // Create an instance of the BarcodeScanner with the provided configuration
//     const barcodeScanner = new BarcodeScanner(config)

//     ;(async () => {
//       // Launch the scanner; once a barcode is detected, display its text in an alert
//       let result = await barcodeScanner.launch()
//       if (result.barcodeResults.length) {
//         alert(result.barcodeResults[0].text)
//       }
//     })()

//     hasRun.current = true

//     //// We have bug in react strict mode.
//     //// It will be fixed in next version.
//     // return ()=>{
//     //   // Dispose of the barcode scanner when the component unmounts
//     //   barcodeScanner?.dispose();
//     // };
//   }, [])
//   return (
//     <>
//       <h1>Barcode Scanner for React</h1>
//       <div
//         ref={barcodeScannerViewRef}
//         style={{ width: '100%', height: '80vh' }}></div>
//     </>
//   )
// }
