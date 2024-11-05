'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Navigation, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { getNotificationChannels } from '@/assets/get-notification-channels'
import { Spinner } from '@/components/custom/spinner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TimePicker } from '@/components/ui/time-picker'
import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'
import type { Model, NotificationChannel, Project } from '@/models/entities'
import { getModelsAction } from '@/server-cache/models'
import { getProjectAction } from '@/server-cache/project'
import { setToastDataCookie } from '@/utils/others/cookie-handlers'
import { redirect } from '@/utils/others/redirect'

import {
  type ProjectForm,
  projectFormSchema,
} from '../../components/schemas/project-schema'
import { formatCurrentDateTime, updateProjectAction } from './actions'

export default function ProjectDetails() {
  const {
    layers: {
      cameras: { setSelectedCameras, selectedCameras, cameras },
    },
    flyTo,
  } = useContext(VisionAIMapContext)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const id = pathname.replace('/vision-ai/project/', '')
  const [project, setProject] = useState<Project | undefined>(undefined)
  const [models, setModels] = useState<Model[] | undefined>(undefined)
  const [notificationChannels, setNotificationChannels] = useState<
    NotificationChannel[] | undefined
  >(undefined)

  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
  })

  useEffect(() => {
    async function handleRedirect() {
      await setToastDataCookie({
        type: 'error',
        message: `O projeto de id=${id} não existe.`,
      })

      await redirect('/vision-ai')
    }

    async function initializeData() {
      getModelsAction().then((data) => {
        setModels(data)
      })
      const channels = await getNotificationChannels().then((data) => {
        setNotificationChannels(data)
        return data
      })

      const projectsResponse = await getProjectAction(id)

      if (projectsResponse) {
        setProject(projectsResponse)

        setValue('name', projectsResponse.name)
        setValue('model', projectsResponse.model)
        setValue('enabled', projectsResponse.enabled)
        setValue(
          'yolo_crowd_count',
          projectsResponse.model_config.yolo_crowd_count,
        )
        setValue(
          'yolo_default_precision',
          projectsResponse.model_config.yolo_default_precision,
        )

        if (projectsResponse.start_time) {
          setValue(
            'startTime',
            await formatCurrentDateTime(projectsResponse.start_time),
          )
        }
        if (projectsResponse.end_time) {
          setValue(
            'endTime',
            await formatCurrentDateTime(projectsResponse.end_time),
          )
        }

        const channel = channels.find(
          (channel) => channel.id === projectsResponse.discord_webhook_id,
        )
        if (!channel) throw new Error('Canal de notificação não encontrado')
        setValue('notificationChannel', channel?.name)

        setSelectedCameras(
          cameras.filter((camera) =>
            projectsResponse.camera_ids.includes(camera.id),
          ),
        )

        setLoading(false)
      } else {
        await handleRedirect()
      }
    }

    initializeData()
  }, [cameras, id, setSelectedCameras, setValue])

  async function onSubmit(data: ProjectForm) {
    const channel = notificationChannels?.find(
      (channel) => channel.name === data.notificationChannel,
    )
    if (!channel) throw new Error('Canal de notificação não encontrado')

    await updateProjectAction({
      id,
      name: data.name,
      model: data.model,
      cameras_id: selectedCameras.map((camera) => camera.id),
      enable: data.enabled,
      discord_webhook_id: channel.id,
      discord_webhook_token: channel.token,
      time_start: data.startTime?.toISOString().split('T')[1],
      time_end: data.endTime?.toISOString().split('T')[1],
      model_config: {
        yolo_default_precision: data.yolo_default_precision,
        yolo_send_message: data.yolo_send_message,
        yolo_crowd_count: data.yolo_crowd_count,
      },
    })
  }

  return loading ? (
    <Spinner className="mx-auto mt-10 size-6" />
  ) : (
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
              <BreadcrumbPage>{project?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h3 className="mt-4 mb-2 text-2xl font-bold">Editar Projeto</h3>
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
                      {models ? (
                        models.map((model, index) => (
                          <SelectItem key={index} value={model.name}>
                            {model.name}
                          </SelectItem>
                        ))
                      ) : (
                        <Spinner />
                      )}
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
                      {notificationChannels?.map((channel, index) => (
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

          <div className="grid grid-cols-2 gap-x-2 gap-y-4">
            <div className={'flex flex-col gap-1'}>
              <div className="flex items-center gap-2 h-3.5">
                <Label htmlFor="precision">Precisão</Label>
                {errors.yolo_default_precision && (
                  <span className="text-xs text-destructive text-nowrap">
                    {errors.yolo_default_precision.message}
                  </span>
                )}
              </div>
              <Input
                type="number"
                id="precision"
                step={0.001}
                {...register('yolo_default_precision', { valueAsNumber: true })}
              />
            </div>
            {watch('model') === 'CROWD' && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 h-3.5">
                  <Label htmlFor="yolo_crowd_count" className="text-nowrap">
                    Tolerância de Pessoas
                  </Label>
                  {errors.yolo_crowd_count && (
                    <span className="text-xs text-destructive text-nowrap">
                      Obrigatório
                    </span>
                  )}
                </div>
                <Input
                  type="number"
                  id="yolo_crowd_count"
                  {...register('yolo_crowd_count')}
                />
              </div>
            )}
          </div>

          <div className="space-y-0.5 flex items-center gap-2">
            <Label htmlFor="active">Ativo</Label>
            <Controller
              control={control}
              name="enabled"
              render={({ field }) => (
                <Switch
                  id="enabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
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
                  <TimePicker
                    value={field.value}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    clearButton
                    showIcon={false}
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
                  <TimePicker
                    value={field.value}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    clearButton
                    showIcon={false}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex mt-4 flex-col gap-1 h-full">
            <Label>Câmeras Selecionadas:</Label>
            <div className="h-full relative overflow-y-auto">
              <div className="absolute inset-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Localidade</TableHead>
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
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                              flyTo({
                                latitude: camera.latitude,
                                longitude: camera.longitude,
                                zoom: 16,
                              })
                            }
                          >
                            <Navigation className="shrink-0 size-4" />
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
        <Button variant="secondary" type="submit">
          Atualizar Projeto
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/vision-ai">Candelar Edição</Link>
        </Button>
      </div>
    </form>
  )
}
