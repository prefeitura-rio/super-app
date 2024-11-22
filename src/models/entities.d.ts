export type RawCamera = {
  CameraCode: string
  CameraName: string
  CameraZone: string
  Latitude: number
  Longitude: number
  Streamming: string
}

export type Camera = {
  id: string
  name: string
  zone: string
  latitude: number
  longitude: number
  streamingUrl: string
}

export type Project = {
  id: string
  name: string
  model: string
  model_config: {
    yolo_crowd_count?: number // CROWD
    yolo_default_precision?: number
    yolo_discord_webhook_id?: string
    yolo_discord_webhook_token?: string
    yolo_send_message?: boolean
  } | null
  cameras_id: string[]
  time_start: string | null
  time_end: string | null
  discord_id: string
  enable: true
}

export type Model = {
  model: string
  description: string
}

export type AISP = {
  aisp: number
  area_geografica: string
  bairros: string
  unidades_saude: number
  escolas: number
  populacao_2022: number
  domicilios_2022: number
  total_DP_2022: number
  total_DP_ocup_2022: number
  unidade: string
  responsavel: string
  telefone_responsavel: string
}

export type CISP = {
  cisp: number
  aisp: number
  area_geografica: string
  localizacao: string
  categoria: string
  endereco: string
  responsavel: string
  telefone: string
  celular: null
  nome: string
}

export type NotificationChannel = {
  id: string
  name: string
  channel_id: string
  webhook_id: string
  webhook_token: string
}

export type School = {
  objectid: number
  cre: number
  designacao: number
  denominacao: string
  latitude: number
  longitude: number
  tipo: string
}

export type RawBusStop = {
  data_versao: string
  id_parada: string
  nome_parada: string
}

export type BusStop = {
  data_versao: string
  id_parada: string
  nome_parada: string
  longitude: number
  latitude: number
}
