// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { increaseDateByDays } from '@polkadot/app-bounties/helpers/increaseDateByDays';

describe('increase date by days', () => {
  it('changes month', () => {
    expect(increaseDateByDays(new Date(2021, 1, 28), 3)).toEqual(new Date(2021, 2, 3));
  });
  it('changes month - leap year', () => {
    expect(increaseDateByDays(new Date(2020, 1, 28), 3)).toEqual(new Date(2020, 2, 2));
  });
  it('changes year', () => {
    expect(increaseDateByDays(new Date(2021, 11, 29), 3)).toEqual(new Date(2022, 0, 1));
  });
});
