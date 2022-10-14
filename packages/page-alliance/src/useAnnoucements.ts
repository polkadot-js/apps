// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAllianceCid } from '@polkadot/types/lookup';
import type { Cid } from './types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { createCid } from './util';

const OPT_ANN = {
  transform: (cids: PalletAllianceCid[]): Cid[] =>
    cids.map(createCid)
};

function useAnnouncementsImpl (): Cid[] | undefined {
  const { api } = useApi();

  return useCall<Cid[]>(api.query.alliance.announcements, [], OPT_ANN);
}

export default createNamedHook('useAnnouncements', useAnnouncementsImpl);
