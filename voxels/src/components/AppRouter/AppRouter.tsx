import { Route, Routes } from 'react-router'
import { Loading, PageLayout } from '@/components'
import { lazy, Suspense } from 'react'

const LandingPage = lazy(() => import('@/pages/Landing'))
const SpecklePage = lazy(() => import('@/pages/Speckle'))
const UploadPage = lazy(() => import('@/pages/Upload'))
const AuthPage = lazy(() => import('@/pages/Auth'))

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path={`${import.meta.env.BASE_URL}`} element={<LandingPage />} />
          <Route path={`${import.meta.env.BASE_URL}speckle`} element={<SpecklePage />} />
          <Route path={`${import.meta.env.BASE_URL}upload`} element={<UploadPage />} />
          <Route path={`${import.meta.env.BASE_URL}auth`} element={<AuthPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
