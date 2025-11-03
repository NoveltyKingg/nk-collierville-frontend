// pages/about-us.jsx  (For App Router, put this in app/about-us/page.jsx and remove NextHead)
import React from 'react'
import { Card, Typography } from 'antd'
import Head from 'next/head' // remove if using App Router

const { Title, Paragraph, Text } = Typography

function About() {
  return (
    <>
      <Head>
        <title>About Us – Novety King Collierville</title>
        <meta
          name='description'
          content='Your local destination in Collierville, TN for fuel, snacks, drinks, and a wide range of convenience items.'
        />
      </Head>

      <div className='flex justify-center bg-[#f5f5f5] py-10 px-4'>
        <Typography>
          <Title level={2} className='text-center mb-2'>
            About Novety King Collierville
          </Title>
          <Paragraph className='text-center text-zinc-600 mb-8'>
            Your local destination in Collierville, Tennessee for fuel, snacks,
            drinks, and convenience items.
          </Paragraph>

          <Title level={4}>Welcome</Title>
          <Paragraph>
            Welcome to <Text strong>Novety King Collierville</Text>, your
            neighborhood stop for everyday essentials and more. We’re committed
            to offering{' '}
            <Text strong>high-quality products at great prices</Text> with
            friendly, convenient service for our community.
          </Paragraph>

          <Title level={4} className='mt-8'>
            Our Mission
          </Title>
          <Paragraph>
            At Novety King, our mission is simple: provide value, variety, and
            convenience—every visit, every order.
          </Paragraph>

          <Title level={4} className='mt-8'>
            What you’ll find at Novety King Collierville
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
            <Card size='small' className='rounded-xl'>
              <Paragraph className='mb-1'>
                <span className='mr-2'>✅</span>
                <Text strong>Automotive Supplies</Text>
              </Paragraph>
              <Paragraph type='secondary' className='mb-0'>
                Oil, fluids, and essential car accessories to keep you moving.
              </Paragraph>
            </Card>

            <Card size='small' className='rounded-xl'>
              <Paragraph className='mb-1'>
                <span className='mr-2'>✅</span>
                <Text strong>Novelties &amp; Fun Items</Text>
              </Paragraph>
              <Paragraph type='secondary' className='mb-0'>
                Unique gifts, small toys, and interesting novelties for all
                ages.
              </Paragraph>
            </Card>

            <Card size='small' className='rounded-xl'>
              <Paragraph className='mb-1'>
                <span className='mr-2'>✅</span>
                <Text strong>C-Store Essentials</Text>
              </Paragraph>
              <Paragraph type='secondary' className='mb-0'>
                Chocolates, chips, drinks, and other on-the-go staples.
              </Paragraph>
            </Card>

            <Card size='small' className='rounded-xl'>
              <Paragraph className='mb-1'>
                <span className='mr-2'>✅</span>
                <Text strong>Health &amp; Personal Care</Text>
              </Paragraph>
              <Paragraph type='secondary' className='mb-0'>
                Basic healthcare items, personal care products, and hygiene
                essentials.
              </Paragraph>
            </Card>

            <Card size='small' className='rounded-xl'>
              <Paragraph className='mb-1'>
                <span className='mr-2'>✅</span>
                <Text strong>Cell Phone Accessories</Text>
              </Paragraph>
              <Paragraph type='secondary' className='mb-0'>
                Chargers, cables, and more to keep you connected.
              </Paragraph>
            </Card>

            <Card size='small' className='rounded-xl'>
              <Paragraph className='mb-1'>
                <span className='mr-2'>✅</span>
                <Text strong>Friendly Service</Text>
              </Paragraph>
              <Paragraph type='secondary' className='mb-0'>
                We’re here to help with orders, answer questions, and make your
                visit great.
              </Paragraph>
            </Card>
          </div>

          <Title level={4} className='mt-8'>
            What You Can Do with Novety King
          </Title>
          <ul className='list-disc pl-6'>
            <li>Browse available products easily from your mobile device</li>
            <li>Place orders for quick pickup or in-store shopping</li>
            <li>Stay updated on promotions, deals, and new arrivals</li>
          </ul>

          <Paragraph className='text-center text-zinc-500 mt-10'>
            We’re proud to serve Collierville and the surrounding community—see
            you soon!
          </Paragraph>
        </Typography>
      </div>
    </>
  )
}

export default About
