/* eslint-disable react/jsx-no-undef */
import React from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from '@react-pdf/renderer'

const currency = (n) =>
  `$${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`

const safe = (v, fallback = '—') =>
  v === undefined || v === null || v === '' ? fallback : v

const getVarieties = (line) => {
  const byCount = line?.varietiesCount
  if (byCount && typeof byCount === 'object' && Object.keys(byCount).length) {
    return Object.entries(byCount).map(([k, v]) => `${k}: ${v}`)
  }
  let feature = line?.feature
  try {
    if (typeof feature === 'string') feature = JSON.parse(feature || '{}')
  } catch {
    feature = {}
  }
  if (feature && typeof feature === 'object' && Object.keys(feature).length) {
    return Object.entries(feature).map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
  }
  return ['—']
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0F172A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 36, height: 36, borderRadius: 6 },
  brandTextWrap: {},
  brandTitle: { fontSize: 14, fontWeight: 700 },
  brandSub: { fontSize: 8, color: '#64748B' },

  docMeta: { alignItems: 'flex-end' },
  docTitle: { fontSize: 16, fontWeight: 700 },
  metaLine: { fontSize: 9, color: '#475569', marginTop: 2 },

  block: {
    border: '1pt solid #E2E8F0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },

  itemsBlock: {
    marginBottom: 16,
  },

  blockTitle: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 6,
    fontWeight: 700,
  },

  twoCol: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },

  label: { color: '#64748B' },
  value: { fontSize: 10 },

  table: { marginTop: 8, borderRadius: 6, overflow: 'hidden' },
  thead: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottom: '1pt solid #E2E8F0',
  },
  th: {
    fontSize: 9,
    fontWeight: 700,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: '#334155',
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid #E2E8F0',
  },
  td: {
    fontSize: 9,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: '#0F172A',
  },

  cIdx: { width: '8%' },
  cName: { width: '34%' },
  cQty: { width: '10%', textAlign: 'right' },
  cPrice: { width: '16%', textAlign: 'right' },
  cVars: { width: '32%', textTransform: 'lowercase' },

  totalsWrap: {
    marginTop: 10,
    marginLeft: 'auto',
    width: '48%',
    border: '1pt solid #E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1pt solid #E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  totalsLabel: { color: '#64748B' },
  totalsStrong: { fontWeight: 700 },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 8,
    color: '#94A3B8',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  link: { color: '#2563EB', textDecoration: 'none' },
})

export default function DownloadOrderV2({
  item,
  logoSrc,
  brandName = 'Novelty King Collierville',
}) {
  const addrLine = [
    safe(item?.address1, ''),
    safe(item?.address2, ''),
    safe(item?.city, ''),
    safe(item?.state, ''),
    safe(item?.country, ''),
    safe(item?.zip, ''),
  ]
    .filter(Boolean)
    .join(', ')

  const lines = item?.items || []
  const subTotal = Number(item?.priceWithoutTax || 0)
  const shipping = Number(item?.shipping || 0)
  const grandTotal = Number(item?.totalAmount || subTotal + shipping)

  return (
    <Document>
      <Page size='A4' style={styles.page} wrap>
        <View style={styles.headerRow} fixed>
          <View style={styles.brandBlock}>
            {logoSrc ? <Image style={styles.logo} src={logoSrc} /> : null}
            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitle}>{brandName}</Text>
              <Text style={styles.brandSub}>
                Order confirmation / packing slip
              </Text>
            </View>
          </View>

          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>Order #{safe(item?.orderId)}</Text>
            <Text style={styles.metaLine}>Status: {safe(item?.status)}</Text>
            {item?.createdAt ? (
              <Text style={styles.metaLine}>
                Placed on: {new Date(item?.createdAt).toLocaleString()}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={[styles.twoCol, { marginBottom: 8 }]}>
          <View style={styles.col}>
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Ship To</Text>
              <Text style={styles.value}>{safe(item?.storeName)}</Text>
              <Text style={styles.value}>{addrLine || '—'}</Text>
              <Text style={styles.value}>Phone: {safe(item?.phone)}</Text>
              <Text style={styles.value}>Email: {safe(item?.email)}</Text>
            </View>
          </View>
          <View style={styles.col}>
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Order Summary</Text>
              <Text>
                <Text style={styles.label}>Quantity:</Text>{' '}
                {safe(item?.quantity, 0)}
              </Text>
              <Text>
                <Text style={styles.label}>Price (w/o tax):</Text>{' '}
                {currency(subTotal)}
              </Text>
              <Text>
                <Text style={styles.label}>Shipping:</Text> {currency(shipping)}
              </Text>
              <Text>
                <Text style={styles.label}>Total Amount:</Text>{' '}
                <Text style={styles.totalsStrong}>{currency(grandTotal)}</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.itemsBlock}>
          <Text style={styles.blockTitle}>Items</Text>
          <View style={[styles.table]} wrap>
            <View style={styles.thead} fixed>
              <Text style={[styles.th, styles.cIdx]}>#</Text>
              <Text style={[styles.th, styles.cName]}>Product</Text>
              <Text style={[styles.th, styles.cQty]}>Qty</Text>
              <Text style={[styles.th, styles.cPrice]}>Price</Text>
              <Text style={[styles.th, styles.cVars]}>Varieties</Text>
            </View>
            {lines.map((line, idx) => {
              const prod = line?.productDetail || {}
              const vars = getVarieties(line)
              return (
                <View
                  style={styles.row}
                  key={`${line?.productDetail?.id || idx}-${idx}`}>
                  <Text style={[styles.td, styles.cIdx]}>{idx + 1}</Text>

                  <View style={[styles.td, styles.cName]}>
                    {prod?.id ? (
                      <Link
                        style={styles.link}
                        src={`https://www.noveltykingwholesale.com/product/${prod?.id}`}>
                        {safe(prod?.name)}
                      </Link>
                    ) : (
                      <Text>{safe(prod?.name)}</Text>
                    )}
                  </View>
                  <Text style={[styles.td, styles.cQty]}>
                    {safe(line?.quantity, 0)}
                  </Text>
                  <Text style={[styles.td, styles.cPrice]}>
                    {currency(line?.price)}
                  </Text>
                  <View style={[styles.td, styles.cVars]}>
                    {vars.map((v, i) => (
                      <Text key={`${idx}-v-${i}`}>{v}</Text>
                    ))}
                  </View>
                </View>
              )
            })}
          </View>
          <View style={styles.totalsWrap}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text>{currency(subTotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Shipping</Text>
              <Text>{currency(shipping)}</Text>
            </View>
            <View style={[styles.totalsRow, { borderBottom: 0 }]}>
              <Text style={[styles.totalsLabel, styles.totalsStrong]}>
                Total
              </Text>
              <Text style={styles.totalsStrong}>{currency(grandTotal)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer} fixed>
          <Text>Thank you for your business!</Text>
          <Text>
            Page{' '}
            <Text
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </Text>
        </View>
      </Page>
    </Document>
  )
}
