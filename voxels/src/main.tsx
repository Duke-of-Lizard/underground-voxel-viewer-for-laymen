import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AppRouter, theme } from '@/components'
import { MantineProvider } from '@mantine/core'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/900.css'
import '@mantine/core/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <AppRouter />
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
)
