import { useContext } from 'react'

import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'

import { AISPHoverCard } from './components/aisp-hover-card'
import { CameraHoverCard } from './components/camera-hover-card'
import { CISPHoverCard } from './components/cisp-hover-card'

export function Tooltips() {
  const {
    layers: {
      cameras: {
        hoverInfo: cameraHoverInfo,
        setIsHoveringInfoCard: setIsHoveringCameraInfoCard,
      },
      AISP: {
        hoverInfo: AISPHoverInfo,
        setIsHoveringInfoCard: setIsHoveringAISPInfoCard,
      },
      CISP: {
        hoverInfo: CISPHoverInfo,
        setIsHoveringInfoCard: setIsHoveringCISPInfoCard,
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
      <CISPHoverCard
        hoveredObject={CISPHoverInfo}
        setIsHoveringInfoCard={setIsHoveringCISPInfoCard}
      />
    </>
  )
}
