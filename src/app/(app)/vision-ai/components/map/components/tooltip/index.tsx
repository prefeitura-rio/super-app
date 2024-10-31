import { useContext } from 'react'

import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'

import { AISPHoverCard } from './components/aisp-hover-card'
import { CameraHoverCard } from './components/camera-hover-card'

export function Tooltips() {
  const {
    layers: {
      cameras: {
        hoverInfo: cameraHoverInfo,
        setIsHoveringInfoCard: setIsHoveringCameraInfoCard,
      },
      aisp: {
        hoverInfo: AISPHoverInfo,
        setIsHoveringInfoCard: setIsHoveringAISPInfoCard,
      },
    },
  } = useContext(VisionAIMapContext)

  return (
    <>
      <CameraHoverCard
        hoveredObject={cameraHoverInfo}
        setIsHoveringInfoCard={setIsHoveringCameraInfoCard}
      />
      <AISPHoverCard
        hoveredObject={AISPHoverInfo}
        setIsHoveringInfoCard={setIsHoveringAISPInfoCard}
      />
    </>
  )
}
