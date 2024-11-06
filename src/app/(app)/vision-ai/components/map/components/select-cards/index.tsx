import { useContext } from 'react'

import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'

import { CameraSelectCard } from '../select-cards/camera-select-card'

export function SelectionCards() {
  const {
    layers: {
      cameras: {
        selectedObject: selectedCamera,
        handleSelectObject: setSelectedCamera,
      },
    },
  } = useContext(VisionAIMapContext)

  return (
    <>
      <CameraSelectCard
        selectedObject={selectedCamera}
        setSelectedObject={setSelectedCamera}
      />
    </>
  )
}
