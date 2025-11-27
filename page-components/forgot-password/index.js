import React, { useEffect, useState } from 'react'
import { Input, Button, Card, Flex, Carousel, Image } from 'antd'
import { useRouter } from 'next/router'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useIsMobile from '@/utils/useIsMobile'
import setCookie from '@/utils/set-cookie'
import { getCookie } from '@/utils/get-cookie'
import useForgotPassword from './hooks/useForgotPassword'
import useResetPassword from './hooks/useResetPassword'
import { EmailIcon, PasswordIcon, NoveltyMainIcon } from '@/assets/common'

function ForgotPassword() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [isMatched, setIsMatched] = useState(false)
  const [token, setToken] = useState()

  const { query, push } = useRouter()
  const { forgotPassword, loading } = useForgotPassword()
  const { resetPassword, resetPassowrdLoading } = useResetPassword()
  const { isMobile } = useIsMobile()

  const handleEmail = (e) => {
    setEmail(e?.target.value)
  }

  useEffect(() => {
    const value = getCookie('nk-collierville-forgot-token')
    setToken(value)
  }, [])

  const handlePassword = (e) => {
    setPassword(e?.target?.value)
  }

  const handleConfirmPassword = (e) => {
    const matched = password === e.target?.value
    setIsMatched(matched)
  }

  useEffect(() => {
    if (query?.key) {
      setCookie('nk-collierville-forgot-token', query?.key, 1)
      push('/forgot-password')
    }
  }, [query])

  const handleForgotPassword = () => {
    token ? resetPassword({ password }) : forgotPassword({ email })
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
              'linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08))',
            border: '1px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(10px)',
          }}>
          <div className='flex flex-col lg:flex-row gap-6 lg:gap-10 w-full items-center justify-center'>
            <div className='w-full lg:max-w-sm flex justify-center h-full items-center'>
              <Card
                style={{
                  width: '100%',
                  borderRadius: 36,
                  boxShadow: '0 26px 60px rgba(0,0,0,0.40)',
                  background: '#ffffff',
                  padding: '20px',
                }}
                title={
                  <div className='flex flex-col items-center gap-2'>
                    <NoveltyMainIcon />
                    <span className='mt-2 px-4 py-1 rounded-full bg-[#f5f6fa] text-[11px] tracking-[0.35em] uppercase text-gray-600 mb-2'>
                      {token ? 'Reset Password' : 'Forgot Password'}
                    </span>
                  </div>
                }>
                <Flex vertical gap={16}>
                  {!token ? (
                    <>
                      <Button
                        type='link'
                        onClick={() => push('/login')}
                        icon={<ArrowLeftOutlined />}>
                        Back to Login
                      </Button>
                      <Input
                        placeholder='Email'
                        value={email}
                        onChange={handleEmail}
                        prefix={<EmailIcon />}
                        className='!rounded-full !h-11 !px-5 !bg-[#f2f2f2] !border-0 !shadow-none
                          !text-[13px] placeholder:italic placeholder:text-gray-400'
                      />
                    </>
                  ) : (
                    <>
                      <Input.Password
                        placeholder='New Password'
                        value={password}
                        onChange={handlePassword}
                        prefix={<PasswordIcon />}
                        className='!rounded-full !h-11 !px-5 !bg-[#f2f2f2] !border-0 !shadow-none
                          !text-[13px] placeholder:italic placeholder:text-gray-400'
                      />

                      <Input.Password
                        placeholder='Confirm Password'
                        onChange={handleConfirmPassword}
                        prefix={<PasswordIcon />}
                        className='!rounded-full !h-11 !px-5 !bg-[#f2f2f2] !border-0 !shadow-none
                          !text-[13px] placeholder:italic placeholder:text-gray-400'
                      />

                      {!isMatched && password && (
                        <div className='text-red-700 text-xs'>
                          Password not matched
                        </div>
                      )}
                    </>
                  )}

                  <Button
                    className='w-full !h-11 rounded-full text-sm tracking-wide'
                    type='primary'
                    onClick={handleForgotPassword}
                    loading={loading || resetPassowrdLoading}
                    disabled={!(email || isMatched)}>
                    {token ? 'Reset Password' : 'Forgot Password'}
                  </Button>

                  {!token && (
                    <Button
                      className='w-full !h-11 rounded-full text-sm border-0 bg-[#e6eee9] text-gray-700'
                      onClick={() => push('/login')}>
                      Remembered your password? Log in
                    </Button>
                  )}
                </Flex>
              </Card>
            </div>

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

export default ForgotPassword
