// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registrar } from '@polkadot/react-hooks/types';
import type { ProxyDefinition, RegistrationJudgement, Voting } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { H256, Multisig } from '@polkadot/types/interfaces';

class MockApiHooks {
  public subs: string[] | undefined = [];
  public judgements: RegistrationJudgement[] | undefined = [];
  public registrars: Registrar[] = [];
  public multisigApprovals: [H256, Multisig][] | undefined = [];
  public delegations: Voting[] | undefined;
  public proxies: [ProxyDefinition[], BN][] | undefined = [];

  public setSubs (subs: string[] | undefined) {
    this.subs = subs;
  }

  public setJudgements (judgements: RegistrationJudgement[] | undefined) {
    this.judgements = judgements;
  }

  public setRegistrars (registrars: Registrar[]) {
    this.registrars = registrars;
  }

  public setMultisigApprovals (multisigApprovals: [H256, Multisig][]) {
    this.multisigApprovals = multisigApprovals;
  }

  public setDelegations (delegations: Voting[]) {
    this.delegations = delegations;
  }

  public setProxies (proxies: [ProxyDefinition[], BN][]) {
    this.proxies = proxies;
  }
}

export const mockApiHooks = new MockApiHooks();
