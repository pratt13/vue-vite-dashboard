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

export interface GlucoseMetaData {
  percentageOfTimeInTarget: number
  percentageOfTimeLow: number
  percentageOfTimeHigh: number
  numberHighs: number
  numberLows: number
  mean: number
  stDev: number
}

export interface GlucoseRecords {
  rawData: [string, number][]
}

export interface GlucoseTrackerData {
  rawData: [string, number][]
  metaData: GlucoseMetaData
}

export interface HBA1CRecords {
  hBA1C: number
}
