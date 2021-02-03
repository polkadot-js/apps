// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function increaseDateByDays (date: Date, days: number): Date {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate;
}
