import type { WeatherData } from "../types/weather";

// TODO: I think we could preprocess all of the weather data and apply user set ranges.

interface GoodDayMetrics = {
    feelslike: [min: number, max: number]
}

const goodDayMetrics = {
    feelslike: [60, 80],
    windspeed: [0, 10],
    precipprob: [0, 20],
    uvindex: [0, 7]
}

function isBetween(value: number, range: [min: number, max: number]) {
    return (value >= range[0] && value <= range[1]);
}

function processWeatherData(data: WeatherData): WeatherData {
    const days = data.days;
    for (const day of days) {
        const hours = day.hours;
        for (const hour of hours) {
            const {feelslike, windspeed, precipprob, uvindex} = hour;
        }
    }
}