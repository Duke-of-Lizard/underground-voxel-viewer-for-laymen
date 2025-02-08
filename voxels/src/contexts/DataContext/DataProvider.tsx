import { ReactNode } from 'react'
import { DataContext } from '@/contexts'

type DataProviderProps = {
  children: ReactNode
}

export const DataProvider = ({ children }: DataProviderProps) => {

  return (
    <DataContext.Provider
      value={{
        data: null,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
