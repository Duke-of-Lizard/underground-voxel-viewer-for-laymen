import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '@/contexts'
import { Container } from '@mantine/core'
import { Loading } from '@/components'

export const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { exchangeAccessCode } = useAuth()

  useEffect(() => {
    if (searchParams.has('access_code')) {
      const accessCode = searchParams.get('access_code')!
      setSearchParams({})
      exchangeAccessCode(accessCode).then(() => {
        navigate(`${import.meta.env.BASE_URL}upload`)
      })
    }
  }, [searchParams, exchangeAccessCode, setSearchParams, navigate])

  return (
    <Container>
      <Loading />
    </Container>
  )
}
