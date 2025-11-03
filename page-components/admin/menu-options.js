import { Badge } from 'antd'
import React from 'react'

export const MENU_OPTIONS = ({ customersData }) => [
  {
    label: 'Banners',
    key: 'banners',
    children: [
      {
        label: 'Home Page Banners',
        key: 'home-banners',
      },
      {
        label: 'Promotional Banners',
        key: 'promotional-banners',
      },
      {
        label: 'Clearence Banners',
        key: 'clearence-banners',
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    label: 'Bar Codes',
    key: 'barcodes',
  },
  {
    type: 'divider',
  },
  {
    label: 'Products',
    key: 'products',
    children: [
      {
        label: 'Add Product',
        key: 'add-product',
      },
      {
        label: 'Edit Product',
        key: 'edit-product',
      },
      {
        label: 'New Arrivals',
        key: 'new-arrivals',
      },
      {
        label: 'Recently Added',
        key: 'recently-added',
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    label: 'Sub Categories',
    key: 'sub-categories',
    children: [
      {
        label: 'Add Sub Category',
        key: 'add-sub-category',
      },
      {
        label: 'Edit Sub Category',
        key: 'edit-sub-category',
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    label: 'Varities',
    key: 'varities',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <Badge count={customersData?.length || 0} className='!text-white'>
        Customers
      </Badge>
    ),
    key: 'customers',
    children: [
      {
        label: 'Active Customers',
        key: 'active-customers',
      },
      {
        label: (
          <Badge count={customersData?.length || 0} className='!text-white'>
            Pending Customers
          </Badge>
        ),
        key: 'pending-customers',
      },
    ],
  },
  {
    label: 'Orders',
    key: 'orders',
    children: [
      {
        label: 'Active Orders',
        key: 'active-orders',
      },
      {
        label: 'Previous Orders',
        key: 'previous-orders',
      },
    ],
  },
  {
    label: 'Statements',
    key: 'statements',
  },
]
