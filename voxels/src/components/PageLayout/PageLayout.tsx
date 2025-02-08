import { AppShell, rem, useMantineTheme } from '@mantine/core'
import { ErrorBoundary, Header } from '@/components'
import { Outlet } from 'react-router'

export const PageLayout = () => {
  const theme = useMantineTheme()
  return (
    <AppShell header={{ height: 80 }} padding='xl' withBorder={true}>
      <AppShell.Header>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
      </AppShell.Header>
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-xl))`} bg={theme.other.backgroundColor}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </AppShell.Main>
    </AppShell>
  )
}
