/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { HeaderExtended } from '@polkadot/api-derive';
import { Columar } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import BlockHeader from '../BlockHeader';
import translate from '../translate';
import Events from './Events';
import Extrinsics from './Extrinsics';
import Logs from './Logs';

interface Props extends I18nProps {
  value: string;
}

function BlockByHash ({ className, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const events = useCall<EventRecord[]>(api.query.system.events.at as any, [value], { isSingle: true });
  const getBlock = useCall<SignedBlock>(api.rpc.chain.getBlock as any, [value], { isSingle: true });
  const getHeader = useCall<HeaderExtended>(api.derive.chain.getHeader as any, [value]);

  if (!getBlock || getBlock.isEmpty || !getHeader || getHeader.isEmpty) {
    return null;
  }

  return (
    <div className={className}>
      <header>
        <BlockHeader
          className='exporer--BlockByHash-BlockHeader'
          value={getHeader}
          withExplorer
        />
      </header>
      <Columar>
        <Extrinsics
          blockNumber={getHeader.number.unwrap()}
          value={getBlock.block.extrinsics}
        />
        <Events value={events} />
        <Logs value={getHeader.digest.logs} />
      </Columar>
    </div>
  );
}

export default translate(
  styled(BlockByHash)`
    .exporer--BlockByHash-BlockHeader {
      border: none;
      box-shadow: none;
    }
  `
);
