// utils/dbrLoader.js
'use client'

let loadPromise

/**
 * Load the DBR v11 bundle from CDN and init license once.
 * Returns the global Dynamsoft namespace.
 */
export async function loadDBR({ license }) {
  if (typeof window === 'undefined') return null

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      // If already loaded
      if (window.Dynamsoft?.License) {
        try {
          window.Dynamsoft.License.LicenseManager.initLicense(license)
          window.Dynamsoft.Core.CoreModule.loadWasm() // preload
        } catch (e) {}
        resolve(window.Dynamsoft)
        return
      }

      // Inject script
      const script = document.createElement('script')
      script.src =
        'https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader-bundle@11.0.6000/dist/dbr.bundle.js'
      script.async = true
      script.onload = () => {
        try {
          window.Dynamsoft.License.LicenseManager.initLicense(license)
          window.Dynamsoft.Core.CoreModule.loadWasm() // preload
          resolve(window.Dynamsoft)
        } catch (e) {
          reject(e)
        }
      }
      script.onerror = () =>
        reject(new Error('Failed to load Dynamsoft bundle from CDN'))
      document.head.appendChild(script)
    })
  }
  return loadPromise
}
