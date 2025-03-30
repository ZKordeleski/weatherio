export interface WeatherData {
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    description?: string;
    days: DayWeather[];
    currentConditions?: CurrentConditions;
    alerts?: Alert[];
}

export interface DayWeather {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    tempmax: number;
    tempmin: number;
    humidity: number;
    precip: number;
    precipprob: number;
    preciptype: string[] | null;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    uvindex: number;
    conditions: string;
    icon: string;
    source: string;
    sunrise?: string;
    sunset?: string;
    moonphase?: number;
    hours: HourWeather[]; // We need to ensure hours is always selected.
}

export interface HourWeather {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    precip: number;
    precipprob: number;
    preciptype: string[] | null;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    uvindex: number;
    conditions: string;
    icon: string;
}

export interface CurrentConditions {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    precip: number;
    precipprob: number;
    preciptype: string[] | null;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    uvindex: number;
    conditions: string;
    icon: string;
}

export interface Alert {
    event: string;
    description: string;
}