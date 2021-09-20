// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registrar } from '@polkadot/react-hooks/types';
import type { RegistrationJudgement } from '@polkadot/types/interfaces';

class MockApiHooks {
  public subs: string[] | undefined = [];
  public judgements: RegistrationJudgement[] | undefined = [];
  public registrars: Registrar[] = [];

  public setSubs (subs: string[] | undefined) {
    this.subs = subs;
  }

  public setJudgements (judgements: RegistrationJudgement[] | undefined) {
    this.judgements = judgements;
  }

  public setRegistrars (registrars: Registrar[]) {
    this.registrars = registrars;
  }
}

export const mockApiHooks = new MockApiHooks();
