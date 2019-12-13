// Copyright 2017-2019 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Bytes, Option } from '@polkadot/types';
import { Card, Static } from '@polkadot/react-components';
import { styles as rowStyles } from '@polkadot/react-components/Row';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  className?: string;
  paraId: BN;
}

function Parachain ({ className, paraId, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const heads = useCall<string | null>(api.query.parachains.heads, [paraId], {
    transform: (heads: Option<Bytes>): string | null =>
      heads.isSome ? heads.unwrap().toHex() : null
  });
  const relayDispatchQueueSize = useCall<[BN, BN]>(api.query.parachains.relayDispatchQueueSize, [paraId]);

  return (
    <Card className={className}>
      <div className='ui--Row'>
        <div className='ui--Row-base'>
          <div className='ui--Row-details parachains--Item-header'>
            <h3>#{formatNumber(paraId)}</h3>
          </div>
        </div>
        <Static
          help={t('the last heads of this parachain')}
          label={t('heads')}
          value={heads || t('<unknown>')}
        />
        <Static
          help={t('the relay dispatch queue size')}
          label={t('relay queue')}
          value={
            relayDispatchQueueSize
              ? formatNumber(relayDispatchQueueSize[0])
              : '-'
          }
        />
      </div>
    </Card>
  );
}

export default translate(
  styled(Parachain)`
    ${rowStyles}

    .parachains--Item-header {
      margin-bottom: 1rem;
    }
  `
);
