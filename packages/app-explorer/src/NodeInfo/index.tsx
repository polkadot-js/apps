// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Health, PeerInfo, Extrinsic } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { Info } from './types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { Vec } from '@polkadot/types';

import './index.css';

import Extrinsics from '../BlockInfo/Extrinsics';
import Peers from './Peers';
import Summary from './Summary';
import translate from './translate';

const POLL_TIMEOUT = 9900;

type Props = I18nProps;

function NodeInfo ({ t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [info, setInfo] = useState<Partial<Info>>({});
  const [nextRefresh, setNextRefresh] = useState(Date.now());
  const [timerId, setTimerId] = useState(0);

  const executeStatus = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getStatus().catch((): void => {});
  };
  const getStatus = async (): Promise<void> => {
    try {
      const [blockNumber, health, peers, extrinsics] = await Promise.all([
        api.derive.chain.bestNumber(),
        api.rpc.system.health<Health>(),
        api.rpc.system.peers<Vec<PeerInfo>>(),
        api.rpc.author.pendingExtrinsics<Vec<Extrinsic>>()
      ]);

      setInfo({ blockNumber, extrinsics, health, peers });
    } catch (error) {
      setInfo({});
    }

    setNextRefresh(Date.now() + POLL_TIMEOUT);
    setTimerId(window.setTimeout(executeStatus, POLL_TIMEOUT));
  };

  useEffect((): () => void => {
    executeStatus();

    return (): void => {
      window.clearTimeout(timerId);
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
