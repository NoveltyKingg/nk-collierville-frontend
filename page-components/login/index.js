import React, { useState } from 'react'
import { Card, Image, Input, Form, Button, Carousel, Flex } from 'antd'
import { EmailIcon, NoveltyMainIcon, PasswordIcon } from '@/assets/common'
import useLogin from './hooks/useLogin'
import { useRouter } from 'next/router'
import useIsMobile from '@/utils/useIsMobile'

const Login = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const { login, loading } = useLogin()
  const { isMobile } = useIsMobile()
  const { push } = useRouter()

  const handleChangeValues = (setter, value) => {
    setter(value)
  }

  const handleLogin = () => {
    login(email, password)
  }

  return (
    <div
      className='w-full h-screen flex items-center justify-center px-4'
      style={{
        backgroundImage:
          "url('https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/login+collierville.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className='w-full max-w-4xl'>
        <div
          className='w-full rounded-[48px] shadow-2xl flex items-center justify-center px-3 py-6 sm:px-6 md:px-8 lg:px-10'
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.18), rgba(0,0,0,0.08))',
            border: '1px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(10px)',
          }}>
          <div className='flex flex-col lg:flex-row gap-6 lg:gap-10 w-full items-center justify-center'>
            <Form
              onFinish={handleLogin}
              className='w-full lg:max-w-sm flex justify-center h-full items-center'>
              <Card
                style={{
                  width: '100%',
                  borderRadius: 36,
                  boxShadow: '0 26px 60px rgba(0,0,0,0.40)',
                  background: '#ffffff',
                  padding: '20px',
                }}
                title={
                  <div className='flex flex-col items-center gap-2 mb-2'>
                    <NoveltyMainIcon />
                    <span className='mt-2 px-4 py-1 rounded-full bg-[#f5f6fa] text-[11px] tracking-[5px] uppercase text-gray-600'>
                      Login
                    </span>
                  </div>
                }>
                <div className='mt-2'>
                  <Form.Item style={{ marginBottom: 16 }}>
                    <Input
                      value={email}
                      name='email'
                      placeholder='Username'
                      type='email'
                      prefix={<EmailIcon />}
                      onChange={(e) =>
                        handleChangeValues(setEmail, e.target.value)
                      }
                      className='!rounded-full !h-11 !px-5 !bg-[#f2f2f2] !border-0 !shadow-none
                 !text-[13px] placeholder:italic placeholder:text-gray-400'
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 10 }}>
                    <Input.Password
                      name='current-password'
                      placeholder='Password'
                      prefix={<PasswordIcon />}
                      onChange={(e) =>
                        handleChangeValues(setPassword, e.target.value)
                      }
                      className='!rounded-full !h-11 !px-5 !bg-[#f2f2f2] !border-0 !shadow-none
                 !text-[13px] placeholder:italic placeholder:text-gray-400'
                    />
                  </Form.Item>
                  <div className='flex items-center justify-end text-[12px] text-gray-500 mb-4'>
                    <button
                      type='button'
                      onClick={() => push('/forgot-password')}
                      className='hover:text-gray-700 cursor-pointer'>
                      Forgot Password?
                    </button>
                  </div>
                  <Form.Item style={{ marginBottom: 12 }}>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={loading}
                      disabled={!email || !password}
                      className='w-full rounded-full text-sm tracking-wide'>
                      Log in
                    </Button>
                  </Form.Item>
                  <div className='flex items-center gap-2 my-2'>
                    <span className='h-px flex-1 bg-gray-300/80' />
                    <span className='text-[11px] text-gray-500'>Or</span>
                    <span className='h-px flex-1 bg-gray-300/80' />
                  </div>
                  <Button
                    className='w-full !h-11 rounded-full text-sm border-0 bg-[#e6eee9] text-gray-700'
                    onClick={() => push('/signup')}>
                    Sign up
                  </Button>
                </div>
              </Card>
            </Form>
            {!isMobile && (
              <div className='w-full flex justify-center items-center'>
                <div
                  className='max-w-[400px] h-full rounded-[32px] overflow-hidden'
                  style={{
                    backdropFilter: 'blur(18px)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.28)',
                  }}>
                  <Carousel
                    autoplay
                    autoplaySpeed={3500}
                    effect='fade'
                    dots={false}>
                    {[1, 2].map((_, i) => (
                      <Image
                        src='https://i.ibb.co/1Gv63CD3/Chat-GPT-Image-Jul-22-2025-01-43-27-PM.png'
                        alt={`Slide ${i + 1}`}
                        key={i}
                        preview={false}
                        width={400}
                        style={{
                          filter: 'brightness(0.8)',
                        }}
                      />
                    ))}
                  </Carousel>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
