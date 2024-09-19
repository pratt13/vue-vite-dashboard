import {
  GlucoseAggregateData,
  GlucoseMedianData,
  GlucoseRecords,
  GlucoseTrackerData,
  HBA1CRecords,
} from '../utils/interface'

export default class GlucoseService {
  async getAll(): Promise<GlucoseRecords> {
    return await fetch('http://localhost:5000/glucose', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData: [string, number][]) => ({ rawData: glucoseData }))
      .catch((err) => {
        console.error(err)
        // TODO: Notistack
        // Return empty to enable No data rendering
        return { rawData: [] } as GlucoseRecords
      })
  }

  async getMetaData(): Promise<GlucoseTrackerData> {
    return await fetch('http://localhost:5000/glucose/meta', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData) => glucoseData)
      .catch((err) => console.error(err))
  }

  async getAggregateData(startDate: string, endDate: string): Promise<GlucoseAggregateData> {
    const response = await fetch(
      `http://localhost:5000/glucose/aggregate/15min?start=${startDate}&end=${endDate}`,
      {
        method: 'GET',
      },
    )
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const res = await response.json()
    return res
  }

  async getMedianAggregateData(): Promise<GlucoseMedianData> {
    const response = await fetch('http://localhost:5000/glucose/aggregate/15min', {
      method: 'GET',
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const glucoseMedianData: GlucoseMedianData = await response.json()
    return glucoseMedianData
  }

  async getHBA1C(startDate: string, endDate: string): Promise<HBA1CRecords> {
    return await fetch(`http://localhost:5000/glucose/hba1c?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData: HBA1CRecords) => glucoseData)
      .catch((err) => {
        console.error(err)
        // TODO: Notistack
        // Return empty to enable No data rendering
        return {} as HBA1CRecords
      })
  }
}
