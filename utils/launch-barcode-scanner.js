'use client'

// Robust, single-instance launcher for DBR bundle v11
export async function launchBarcodeScanner({
  container, // HTMLElement or selector (omit => fullscreen overlay)
  license, // REQUIRED
  formats, // optional: DBR enum array
  onDone, // optional callback(result)
} = {}) {
  if (typeof window === 'undefined') return null

  // ---- import (cached) ------------------------------------------------------
  if (!window.__DBR_IMPORT__) {
    window.__DBR_IMPORT__ = import('dynamsoft-barcode-reader-bundle')
  }
  const mod = await window.__DBR_IMPORT__
  const NS = mod.default || {}
  const DBR = NS.DBR || mod.DBR || {}
  const BarcodeScanner =
    DBR.BarcodeScanner || NS.BarcodeScanner || mod.BarcodeScanner
  const EnumBarcodeFormat =
    DBR.EnumBarcodeFormat || NS.EnumBarcodeFormat || mod.EnumBarcodeFormat

  if (!BarcodeScanner) {
    throw new Error('DBR BarcodeScanner not found from the bundle import.')
  }

  // ---- mutex: prevent concurrent launches ----------------------------------
  if (window.__DBR_BUSY__) {
    // Wait for the current launch to finish instead of starting a new one
    return window.__DBR_BUSY__
  }

  // Helper to create/recreate the singleton
  const createInstance = async () => {
    const create =
      BarcodeScanner.createInstance?.bind(BarcodeScanner) ||
      (async (opts) => new BarcodeScanner(opts))

    const instance = await create({
      license,
      container,
      engineResourcePaths: {
        rootDirectory:
          'https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader-bundle@11.0.6000/dist/',
      },
      uiPath:
        'https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader-bundle@11.0.6000/dist/barcode-scanner.ui.xml',
      barcodeFormats:
        formats ||
        [
          EnumBarcodeFormat?.BF_CODE_128,
          EnumBarcodeFormat?.BF_EAN_13,
          EnumBarcodeFormat?.BF_CODE_39,
        ].filter(Boolean),
      showFlashButton: true,
      showUploadImageButton: false,
    })

    return instance
  }

  // Reuse if possible; recreate if missing or previously destroyed
  let scanner = window.__DBR_SCANNER__
  if (!scanner) {
    scanner = await createInstance()
    window.__DBR_SCANNER__ = scanner
  }

  // Choose the open method DBR exposes
  const open =
    scanner.launch?.bind(scanner) ||
    scanner.show?.bind(scanner) ||
    scanner.open?.bind(scanner)

  if (!open) throw new Error('No launch/show/open method on BarcodeScanner.')

  // Wrap the launch with a mutex promise
  window.__DBR_BUSY__ = (async () => {
    try {
      const res = await open() // resolves when user closes the built-in UI
      onDone?.(res)
      return res
    } catch (err) {
      // If instance was destroyed by DBR, clear so the next call recreates it
      const msg = String(err?.message || err)
      if (msg.includes('destroyed') || msg.includes('has been destroyed')) {
        window.__DBR_SCANNER__ = undefined
      }
      throw err
    } finally {
      // release mutex
      window.__DBR_BUSY__ = undefined
    }
  })()

  return window.__DBR_BUSY__
}
