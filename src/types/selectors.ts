// DAYS OF WEEK (0 = Sunday, 6 = Saturday)
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// TIME RANGES
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface TimeRange {
  value: TimeOfDay;
  label: string;
  startHour: number;
  endHour: number;
}

export const TIME_RANGES: TimeRange[] = [
  { value: 'morning', label: 'Morning (8am-12pm)', startHour: 8, endHour: 12 },
  { value: 'afternoon', label: 'Afternoon (12pm-5pm)', startHour: 12, endHour: 17 },
  { value: 'evening', label: 'Evening (5pm-9pm)', startHour: 17, endHour: 21 }
];