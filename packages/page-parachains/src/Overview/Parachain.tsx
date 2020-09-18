// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeadData } from '@polkadot/types/interfaces';
import { DeriveParachain } from '@polkadot/api-derive/types';

import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Button, Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  parachain: DeriveParachain;
}

const transformHead = {
  transform: (headData: Option<HeadData>): string | null => {
    if (headData.isSome) {
      const hex = headData.unwrap().toHex();

      return `${hex.slice(0, 18)}…${hex.slice(-16)}`;
    }

    return null;
  }
};

function Parachain ({ className = '', parachain: { didUpdate, id, info, pendingSwapId, relayDispatchQueueSize = 0 } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const headHex = useCall<string | null>(api.query.parachains.heads, [id], transformHead);
  const history = useHistory();

  const _onClick = useCallback(
    () => history.push(`/parachains/${id.toString()}`),
    [history, id]
  );

  return (
    <tr
      className={className}
      onClick={_onClick}
    >
      <td className='number'>
        <h1>{id.toString()}</h1>
      </td>
      <td className='badges'>
        <div>
          <Badge
            className='did-update'
            color={didUpdate ? 'green' : 'gray'}
            hover={
              didUpdate
                ? t<string>('Updated in the latest block')
                : t<string>('Not updated in the last block')
            }
            info={<Icon icon='check' />}
          />
          <Badge
            className='pending-messages'
            color={relayDispatchQueueSize ? 'counter' : 'gray'}
            hover={t<string>('{{relayDispatchQueueSize}} dispatch messages pending', { replace: { relayDispatchQueueSize } })}
            info={formatNumber(relayDispatchQueueSize)}
          />
        </div>
      </td>
      <td className='all start together headhex'>{headHex}</td>
      <td className='number pending-swap-id media--800'>
        {pendingSwapId?.toString()}
      </td>
      <td className='number media--800'>
        {info?.scheduling?.toString() || t<string>('<unknown>')}
      </td>
      <td className='button'>
        <Button
          icon='arrow-right'
          label={t('Info')}
          onClick={_onClick}
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Parachain)`
  & {
    cursor: pointer !important;
  }

  h1 {
    margin-top: 0 !important;
  }

  td.badges > div {
    width: 3rem;
    display: flex;
    align-items: center;
  }

  td.info > div {
    display: flex;
    align-items: center;
  }

  td.pending-swap-id {
    &, & * {
      color: red !important;
    }
  }

  td.headhex {
    font-family: monospace;
  }

  .did-update {
    margin-bottom: 0;
  }
`);
