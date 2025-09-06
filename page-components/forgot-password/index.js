import React, { useEffect, useState } from 'react'
import { Input, Button, Card, Flex } from 'antd'
import { useRouter } from 'next/router'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useIsMobile from '@/utils/useIsMobile'
import setCookie from '@/utils/set-cookie'
import { getCookie } from '@/utils/get-cookie'
import useForgotPassword from './hooks/useForgotPassword'
import useResetPassword from './hooks/useResetPassword'

function ForgotPassword() {
  const [email, setEmail] = useState()
  const { query, push } = useRouter()
  const [password, setPassword] = useState()
  const [isMatched, setIsMatched] = useState(false)
  const [token, setToken] = useState()

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
      className='w-full h-screen flex items-center justify-center'
      style={{
        backgroundImage:
          "url('https://i.ibb.co/1Gv63CD3/Chat-GPT-Image-Jul-22-2025-01-43-27-PM.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <Card className='w-[400px]'>
        <Flex vertical gap={20}>
          {token ? (
            <Flex vertical gap={12}>
              <Input.Password
                placeholder='New Password'
                value={password}
                onChange={handlePassword}
                style={{ width: isMobile ? '92%' : '100%' }}
              />
              <Input.Password
                placeholder='Confirm Password'
                onChange={handleConfirmPassword}
                style={{ width: isMobile ? '92%' : '100%' }}
              />
              {!isMatched && password && (
                <div className='text-red-700'>Password not matched</div>
              )}
            </Flex>
          ) : (
            <Flex vertical gap={12} align='flex-start'>
              <Button
                type='link'
                onClick={() => push('/login')}
                icon={<ArrowLeftOutlined />}>
                Back to Login
              </Button>
              <Input
                placeholder='Enter your email'
                value={email}
                onChange={handleEmail}
                style={{ width: isMobile ? '92%' : '100%' }}
              />
            </Flex>
          )}
          <Button
            style={{ width: 200 }}
            type='primary'
            onClick={handleForgotPassword}
            loading={loading || resetPassowrdLoading}
            disabled={!(email || isMatched)}>
            {token ? 'Reset Password' : 'Forgot Password'}
          </Button>
        </Flex>
      </Card>
    </div>
  )
}

export default ForgotPassword
