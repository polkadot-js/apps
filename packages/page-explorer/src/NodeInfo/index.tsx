// Copyright 2017-2020 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Info } from './types';

import React, { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi } from '@polkadot/react-hooks';

import Extrinsics from '../BlockInfo/Extrinsics';
import { useTranslation } from '../translate';
import Peers from './Peers';
import Summary from './Summary';

const POLL_TIMEOUT = 9900;

async function retrieveInfo (api: ApiPromise): Promise<Partial<Info>> {
  try {
    const [blockNumber, health, peers, extrinsics] = await Promise.all([
      api.derive.chain.bestNumber(),
      api.rpc.system.health(),
      api.rpc.system.peers(),
      api.rpc.author.pendingExtrinsics()
    ]);

    return { blockNumber, extrinsics, health, peers };
  } catch (error) {
    return {};
  }
}

function NodeInfo (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [info, setInfo] = useState<Partial<Info>>({});
  const [nextRefresh, setNextRefresh] = useState(Date.now());

  useEffect((): () => void => {
    const _getStatus = (): void => {
      retrieveInfo(api).then(setInfo).catch(console.error);
    };

    _getStatus();

    const timerId = window.setInterval((): void => {
      setNextRefresh(Date.now() + POLL_TIMEOUT);
      _getStatus();
    }, POLL_TIMEOUT);

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
        label={t<string>('pending extrinsics')}
        value={info.extrinsics}
      />
    </>
  );
}

export default React.memo(NodeInfo);
