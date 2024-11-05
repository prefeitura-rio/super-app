import { VisionAIMapContextProvider } from '@/contexts/vision-ai/map-context'
import { env } from '@/env'

import Map from './components/map'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full w-full flex">
      <VisionAIMapContextProvider>
        <Map mapboxAccessToken={env.MAPBOX_ACCESS_TOKEN} />
        <div className="w-[700px] h-full space-y-4">{children}</div>
      </VisionAIMapContextProvider>
    </div>
  )
}
