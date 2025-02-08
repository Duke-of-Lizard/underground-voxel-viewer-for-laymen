import { Route, Routes } from 'react-router'
import { Loading, PageLayout } from '@/components'
import { lazy, Suspense } from 'react'

const LandingPage = lazy(() => import('@/pages/Landing'))
const SpecklePage = lazy(() => import('@/pages/Speckle'))
const UploadPage = lazy(() => import('@/pages/Upload'))

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/speckle' element={<SpecklePage />} />
          <Route path='/upload' element={<UploadPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
