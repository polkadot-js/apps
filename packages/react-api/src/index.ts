// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Api, { api, DEFAULT_DECIMALS, DEFAULT_SS58 } from './Api';
import ApiContext from './ApiContext';
import { withApi, withCallDiv, withCalls, withMulti, withObservable } from './hoc';
import { clearLedger, getLedger, isLedger, isLedgerCapable } from './ledger';
import registry from './typeRegistry';

export {
  api,
  Api,
  ApiContext,
  DEFAULT_DECIMALS,
  DEFAULT_SS58,
  registry,
  withApi,
  withCalls,
  withCallDiv,
  withMulti,
  withObservable,
  clearLedger,
  getLedger,
  isLedger,
  isLedgerCapable
};
