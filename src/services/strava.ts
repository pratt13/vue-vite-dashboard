import { StravaData } from '../utils/interface'

export default class StravaService {
  async getData(startDate: string, endDate: string): Promise<StravaData> {
    return await fetch(`http://localhost:5000/strava/summary?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data: StravaData) => data)
      .catch((err) => {
        console.error(err)
        // TODO: Notistack
        // Return empty to enable No data rendering
        return {} as StravaData
      })
  }
}
