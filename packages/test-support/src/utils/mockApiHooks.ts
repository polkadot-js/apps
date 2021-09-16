// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RegistrationJudgement } from '@polkadot/types/interfaces';

class MockApiHooks {
  public subs: string[] | undefined = [];
  public judgements: RegistrationJudgement[] | undefined = [];

  public setSubs (subs: string[] | undefined) {
    this.subs = subs;
  }

  public setJudgements (judgements: RegistrationJudgement[] | undefined) {
    console.log('SETTING', judgements);
    this.judgements = judgements;
  }
}

export const mockApiHooks = new MockApiHooks();
