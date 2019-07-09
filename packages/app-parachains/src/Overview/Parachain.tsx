// Copyright 2017-2019 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Bytes, Option } from '@polkadot/types';
import { Card, Static } from '@polkadot/ui-app';
import { styles as rowStyles } from '@polkadot/ui-app/Row';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  className?: string,
  paraId: BN,
  parachains_heads?: string | null,
  parachains_relayDispatchQueueSize?: [BN, BN]
};

class Parachain extends React.PureComponent<Props> {
  render () {
    const { className, paraId, parachains_heads, parachains_relayDispatchQueueSize, t } = this.props;

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
            value={parachains_heads || t('<unknown>')}
          />
          <Static
            help={t('the relay dispatch queue size')}
            label={t('relay queue')}
            value={
              parachains_relayDispatchQueueSize
                ? formatNumber(parachains_relayDispatchQueueSize[0])
                : '-'
            }
          />
        </div>
      </Card>
    );
  }
}

export default withMulti(
  styled(Parachain)`
    ${rowStyles}

    .parachains--Item-header {
      margin-bottom: 1rem;
    }
  `,
  translate,
  withCalls<Props>(
    ['query.parachains.heads', {
      paramName: 'paraId',
      transform: (heads: Option<Bytes>) =>
        heads.isSome ? heads.unwrap().toHex() : null
    }],
    ['query.parachains.relayDispatchQueueSize', { paramName: 'paraId' }]
  )
);
