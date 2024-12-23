'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  BusFront,
  ChevronUp,
  Layers,
  School,
  Shield,
  Video,
} from 'lucide-react'
import { useContext, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Toggle } from '@/components/ui/toggle'
import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'

type Layer = {
  name: string
  icon: React.ReactNode
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

export function LayerToggle() {
  const [isOpen, setIsOpen] = useState(false)

  const {
    layers: {
      cameras: {
        isVisible: isCamerasVisible,
        setIsVisible: setIsCamerasVisible,
      },
      AISP: { isVisible: isAISPVisible, setIsVisible: setIsAISPVisible },
      CISP: { isVisible: isCISPVisible, setIsVisible: setIsCISPVisible },
      schools: {
        isVisible: isSchoolsVisible,
        setIsVisible: setIsSchoolsVisible,
      },
      busStops: {
        isVisible: isBusStopsVisible,
        setIsVisible: setIsBusStopsVisible,
      },
    },
  } = useContext(VisionAIMapContext)

  const layers: Layer[] = [
    {
      name: 'Câmeras',
      icon: <Video />,
      isVisible: isCamerasVisible,
      setIsVisible: setIsCamerasVisible,
    },
    {
      name: 'AISP',
      icon: <Shield />,
      isVisible: isAISPVisible,
      setIsVisible: (isVisible) => {
        setIsAISPVisible(isVisible)
        if (isVisible) setIsCISPVisible(false)
      },
    },
    {
      name: 'CISP',
      icon: <Shield />,
      isVisible: isCISPVisible,
      setIsVisible: (isVisible) => {
        setIsCISPVisible(isVisible)
        if (isVisible) setIsAISPVisible(false)
      },
    },
    {
      name: 'Escolas Municipais',
      icon: <School />,
      isVisible: isSchoolsVisible,
      setIsVisible: setIsSchoolsVisible,
    },
    {
      name: 'Paradas de Ônibus',
      icon: <BusFront />,
      isVisible: isBusStopsVisible,
      setIsVisible: setIsBusStopsVisible,
    },
  ]

  return (
    <Card className="absolute bottom-4 left-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <motion.div
          initial={false}
          animate={{
            width: isOpen ? 180 : 60,
            height: isOpen ? 'auto' : 40,
            transition: { duration: 0.3, ease: 'easeInOut' },
          }}
          className="overflow-hidden rounded-lg shadow-lg"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between p-2"
            >
              <Layers className="size-6 shrink-0" />
              <span className={`ml-2 ${isOpen ? 'inline' : 'hidden'}`}>
                Camadas
              </span>
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={isOpen ? 'ml-auto' : ''}
              >
                <ChevronUp className="size-4 shrink-0" />
              </motion.div>
            </Button>
          </CollapsibleTrigger>
          <AnimatePresence initial={false}>
            {isOpen && (
              <CollapsibleContent forceMount asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {layers.map((layer, index) => (
                        <Toggle
                          key={index}
                          pressed={layer.isVisible}
                          onPressedChange={layer.setIsVisible}
                          className="flex size-20 shrink-0 flex-col items-center justify-center data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          aria-label={`Toggle ${layer.name} layer`}
                        >
                          {layer.icon}
                          <span className="mt-1 text-xs">{layer.name}</span>
                        </Toggle>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </motion.div>
      </Collapsible>
    </Card>
  )
}
