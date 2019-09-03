// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';
import { Info } from './types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { ApiContext } from '@polkadot/react-api';

import './index.css';

import Extrinsics from '../BlockInfo/Extrinsics';
import Peers from './Peers';
import Summary from './Summary';
import translate from './translate';

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

function NodeInfo ({ t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [info, setInfo] = useState<Partial<Info>>({});
  const [nextRefresh, setNextRefresh] = useState(Date.now());
  const [timerId, setTimerId] = useState(0);

  const executeStatus = (isFirstRun = false): void => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getStatus(isFirstRun).catch((): void => {});
  };
  const getStatus = async (isFirstRun: boolean): Promise<void> => {
    if (isFirstRun || timerId) {
      setInfo(await retrieveInfo(api));
      setNextRefresh(Date.now() + POLL_TIMEOUT);
      setTimerId(window.setTimeout(executeStatus, POLL_TIMEOUT));
    }
  };

  useEffect((): () => void => {
    executeStatus(true);

    return (): void => {
      window.clearTimeout(timerId);
      setTimerId(0);
    };
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
      />
    </>
  );
}

export default translate(NodeInfo);
