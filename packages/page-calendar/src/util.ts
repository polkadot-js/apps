// Copyright 2017-2025 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DateState } from './types.js';

import { DAYS } from './constants.js';

export function newZeroDate (input: Date): Date {
  const date = new Date(input);

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

export function nextMonth (date: Date, firstDay = 1): Date {
  const currMonth = date.getMonth();

  return currMonth === 11
    ? new Date(date.getFullYear() + 1, 0, firstDay)
    : new Date(date.getFullYear(), currMonth + 1, firstDay);
}

export function prevMonth (date: Date): Date {
  const currMonth = date.getMonth();

  return currMonth === 0
    ? new Date(date.getFullYear() - 1, 11, 1)
    : new Date(date.getFullYear(), currMonth - 1, 1);
}

export function getDateState (_dateMonth: Date, _dateSelected: Date): DateState {
  const dateMonth = newZeroDate(_dateMonth);

  dateMonth.setDate(1);

  const dateMonthNext = nextMonth(dateMonth);
  const dateSelected = newZeroDate(_dateSelected);
  const numDays = nextMonth(dateMonth, 0).getDate();
  const days: number[] = [];

  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  return {
    dateMonth,
    dateMonthNext,
    dateSelected,
    days,
    startClass: `start${DAYS[dateMonth.getDay()]}`
  };
}

export function dateCalendarFormat (date: Date): string {
  return new Date(date)
    .toISOString()
    .split('.')[0]
    .replace(/-/g, '')
    .replace(/:/g, '') + 'Z';
}
