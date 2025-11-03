import React from 'react'
import Head from 'next/head' // remove if using App Router metadata
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Typography,
  Tag,
} from 'antd'
import {
  HomeOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import MessageForm from './message-form'

const { Title, Paragraph, Text } = Typography

function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us – Novety King Collierville</title>
        <meta
          name='description'
          content='Get in touch with Novety King Collierville. Address, hours, phone, and a quick contact form.'
        />
      </Head>

      <div className='bg-[#f5f5f5] py-8 px-4'>
        <div className='mx-auto '>
          <Breadcrumb
            items={[
              {
                title: (
                  <Link href='/'>
                    <HomeOutlined />
                  </Link>
                ),
              },
              { title: 'Contact Us' },
            ]}
            className='mb-4'
          />

          <Space direction='vertical' size={4} className='mb-6'>
            <Title level={2} className='!mb-0'>
              Contact Novety King Collierville
            </Title>
            <Paragraph className='!mb-0 text-zinc-600'>
              Get in touch for orders, support, or general questions — we’re
              happy to help.
            </Paragraph>
          </Space>

          <Row
            gutter={[16, 16]}
            align='stretch'
            style={{ marginBottom: '16px' }}>
            <Col xs={24} lg={10}>
              <Card className='rounded-2xl'>
                <Space direction='vertical' size={16} className='w-full'>
                  <Space direction='vertical' size={8} className='w-full'>
                    <Title level={5} className='!mb-0'>
                      Store Address
                    </Title>
                    <Space>
                      <EnvironmentOutlined />
                      <Text>325 S Byhalia Rd, Collierville, Tennessee</Text>
                    </Space>
                    <Link
                      href='https://maps.google.com/?q=325+S+Byhalia+Rd+Collierville+Tennessee'
                      target='_blank'
                      className='text-blue-600'>
                      Open in Google Maps
                    </Link>
                  </Space>

                  <Divider className='!my-2' />

                  <Space direction='vertical' size={8} className='w-full'>
                    <Title level={5} className='!mb-0'>
                      Call Us
                    </Title>
                    <Space>
                      <PhoneOutlined />
                      <Link href='tel:+19016337769'>(901) 633-7769</Link>
                    </Space>
                  </Space>

                  <Divider className='!my-2' />

                  <Space direction='vertical' size={8} className='w-full'>
                    <Title level={5} className='!mb-0'>
                      Email
                    </Title>
                    <Space>
                      <MailOutlined />
                      <Link href='mailto: admin@nkcollierville.com'>
                        admin@nkcollierville.com
                      </Link>
                    </Space>
                  </Space>

                  <Divider className='!my-2' />

                  <Space direction='vertical' size={8} className='w-full'>
                    <Title level={5} className='!mb-0'>
                      Opening Times
                    </Title>
                    <Space>
                      <ClockCircleOutlined />
                      <Text>Mon – Thur: 08:00 AM – 08:00 PM (CST)</Text>
                    </Space>
                    <Space>
                      <ClockCircleOutlined />
                      <Text>Friday: 08:00 AM – 06:00 PM (CST)</Text>
                    </Space>
                    <Space>
                      <ClockCircleOutlined />
                      <Text>Saturday: 10:00 AM – 05:00 PM (CST)</Text>
                    </Space>
                    <Tag color='default' className='!mt-1'>
                      Closed on Sunday
                    </Tag>
                  </Space>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={14}>
              <Card className='rounded-2xl'>
                <Title level={4} className='!mb-2'>
                  Send Us a Message
                </Title>
                <Paragraph className='text-zinc-600'>
                  Fill out the form and our team will reach out promptly.
                </Paragraph>
                <MessageForm />
              </Card>
            </Col>
          </Row>

          <Card className='rounded-2xl mt-4'>
            <div className='relative w-full' style={{ height: 320 }}>
              <iframe
                title='Novety King Collierville Map'
                src='https://www.google.com/maps?q=325%20S%20Byhalia%20Rd,%20Collierville,%20Tennessee&output=embed'
                width='100%'
                height='100%'
                style={{ border: 0 }}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Contact
