type TMetrics = {
  YANDEX_COUNTER_ID: number | null
  GA_TRACKING_ID: string
}

export const metrics: TMetrics = {
  YANDEX_COUNTER_ID:
    !!process.env.YANDEX_COUNTER_ID && !Number.isNaN(process.env.YANDEX_COUNTER_ID)
    ? Number(process.env.YANDEX_COUNTER_ID)
    : null,
  GA_TRACKING_ID: 'G-GGX34FMX69',
}
