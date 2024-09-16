import { GlucoseAggregateData, GlucoseMedianData } from '../utils/intrface'

export default class GlucoseService {
  async getAll(): Promise<any> {
    return await fetch('http://localhost:5000/glucose', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData) => glucoseData)
      .catch((err) => console.error(err))
  }

  async getAggregateData(): Promise<GlucoseAggregateData> {
    const response = await fetch('http://localhost:5000/glucose/aggregate/15min', {
      method: 'GET',
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const res = await response.json()
    console.log(res)
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
}
