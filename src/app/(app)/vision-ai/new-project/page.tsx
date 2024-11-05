'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Navigation, X } from 'lucide-react'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { getNotificationChannels } from '@/assets/get-notification-channels'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'
import { type Model, type NotificationChannel } from '@/models/entities'
import { getModelsAction } from '@/server-cache/models'
import { redirect } from '@/utils/others/redirect'

import {
  type ProjectForm,
  projectFormSchema,
} from '../components/schemas/project-schema'
import { createProjectAction } from './actions'

export default function Page() {
  const [models, setModels] = useState<Model[]>([])
  const [notificationChannels, setNotificationChannels] = useState<
    NotificationChannel[]
  >([])

  const {
    layers: {
      cameras: { selectedCameras, setSelectedCameras },
    },
    flyTo,
  } = useContext(VisionAIMapContext)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      enabled: true,
    },
  })

  async function onSubmit(data: ProjectForm) {
    const channel = notificationChannels.find(
      (c) => c.name === data.notificationChannel,
    )
    if (!channel) throw new Error('Canal de notificação não encontrado.')

    const project = await createProjectAction({
      name: data.name,
      model: data.model,
      cameras_id: selectedCameras.map((camera) => camera.id),
      discord_webhook_id: channel.id,
      discord_webhook_token: channel.token,
      time_start: data.startTime?.toISOString(),
      time_end: data.endTime?.toISOString(),
    })
    await redirect(`/vision-ai/project/${project.id}`)
  }

  useEffect(() => {
    async function initializeData() {
      getModelsAction().then((data) => setModels(data))
      getNotificationChannels().then((data) => {
        setNotificationChannels(data)
      })
    }
    initializeData()
  }, [])

  return (
    <form
      className="flex flex-col gap-2 h-screen max-h-screen px-4 py-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col h-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/vision-ai">Projetos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Novo Projeto</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h3 className="mt-4 mb-2 text-2xl font-bold">Novo Projeto</h3>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 h-3.5">
              <Label htmlFor="name">Nome</Label>
              {errors.name && (
                <span className="text-xs text-destructive">
                  {errors.name.message}
                </span>
              )}
            </div>
            <Input id="name" {...register('name')} />
          </div>
          {/* <div className="flex flex-col gap-1">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register('description')} />
          </div> */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 h-3.5">
              <Label htmlFor="model">Modelo</Label>
              {errors.model && (
                <span className="text-xs text-destructive">
                  {errors.model.message}
                </span>
              )}
            </div>
            <Controller
              control={control}
              name="model"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="model" className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {models.map((model, index) => (
                        <SelectItem key={index} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 h-3.5">
              <Label htmlFor="notificationChannel">Canal de Notificação</Label>
              {errors.notificationChannel && (
                <span className="text-xs text-destructive">
                  {errors.notificationChannel.message}
                </span>
              )}
            </div>
            <Controller
              control={control}
              name="notificationChannel"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="notificationChannel" className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {notificationChannels.map((channel, index) => (
                        <SelectItem key={index} value={channel.name}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startTime">Data de início</Label>
              <Controller
                control={control}
                name="startTime"
                render={({ field }) => (
                  <DatePicker
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                    type="datetime-local"
                    clearButton
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="startTime">Data de fim</Label>
              <Controller
                control={control}
                name="endTime"
                render={({ field }) => (
                  <DatePicker
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                    type="datetime-local"
                    clearButton
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 h-full">
            <Label>Câmeras Selecionadas</Label>
            <div className="h-full relative overflow-y-auto">
              <div className="absolute inset-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCameras.map((camera, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {camera.id}
                        </TableCell>
                        <TableCell>{camera.name}</TableCell>
                        <TableCell className="text-right flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            onClick={() =>
                              flyTo({
                                latitude: camera.latitude,
                                longitude: camera.longitude,
                                zoom: 16,
                              })
                            }
                          >
                            <Navigation className="size-3.5 shrink-0" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            onClick={() =>
                              setSelectedCameras(
                                selectedCameras.filter(
                                  (c) => c.id !== camera.id,
                                ),
                              )
                            }
                          >
                            <X className="size-3.5 shrink-0" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="secondary">Criar Projeto</Button>
        <Button variant="ghost" asChild>
          <Link href="/vision-ai">Candelar</Link>
        </Button>
      </div>
    </form>
  )
}
