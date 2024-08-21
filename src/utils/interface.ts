export interface GlucoseMedianData {
  intervals: string[]
  medianValues: number[]
  q10: number[]
  q25: number[]
  q75: number[]
  q90: number[]
  minValues: number[]
  maxValues: number[]
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

export interface GlucoseRecord {
  timestamp: string
  glucose: number
}

export interface GlucoseDayData {
  [key: string]: [string, number][]
}

export interface GlucoseTrackerData {
  rawData: [string, number][]
  metaData: GlucoseMetaData
}

export interface HBA1CRecords {
  hBA1C: number
}

export interface GlucoseIntervalPercentageRecords {
  timeInterval: string
  timeIntervalData: GlucosePercentages
}

export interface GlucosePercentages {
  numberOfHighs: number
  numberOfLows: number
  percentageOfTimeHigh: number
  percentageOfTimeInTarget: number
  percentageOfTimeLow: number
}

export interface StravaData {
  [key: string]: StravaTimestampData
}

export interface StravaTimestampData {
  timestampData: StravaTimestampRecord[]
  count: number
}
export interface StravaTimestampRecord {
  timestamp: string
  distance: number
  totalDistance: number
}
