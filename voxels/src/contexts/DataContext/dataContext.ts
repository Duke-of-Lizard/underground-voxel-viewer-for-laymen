import { createContext } from 'react'

interface Data {
  id: string
}
interface DataContextProps {
  data: Data | null
}

export const DataContext = createContext({ data: null } as DataContextProps)
