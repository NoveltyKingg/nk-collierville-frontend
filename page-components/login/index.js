import React, { useState } from 'react'
import { Card, Image, Input, Form, Button, Carousel, Flex } from 'antd'
import { EmailIcon, PasswordIcon } from '@/assets/common'
import useLogin from './hooks/useLogin'
import { useRouter } from 'next/router'

const Login = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const { login, loading } = useLogin()

  const handleChangeValues = (name, value) => {
    name(value)
  }

  const { push } = useRouter()

  const handleLogin = () => {
    login(email, password)
  }

  return (
    <div
      className='w-full h-screen flex items-center justify-center'
      style={{
        backgroundImage:
          "url('https://i.ibb.co/1Gv63CD3/Chat-GPT-Image-Jul-22-2025-01-43-27-PM.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className='flex flex-col lg:flex-row gap-8 max-w-4xl w-full px-4'>
        <Form onFinish={handleLogin} className='w-full lg:w-1/2'>
          <Card
            title={
              <Flex align='center' gap={20} className='w-full'>
                <Image
                  alt='heroui logo'
                  height={40}
                  radius='sm'
                  src='https://avatars.githubusercontent.com/u/86160567?s=200&v=4'
                  width={40}
                  preview={false}
                />
                <p>LOGIN</p>
              </Flex>
            }
            style={{ height: '100%', padding: '8px' }}>
            <Flex
              vertical
              align='center'
              justify='center'
              className='w-full h-full'
              gap={20}>
              <Form.Item style={{ width: '100%' }}>
                <Input
                  value={email}
                  name='email'
                  placeholder='Enter your email'
                  type='email'
                  prefix={<EmailIcon />}
                  variant='underlined'
                  onChange={(e) => handleChangeValues(setEmail, e.target.value)}
                />
              </Form.Item>
              <Form.Item style={{ width: '100%' }}>
                <Input.Password
                  name='current-password'
                  variant='underlined'
                  placeholder='Enter your password'
                  prefix={<PasswordIcon />}
                  onChange={(e) =>
                    handleChangeValues(setPassword, e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={loading}
                  disabled={!email || !password}>
                  Login
                </Button>
              </Form.Item>
              <div>
                Do not have an account{' '}
                <Button type='link' onClick={() => push('/signup')}>
                  Create One!
                </Button>
              </div>
              <Button type='link' onClick={() => push('/forgot-password')}>
                Forgot Password?
              </Button>
            </Flex>
          </Card>
        </Form>
        <div className='w-full lg:w-1/2'>
          <Card>
            <Carousel autoplay autoplaySpeed={3000} dots>
              {[1, 2].map((_, i) => (
                <div key={i} className='h-full w-full'>
                  <Image
                    src='https://i.ibb.co/1Gv63CD3/Chat-GPT-Image-Jul-22-2025-01-43-27-PM.png'
                    alt={`Slide ${i + 1}`}
                    preview={false}
                    style={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
