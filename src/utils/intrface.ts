export interface GlucoseMedianData {
  median: number[]
  q10: number[]
  q25: number[]
  q75: number[]
  q90: number[]
}

export interface GlucoseAggregateData extends GlucoseMedianData {
  raw: [string, number][]
  count: number[]
  intervals: string[]
  max: number[]
  min: number[]
  mean: number[]
  std: number[]
  var: number[]
}
