// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachain } from '@polkadot/api-derive/types';

import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Icon } from '@polkadot/react-components';
import ParachainInfo from '../ParachainInfo';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  parachain: DeriveParachain;
}

function Parachain ({ className = '', parachain: { didUpdate, id, info, pendingSwapId, relayDispatchQueueSize = 0 } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const history = useHistory();

  const _onClick = useCallback(
    (): void => {
      history.push(`/parachains/${id.toString()}`);
    },
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
            color='green'
            hover={
              didUpdate
                ? t<string>('Updated in the latest block')
                : t<string>('Not updated in the last block')
            }
            info={
              <Icon icon='check' />
            }
            isGray={!didUpdate}
          />
          <Badge
            className='pending-messages'
            color='counter'
            hover={t<string>('{{relayDispatchQueueSize}} dispatch messages pending', {
              replace: {
                relayDispatchQueueSize
              }
            })}
            info={relayDispatchQueueSize}
            isGray={relayDispatchQueueSize <= 0}
          />
        </div>
      </td>
      <td className='all info'>
        <ParachainInfo info={info} />
      </td>
      <td className='all'></td>
      <td className='number pending-swap-id ui--media-small'>
        {pendingSwapId?.toString()}
      </td>
      <td className='number ui--media-small'>
        {info?.scheduling?.toString() || t<string>('<unknown>')}
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

  .did-update {
    margin-bottom: 0;
  }
`);
