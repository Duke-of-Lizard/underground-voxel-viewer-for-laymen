import { dataPoint } from '@/types/datapoint'

export const getMinMaxByKey = <T extends keyof dataPoint>(data: dataPoint[], key: T): [number, number] => {
  const values = data.map((point) => point[key])
  return [Math.min(...values), Math.max(...values)]
}

export const getNormalizedData = <T extends keyof dataPoint>(data: dataPoint[], key: T): dataPoint[] => {
  const [min, max] = getMinMaxByKey(data, key)
  return data.map((point) => ({ ...point, [key]: (point[key] - min) / (max - min) }))
}
