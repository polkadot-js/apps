// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Info } from './types.js';

import React, { useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import Extrinsics from '../BlockInfo/Extrinsics.js';
import { useTranslation } from '../translate.js';
import Peers from './Peers.js';
import Summary from './Summary.js';

const POLL_TIMEOUT = 9900;

async function retrieveInfo (api: ApiPromise): Promise<Partial<Info>> {
  try {
    const [blockNumber, health, peers, extrinsics] = await Promise.all([
      api.derive.chain.bestNumber(),
      api.rpc.system.health().catch(() => null),
      api.rpc.system.peers().catch(() => null),
      api.rpc.author.pendingExtrinsics().catch(() => null)
    ]);

    return { blockNumber, extrinsics, health, peers };
  } catch {
    return {};
  }
}

function NodeInfo (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [info, setInfo] = useState<Partial<Info>>({});
  const [nextRefresh, setNextRefresh] = useState(() => Date.now());

  useEffect((): () => void => {
    const getStatus = (): void => {
      setNextRefresh(Date.now() + POLL_TIMEOUT);
      retrieveInfo(api).then(setInfo).catch(console.error);
    };

    getStatus();

    const timerId = window.setInterval(getStatus, POLL_TIMEOUT);

    return (): void => {
      window.clearInterval(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Summary
        info={info}
        nextRefresh={nextRefresh}
      />
      <Peers peers={info.peers} />
      <Extrinsics
        blockNumber={info.blockNumber}
        label={t('pending extrinsics')}
        value={info.extrinsics}
        withLink
      />
    </>
  );
}

export default React.memo(NodeInfo);
