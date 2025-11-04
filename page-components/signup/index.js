import React, { useState } from 'react'
import { Carousel, Image, Input, Button, Card, Flex, Form } from 'antd'
import { EmailIcon, PasswordIcon } from '@/assets/common'
import useGetSignupOTP from './hooks/useGetSignupOTP'
import useCreateSignup from './hooks/useCreateSignup'
import { useRouter } from 'next/router'

const SignUp = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [otp, setOtp] = useState()
  const { getSignupOTP, loading } = useGetSignupOTP()
  const [otpConfirmed, setOtpConfirmed] = useState(false)

  const handleChangeValues = (name, value) => {
    name(value)
  }

  const { push } = useRouter()

  const { createSignup } = useCreateSignup()

  const handleGetOTP = async () => {
    await getSignupOTP({ email })
    setOtpConfirmed(true)
  }

  const handleSignUp = () => {
    if (otpConfirmed) {
      createSignup({ email, password, otp })
    } else {
      handleGetOTP()
    }
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
        <Form className='w-full lg:w-1/2' onFinish={handleSignUp}>
          <Card
            style={{
              height: '100%',
              padding: '8px',
            }}
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
                <p>SIGN UP</p>
              </Flex>
            }>
            <div className='w-full flex flex-col items-center gap-2'>
              <Form.Item style={{ width: '100%' }} className='!mb-[12px]'>
                <Input
                  value={email}
                  prefix={<EmailIcon />}
                  placeholder='Enter your email'
                  type='email'
                  onChange={(e) => handleChangeValues(setEmail, e.target.value)}
                  variant='underlined'
                />
              </Form.Item>
              {otpConfirmed ? (
                <div
                  className=' w-full flex items-center justify-end cursor-pointer px-8 mb-[12px]'
                  onClick={loading ? () => {} : handleGetOTP}>
                  Get OTP
                </div>
              ) : (
                <Button
                  type='primary'
                  onClick={handleGetOTP}
                  loading={loading}
                  disabled={!email}>
                  Get OTP
                </Button>
              )}
            </div>
            {otpConfirmed && (
              <div className='w-full flex flex-col items-center gap-4'>
                <Form.Item className='!mb-[12px]'>
                  <Input.OTP
                    length={6}
                    color='primary'
                    onChange={(e) => handleChangeValues(setOtp, e)}
                  />
                </Form.Item>
                <Form.Item style={{ width: '100%' }} className='!mb-[12px]'>
                  <Input.Password
                    value={password}
                    size='sm'
                    prefix={<PasswordIcon />}
                    placeholder='Enter your password'
                    onChange={(e) =>
                      handleChangeValues(setPassword, e.target.value)
                    }
                    variant='underlined'
                  />
                </Form.Item>
                <Form.Item style={{ width: '100%' }} className='!mb-[12px]'>
                  <Input.Password
                    value={confirmPassword}
                    size='sm'
                    prefix={<PasswordIcon />}
                    placeholder='Confirm your password'
                    onChange={(e) =>
                      handleChangeValues(setConfirmPassword, e.target.value)
                    }
                    variant='underlined'
                  />
                </Form.Item>
                <Form.Item style={{ width: '100%' }}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    onPress={handleSignUp}
                    loading={loading}
                    disabled={!email || !password || !confirmPassword || !otp}>
                    Sign Up
                  </Button>
                </Form.Item>
              </div>
            )}
            <Button
              type='link'
              onClick={() => push('/login')}
              style={{ width: '100%' }}>
              Already have an account?
            </Button>
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

export default SignUp
