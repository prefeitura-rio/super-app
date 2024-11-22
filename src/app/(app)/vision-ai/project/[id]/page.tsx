'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, Navigation, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import { useModels } from '@/hooks/use-queries/use-models'
import { useNotificationChannels } from '@/hooks/use-queries/use-notification-channels'
import { useProject } from '@/hooks/use-queries/use-project'
import { updateProject } from '@/http/projects/update-project'
import { queryClient } from '@/lib/react-query'
import type { Project } from '@/models/entities'
import { setToastDataCookie } from '@/utils/others/cookie-handlers'
import { redirect } from '@/utils/others/redirect'

import { ChannelsManager } from '../../components/channels-manager'
import {
  type ProjectForm,
  projectFormSchema,
} from '../../components/schemas/project-schema'
import { formatCurrentDateTime } from './actions'

export default function ProjectDetails() {
  const {
    layers: {
      cameras: { setSelectedCameras, selectedCameras, cameras },
    },
    flyTo,
  } = useContext(VisionAIMapContext)
  const [isInitializingData, setIsInitializingData] = useState(true)
  const pathname = usePathname()
  const id = pathname.replace('/vision-ai/project/', '')

  const {
    data: channels,
    isPending: isPendingChannels,
    error: errorChannels,
  } = useNotificationChannels()
  const {
    data: models,
    isPending: isPendingModels,
    error: errorModels,
  } = useModels()
  const { data: project, error: errorProject } = useProject(id)

  const { mutateAsync: updateProjectFn, isPending: isPendingUpdate } =
    useMutation(
      {
        mutationFn: updateProject,
      },
      queryClient,
    )

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
      if (project && channels && cameras) {
        const channel = channels.find(
          (channel) => channel.id === project.discord_id,
        )

        if (!channel) {
          toast.error(
            'Canal de notificação não encontrado. Por favor, selecione um canal válido ou crie um novo.',
          )
        } else {
          setValue('notificationChannelId', channel.id)
        }

        setValue('name', project.name)
        setValue('model', project.model)
        setValue('enabled', project.enable)
        setValue('yolo_crowd_count', project.model_config?.yolo_crowd_count)
        if (project.model_config?.yolo_default_precision) {
          setValue(
            'yolo_default_precision',
            project.model_config.yolo_default_precision,
          )
        }

        if (project.time_start) {
          setValue('startTime', await formatCurrentDateTime(project.time_start))
        }
        if (project.time_end) {
          setValue('endTime', await formatCurrentDateTime(project.time_end))
        }

        setSelectedCameras(
          cameras.filter((camera) => project.cameras_id.includes(camera.id)),
        )

        setIsInitializingData(false)
      }

      if (
        errorProject &&
        errorProject.message === 'Request failed with status code 404'
      ) {
        await handleRedirect()
      }
    }

    initializeData()
  }, [
    cameras,
    id,
    setSelectedCameras,
    setValue,
    project,
    channels,
    errorProject,
  ])

  async function onSubmit(data: ProjectForm) {
    const channel = channels?.find(
      (channel) => channel.id === data.notificationChannelId,
    )
    if (!channel) {
      toast.error(
        'Canal de notificação não encontrado. Por favor, selecione um canal válido ou crie um novo.',
      )
      return
    }

    const payload = {
      id,
      name: data.name,
      model: data.model,
      cameras_id: selectedCameras.map((camera) => camera.id),
      enable: data.enabled,
      discord_id: channel.id,
      time_start: data.startTime?.toISOString().split('T')[1],
      time_end: data.endTime?.toISOString().split('T')[1],
      model_config: {
        yolo_default_precision: data.yolo_default_precision,
        yolo_send_message: data.yolo_send_message,
        yolo_crowd_count: data.yolo_crowd_count,
      },
    } as Project

    const updatedProject = await updateProjectFn(payload)

    // Update Project cache
    const projectCached = queryClient.getQueryData<Project>([
      'project',
      payload.id,
    ])

    if (!projectCached) {
      return
    }

    queryClient.setQueryData<Project>(
      ['project', payload.id],
      payload as Project,
    )

    // Update Projects cache
    const projectsCached = queryClient.getQueryData<Project[]>(['projects'])

    if (!projectsCached) {
      return
    }

    queryClient.setQueryData<Project[]>(
      ['projects'],
      projectsCached.map((p) =>
        p.id === payload.id ? updatedProject : p,
      ) as Project[],
    )

    redirect('/vision-ai')
  }

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
              <BreadcrumbPage>
                {isInitializingData ? (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Carregando...</span>
                    <Spinner />
                  </div>
                ) : (
                  project?.name
                )}
              </BreadcrumbPage>
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
            <Input
              id="name"
              {...register('name')}
              disabled={isInitializingData || isPendingUpdate}
            />
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
                  disabled={isInitializingData || isPendingUpdate}
                >
                  <SelectTrigger id="model" className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isPendingModels && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Carregando...
                          </span>
                          <Spinner />
                        </div>
                      )}
                      {models && models.length === 0 && (
                        <div className="w-full flex">
                          <span className="w-full text-center text-muted-foreground">
                            Nenhum modelo cadastrado
                          </span>
                        </div>
                      )}
                      {!isPendingModels && errorModels && (
                        <div className="w-full flex items-center gap-2 text-destructive">
                          <AlertCircle className="size-4" />
                          <span className="text-sm">
                            Erro ao carregar modelos. Recarregue a página e
                            tente novamente.
                          </span>
                        </div>
                      )}
                      {models ? (
                        models.map((model, index) => (
                          <SelectItem key={index} value={model.model}>
                            {model.model}
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
              {errors.notificationChannelId && (
                <span className="text-xs text-destructive">
                  {errors.notificationChannelId.message}
                </span>
              )}
            </div>
            <Controller
              control={control}
              name="notificationChannelId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isInitializingData || isPendingUpdate}
                >
                  <SelectTrigger id="notificationChannelId" className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {channels && <ChannelsManager />}
                      {isPendingChannels && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Carregando...
                          </span>
                          <Spinner />
                        </div>
                      )}
                      {channels && channels.length === 0 && (
                        <div className="w-full flex">
                          <span className="w-full text-center text-muted-foreground">
                            Nenhum canal cadastrado
                          </span>
                        </div>
                      )}
                      {!isPendingChannels && errorChannels && (
                        <div className="w-full flex items-center gap-2 text-destructive">
                          <AlertCircle className="size-4" />
                          <span className="text-sm">
                            Erro ao carregar canais. Recarregue a página e tente
                            novamente.
                          </span>
                        </div>
                      )}
                      {channels?.map((channel, index) => (
                        <SelectItem key={index} value={channel.id}>
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
                {...register('yolo_default_precision', {
                  valueAsNumber: true,
                })}
                disabled={isInitializingData || isPendingUpdate}
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
                  disabled={isInitializingData || isPendingUpdate}
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
                  disabled={isInitializingData || isPendingUpdate}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startTime">Horário de início</Label>
              <Controller
                control={control}
                name="startTime"
                render={({ field }) => (
                  <div className="w-32 flex justify-start">
                    <TimePicker
                      value={field.value}
                      defaultValue={field.value}
                      onChange={field.onChange}
                      clearButton
                      showIcon={false}
                      disabled={isInitializingData || isPendingUpdate}
                    />
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="startTime">Horário de fim</Label>
              <Controller
                control={control}
                name="endTime"
                render={({ field }) => (
                  <div className="w-32 flex justify-start">
                    <TimePicker
                      value={field.value}
                      defaultValue={field.value}
                      onChange={field.onChange}
                      clearButton
                      showIcon={false}
                      disabled={isInitializingData || isPendingUpdate}
                    />
                  </div>
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
        <Button
          variant="secondary"
          type="submit"
          disabled={isInitializingData || isPendingUpdate}
        >
          Atualizar Projeto
        </Button>
        <Button
          variant="ghost"
          asChild
          disabled={isInitializingData || isPendingUpdate}
        >
          <Link href="/vision-ai">Candelar Edição</Link>
        </Button>
      </div>
    </form>
  )
}
