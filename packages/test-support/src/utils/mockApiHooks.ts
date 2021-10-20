// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registrar } from '@polkadot/react-hooks/types';
import type { ProxyDefinition, RegistrationJudgement, Voting } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { H256, Multisig } from '@polkadot/types/interfaces';

class MockApiHooks {
  public multisigApprovals: [H256, Multisig][] | undefined = [];
  public delegations: Voting[] | undefined;
  public proxies: [ProxyDefinition[], BN][] | undefined = [];
  public subs: string[] | undefined = [];
  public judgements: RegistrationJudgement[] | undefined = [];
  public registrars: Registrar[] = [];

  public setDelegations (delegations: Voting[]) {
    this.delegations = delegations;
  }

  public setMultisigApprovals (multisigApprovals: [H256, Multisig][]) {
    this.multisigApprovals = multisigApprovals;
  }

  public setProxies (proxies: [ProxyDefinition[], BN][]) {
    this.proxies = proxies;
  }

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
