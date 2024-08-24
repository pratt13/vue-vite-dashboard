class GlucoseService {
  async getAll(): Promise<any> {
    return await fetch('http://localhost:5000/glucose', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData) => glucoseData)
      .catch((err) => console.error(err))
  }
}

export default new GlucoseService()
