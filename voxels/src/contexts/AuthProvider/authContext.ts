import { createContext } from 'react'

interface AuthContextInterface {
  token: string | undefined
  refreshToken: string | undefined
  login: () => void
  exchangeAccessCode(accessCode: string): Promise<void>
  logOut: () => void
}

export const AuthContext = createContext({} as AuthContextInterface)
