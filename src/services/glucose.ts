import {
  GlucoseAggregateData,
  GlucoseDayData,
  GlucoseIntervalPercentageRecords,
  GlucoseMedianData,
  GlucoseRecord,
  HBA1CRecords,
} from '../utils/interface'

export default class GlucoseService {
  async getAll(startDate: string, endDate: string): Promise<GlucoseRecord[]> {
    return await fetch(`http://localhost:5000/glucose?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData: GlucoseRecord[]) => glucoseData)
      .catch((err) => {
        console.error(err)
        // TODO: Notistack
        // Return empty to enable No data rendering
        return [] as GlucoseRecord[]
      })
  }

  async getDayData(startDate: string, endDate: string): Promise<GlucoseDayData> {
    return await fetch(`http://localhost:5000/glucose/days?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData: GlucoseDayData) => glucoseData)
      .catch((err) => {
        console.error(err)
        // TODO: Notistack
        // Return empty to enable No data rendering
        return {} as GlucoseDayData
      })
  }

  async getQuartileData(startDate: string, endDate: string): Promise<GlucoseMedianData> {
    return await fetch(`http://localhost:5000/glucose/quartile?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData) => glucoseData)
      .catch((err) => {
        console.error(err)
        return {} as GlucoseMedianData
      })
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

  async getGlucosePercentages(
    startDate: string,
    endDate: string,
  ): Promise<GlucoseIntervalPercentageRecords[]> {
    return await fetch(
      `http://localhost:5000/glucose/percentage?start=${startDate}&end=${endDate}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((glucoseData: GlucoseIntervalPercentageRecords[]) => glucoseData)
      .catch((err) => {
        console.error(err)
        // TODO: Notistack
        // Return empty to enable No data rendering
        return [{} as GlucoseIntervalPercentageRecords]
      })
  }

  async getGlucosePercentagesGroupedByDay(
    startDate: string,
    endDate: string,
    bucket: string,
  ): Promise<GlucoseIntervalPercentageRecords[]> {
    return await fetch(
      `http://localhost:5000/glucose/percentage/day?start=${startDate}&end=${endDate}&bucket=${bucket}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((glucoseData: GlucoseIntervalPercentageRecords[]) => glucoseData)
      .catch((err) => {
        console.error(err)
        // TODO: Notistack
        // Return empty to enable No data rendering
        return [{} as GlucoseIntervalPercentageRecords]
      })
  }
}
